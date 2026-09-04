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

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const requestStatus = String(
      body.requestStatus || ""
    ).trim();

    const invoiceId = body.invoiceId
      ? Number(body.invoiceId)
      : null;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice request ID is missing.",
        },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Invoice Generated",
      "Rejected",
    ];

    if (!allowedStatuses.includes(requestStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid invoice request status.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const updateData: {
      request_status: string;
      invoice_id?: number | null;
    } = {
      request_status: requestStatus,
    };

    if (invoiceId) {
      updateData.invoice_id = invoiceId;
    }

    const { data, error } = await supabase
      .from("invoice_requests")
      .update(updateData)
      .eq("id", Number(id))
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Invoice request PATCH Supabase error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice request was not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      request: data,
    });
  } catch (error) {
    console.error("Invoice request PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update invoice request.",
      },
      { status: 500 }
    );
  }
}