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

  return createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      shipmentId,
      customerName,
      customerEmail,
      customerPhone,
    } = body;

    if (!shipmentId || !customerName) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing invoice request information.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const numericShipmentId = Number(shipmentId);

    // Check if this shipment already has an invoice request
    const {
      data: existingRequest,
      error: existingRequestError,
    } = await supabase
      .from("invoice_requests")
      .select(`
        id,
        request_status
      `)
      .eq("shipment_id", numericShipmentId)
      .maybeSingle();

    if (existingRequestError) {
      console.error(
        "Could not check existing invoice request:",
        existingRequestError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Could not verify whether an invoice request already exists.",
        },
        { status: 500 }
      );
    }

    if (existingRequest) {
      const message =
        existingRequest.request_status === "Invoice Generated"
          ? "An invoice has already been generated for this shipment."
          : "An invoice has already been requested for this shipment.";

      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 409 }
      );
    }

    // Create new invoice request
    const { data, error } = await supabase
      .from("invoice_requests")
      .insert({
        shipment_id: numericShipmentId,
        customer_name: customerName,
        customer_email:
          customerEmail || null,
        customer_phone:
          customerPhone || null,
        request_status: "Pending",
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Could not create invoice request:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      request: data,
    });
  } catch (error) {
    console.error(
      "Invoice request error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to request invoice.",
      },
      { status: 500 }
    );
  }
}