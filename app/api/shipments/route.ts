import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase URL is missing.",
        },
        { status: 500 }
      );
    }

    if (!supabaseSecretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase secret key is missing.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const body = await request.json();

    if (
  body.quoteId !== null &&
  body.quoteId !== undefined &&
  body.quoteId !== ""
) {
  const quoteId = Number(body.quoteId);

  // Confirm that the quote exists and has been accepted.
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .select("id, status")
    .eq("id", quoteId)
    .single();

  if (quoteError || !quote) {
    return NextResponse.json(
      {
        success: false,
        error: "Quote not found.",
      },
      { status: 404 }
    );
  }

  if (quote.status !== "Accepted") {
    return NextResponse.json(
      {
        success: false,
        error:
          "A shipment can only be created from an accepted quote.",
      },
      { status: 400 }
    );
  }

  // Prevent one quote from creating multiple shipments.
  const {
    data: existingShipment,
    error: existingShipmentError,
  } = await supabase
    .from("shipments")
    .select("id, tracking_number")
    .eq("quote_id", quoteId)
    .maybeSingle();

  if (existingShipmentError) {
    console.error(
      "Could not check existing quote shipment:",
      existingShipmentError
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Could not verify whether this quote already has a shipment.",
      },
      { status: 500 }
    );
  }

  if (existingShipment) {
    return NextResponse.json(
      {
        success: false,
        error: `This quote already has shipment ${existingShipment.tracking_number}.`,
      },
      { status: 409 }
    );
  }
}

    if (
  body.quoteId !== null &&
  body.quoteId !== undefined &&
  body.quoteId !== "" &&
  (!Number.isInteger(Number(body.quoteId)) ||
    Number(body.quoteId) <= 0)
) {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid quote ID.",
    },
    { status: 400 }
  );
}

    const { data, error } = await supabase
      .from("shipments")
      .insert({
        quote_id:
  body.quoteId !== null &&
  body.quoteId !== undefined &&
  body.quoteId !== ""
    ? Number(body.quoteId)
    : null,
        tracking_number: body.trackingNumber,

        sender_name: body.senderName,
        sender_phone: body.senderPhone,
        sender_email: body.senderEmail || null,

        pickup_address: body.pickupAddress,
        origin: body.origin,

        recipient_name: body.recipientName,
        recipient_phone: body.recipientPhone,
        recipient_email: body.recipientEmail || null,

        delivery_address: body.deliveryAddress,
        destination: body.destination,

        parcel_type: body.parcelType,
        service: body.service,

        weight: body.weight,
        parcel_value: body.parcelValue ?? null,

        payment_status: body.paymentStatus,

        current_status: "Pending",
        current_location: body.origin,

        estimated_delivery: body.estimatedDelivery,

        notes: body.notes || null,

      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    console.log("Shipment saved:", data);

    const { error: trackingEventError } = await supabase
  .from("tracking_events")
  .insert({
    shipment_id: data.id,
    status: "Shipment Created",
    location: body.origin,
    description: "Shipment registered in the courier system",
    event_time: new Date().toISOString(),
  });

if (trackingEventError) {
  console.error(
    "Could not create initial tracking event:",
    trackingEventError
  );

  return NextResponse.json(
    {
      success: false,
      error: trackingEventError.message,
    },
    { status: 500 }
  );
}

    return NextResponse.json({
      success: true,
      message: "Shipment saved successfully.",
      shipment: data,
    });
  } catch (error) {
    console.error("Create shipment error:", error);

    

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create shipment.",
      },
      { status: 500 }
    );
  }
}