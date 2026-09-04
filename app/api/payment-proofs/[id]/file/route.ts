import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "Supabase environment variables are missing."
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const supabase = getSupabaseAdmin();

    const { data: paymentProof, error } =
      await supabase
        .from("payment_proofs")
        .select(`
          id,
          invoice_id,
          file_url,
          file_name
        `)
        .eq("id", Number(id))
        .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    if (!paymentProof) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment proof not found.",
        },
        { status: 404 }
      );
    }

    /*
      Your current database stores file_url.

      We extract the storage path from that value.
      Example:
      .../payment-proofs/invoice-1/invoice-1-123456.png
    */

    const marker = "/payment-proofs/";

    const markerIndex =
      paymentProof.file_url.indexOf(marker);

    if (markerIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not determine POP storage path.",
        },
        { status: 500 }
      );
    }

    const storagePath =
      paymentProof.file_url.substring(
        markerIndex + marker.length
      );

    const { data: signedData, error: signedError } =
      await supabase.storage
        .from("payment-proofs")
        .createSignedUrl(
          storagePath,
          60 * 10
        );

    if (signedError || !signedData?.signedUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            signedError?.message ||
            "Could not create secure POP link.",
        },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      signedData.signedUrl
    );
  } catch (error) {
    console.error(
      "Secure POP file error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not open payment proof.",
      },
      { status: 500 }
    );
  }
}