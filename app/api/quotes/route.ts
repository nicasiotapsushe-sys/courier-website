import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const body = await request.json();

    console.log("QUOTE RECEIVED:", body);

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        sender_name: body.senderName,
        phone_number: body.phoneNumber,
        email_address: body.emailAddress || null,
        pickup_address: body.pickupAddress,
        delivery_address: body.deliveryAddress,
        pickup_town: body.pickupTown,
        delivery_town: body.deliveryTown,
        parcel_type: body.parcelType,
        delivery_service: body.deliveryService,
        weight: body.weight || null,
        parcel_value: body.parcelValue || null,
        length: body.length || null,
        width: body.width || null,
        height: body.height || null,
        collection_date: body.collectionDate || null,
        special_instructions: body.specialInstructions || null,
        status: "Pending",
      })
      .select()
      .single();

    if (error) {
      console.error("SUPABASE QUOTE ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    console.log("QUOTE SAVED:", data);

    return NextResponse.json({
      success: true,
      message: "Quote request saved successfully.",
      quote: data,
    });
  } catch (error) {
    console.error("QUOTE API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not save quote request.",
      },
      { status: 500 }
    );
  }
}