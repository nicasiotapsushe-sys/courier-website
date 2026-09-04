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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const invoiceId = formData.get("invoiceId");
    const shipmentId = formData.get("shipmentId");
    const customerName = formData.get("customerName");
    const customerPhone = formData.get("customerPhone");
    const paymentReference = formData.get("paymentReference");
    const amountPaid = formData.get("amountPaid");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please select a proof of payment file.",
        },
        { status: 400 }
      );
    }

    if (!invoiceId || !shipmentId || !customerName) {
      return NextResponse.json(
        {
          success: false,
          error: "Required payment information is missing.",
        },
        { status: 400 }
      );
    }
const numericAmountPaid = Number(amountPaid);

if (
  !amountPaid ||
  Number.isNaN(numericAmountPaid) ||
  numericAmountPaid <= 0
) {
  return NextResponse.json(
    {
      success: false,
      error: "Amount paid must be greater than P0.00.",
    },
    { status: 400 }
  );
}
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "POP must be a JPG, PNG, WEBP or PDF file.",
        },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "POP file must be smaller than 10 MB.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const numericInvoiceId = Number(invoiceId);

const {
  data: invoice,
  error: invoiceError,
} = await supabase
  .from("invoices")
  .select("id, shipment_id, balance_due, status")
  .eq("id", numericInvoiceId)
  .single();



if (invoiceError || !invoice) {
  return NextResponse.json(
    {
      success: false,
      error: "Could not verify the invoice balance.",
    },
    { status: 400 }
  );
}

const numericShipmentId = Number(shipmentId);

if (
  !Number.isInteger(numericShipmentId) ||
  numericShipmentId <= 0
) {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid shipment information.",
    },
    { status: 400 }
  );
}

if (Number(invoice.shipment_id) !== numericShipmentId) {
  return NextResponse.json(
    {
      success: false,
      error:
        "This shipment does not belong to the selected invoice.",
    },
    { status: 400 }
  );
}


const currentBalance = Number(invoice.balance_due || 0);

if (currentBalance <= 0) {
  return NextResponse.json(
    {
      success: false,
      error: "This invoice is already fully paid.",
    },
    { status: 409 }
  );
}

if (numericAmountPaid > currentBalance) {
  return NextResponse.json(
    {
      success: false,
      error: `Amount paid cannot exceed the outstanding balance of P${currentBalance.toFixed(
        2
      )}.`,
    },
    { status: 400 }
  );
}

const {
  data: pendingProofs,
  error: pendingProofError,
} = await supabase
  .from("payment_proofs")
  .select("id, status")
  .eq("invoice_id", numericInvoiceId)
  .eq("shipment_id", numericShipmentId)
  .eq("status", "Pending");

if (pendingProofError) {
  console.error(
    "Could not check pending payment proofs:",
    pendingProofError
  );

  return NextResponse.json(
    {
      success: false,
      error: "Could not validate payment submission.",
    },
    { status: 500 }
  );
}

if (pendingProofs && pendingProofs.length > 0) {
  return NextResponse.json(
    {
      success: false,
      error:
        "A payment proof for this invoice is already pending verification.",
    },
    { status: 409 }
  );
}


    const extension =
      file.name.split(".").pop()?.toLowerCase() || "file";

    const safeFileName =
      `invoice-${invoiceId}-${Date.now()}.${extension}`;

    const storagePath =
      `invoice-${invoiceId}/${safeFileName}`;

    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("POP storage upload error:", {
        message: uploadError.message,
      });

      return NextResponse.json(
        {
          success: false,
          error: uploadError.message,
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(storagePath);

    const fileUrl = publicUrlData.publicUrl;

    const { data: paymentProof, error: databaseError } =
      await supabase
        .from("payment_proofs")
        .insert({
          invoice_id: Number(invoiceId),
          shipment_id: Number(shipmentId),
          customer_name: String(customerName),
          customer_phone: customerPhone
            ? String(customerPhone)
            : null,
          file_url: fileUrl,
          file_name: file.name,
          payment_reference: paymentReference
            ? String(paymentReference)
            : null,
          amount_paid: numericAmountPaid,
          status: "Pending",
        })
        .select()
        .single();

    if (databaseError) {
      // Remove the uploaded file if the database insert fails.
      await supabase.storage
        .from("payment-proofs")
        .remove([storagePath]);

      console.error("POP database error:", {
        message: databaseError.message,
        code: databaseError.code,
        details: databaseError.details,
        hint: databaseError.hint,
      });

      return NextResponse.json(
        {
          success: false,
          error: databaseError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Proof of payment submitted successfully and is awaiting verification.",
      paymentProof,
    });
  } catch (error) {
    console.error("POP upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not upload proof of payment.",
      },
      { status: 500 }
    );
  }
}