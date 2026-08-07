import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("shipments")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          connected: false,
          error: error.message,
          code: error.code,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      connected: true,
      message: "Supabase connection successful",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error:
          error instanceof Error ? error.message : "Unknown connection error",
      },
      { status: 500 },
    );
  }
}