import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function generateInvoiceNumber() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("invoices")
    .select("invoice_number")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.invoice_number) {
    return "INV4468";
  }

  const currentNumber = Number(
    data.invoice_number.replace("INV", "")
  );

  const nextNumber =
    Number.isNaN(currentNumber)
      ? 4468
      : currentNumber + 1;

  return `INV${nextNumber}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabase = getSupabaseAdmin();

    const invoiceNumber =
      await generateInvoiceNumber();

    const {
      shipmentId,
      customerName,
      invoiceDate,
      dueDate,
      salesRep,
      description,
      quantity,
      unitPriceExcl,
      discountPercent,
      vatRate,
    } = body;

    const qty = Number(quantity);
    const price = Number(unitPriceExcl);
    const discount = Number(discountPercent);
    const vat = Number(vatRate);

    if (
      !shipmentId ||
      !customerName ||
      !invoiceDate ||
      !dueDate ||
      !description ||
      qty <= 0 ||
      price < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing or invalid invoice information.",
        },
        { status: 400 }
      );
    }

    const beforeDiscount = qty * price;

    const discountAmount =
      beforeDiscount * (discount / 100);

    const exclusiveTotal =
      beforeDiscount - discountAmount;

    const vatAmount =
      exclusiveTotal * (vat / 100);

    const inclusiveTotal =
      exclusiveTotal + vatAmount;

    const { data: invoice, error: invoiceError } =
      await supabase
        .from("invoices")
        .insert({
          invoice_number: invoiceNumber,
          shipment_id: Number(shipmentId),
          customer_name: customerName,
          customer_vat_number: null,
          reference: null,
          invoice_date: invoiceDate,
          due_date: dueDate,
          sales_rep: salesRep || null,
          overall_discount_percent: discount,
          subtotal_excl: exclusiveTotal,
          vat_total: vatAmount,
          grand_total: inclusiveTotal,
          amount_paid: 0,
          balance_due: inclusiveTotal,
          status: "Issued",
        })
        .select()
        .single();

    if (invoiceError) {
      console.error("Could not create invoice:", invoiceError);

      return NextResponse.json(
        {
          success: false,
          error: invoiceError.message,
        },
        { status: 500 }
      );
    }

    const { error: itemError } = await supabase
      .from("invoice_items")
      .insert({
        invoice_id: invoice.id,
        description,
        quantity: qty,
        unit_price_excl: price,
        discount_percent: discount,
        vat_rate: vat,
        excl_total: exclusiveTotal,
        incl_total: inclusiveTotal,
      });

    if (itemError) {
      console.error(
        "Could not create invoice item:",
        itemError
      );

      return NextResponse.json(
        {
          success: false,
          error: itemError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("Create invoice error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create invoice.",
      },
      { status: 500 }
    );
  }
}