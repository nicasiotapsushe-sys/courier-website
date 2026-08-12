import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase URL is missing.",
        },
        { status: 500 },
      );
    }

    if (!supabaseSecretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase secret key is missing.",
        },
        { status: 500 },
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
      },
    );

    const body = await request.json();

    const { data, error } = await supabase
      .from("shipments")
      .insert({
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
        parcel_value: body.parcelValue || null,

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
        { status: 500 },
      );
    }

    console.log("Shipment saved:", data);

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
      { status: 500 },
    );
  }
}