import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { trackingNumber } = await params;

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

    const cleanedTrackingNumber = decodeURIComponent(
      trackingNumber
    )
      .trim()
      .toUpperCase();

    const { data, error } = await supabase
      .from("shipments")
      .select(`
        id,
        tracking_number,
        sender_name,
        recipient_name,
        origin,
        destination,
        current_location,
        current_status,
        service,
        weight,
        estimated_delivery,
        delivered_at,
  received_by,
        created_at,
        tracking_events (
          status,
          location,
          description,
          event_time
        )
      `)
      .eq("tracking_number", cleanedTrackingNumber)
      .maybeSingle();

    if (error) {
      console.error("Supabase tracking error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Tracking number not found.",
        },
        { status: 404 }
      );
    }

    const sortedEvents = [...(data.tracking_events || [])].sort(
      (a, b) =>
        new Date(a.event_time).getTime() -
        new Date(b.event_time).getTime()
    );

    return NextResponse.json({
      success: true,
      shipment: {
        ...data,
        tracking_events: sortedEvents,
      },
    });
  } catch (error) {
    console.error("Tracking API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve shipment.",
      },
      { status: 500 }
    );
  }
}