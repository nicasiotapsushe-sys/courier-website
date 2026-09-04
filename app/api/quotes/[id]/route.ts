import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return NextResponse.json(
        { success: false, error: "Supabase configuration is missing." },
        { status: 500 }
      );
    }

    const allowedStatuses = [
      "Pending",
      "Reviewed",
      "Quoted",
      "Accepted",
      "Rejected",
    ];

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: "Invalid quote status." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from("quotes")
      .update({
        status: body.status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Quote status update error:", error);

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quote: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not update quote status.",
      },
      { status: 500 }
    );
  }
}