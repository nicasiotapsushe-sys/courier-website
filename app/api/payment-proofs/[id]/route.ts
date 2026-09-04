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

    const status = String(body.status || "").trim();
    const adminNote = String(body.adminNote || "").trim();

    if (!id || Number.isNaN(Number(id))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment proof ID.",
        },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "Pending",
      "Verified",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment status.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // First get the payment proof so we know
    // which invoice belongs to it.
    const { data: paymentProof, error: proofError } =
      await supabase
        .from("payment_proofs")
        .select(`
          id,
          invoice_id,
          shipment_id,
          status
        `)
        .eq("id", Number(id))
        .maybeSingle();

    if (proofError) {
      console.error("Could not load payment proof:", {
        message: proofError.message,
        code: proofError.code,
        details: proofError.details,
        hint: proofError.hint,
      });

      return NextResponse.json(
        {
          success: false,
          error: proofError.message,
        },
        { status: 500 }
      );
    }

    if (!paymentProof) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment proof not found.",
        },
        { status: 404 }
      );
    }

// Prevent the same POP from being verified more than once.
if (
  status === "Verified" &&
  paymentProof.status === "Verified"
) {
  return NextResponse.json(
    {
      success: false,
      error:
        "This payment proof has already been verified and cannot be counted again.",
    },
    { status: 409 }
  );
}

    const { data: updatedProof, error: updateError } =
      await supabase
        .from("payment_proofs")
        .update({
          status,
          admin_note: adminNote || null,
          verified_at:
            status === "Verified"
              ? new Date().toISOString()
              : null,
        })
        .eq("id", Number(id))
        .select()
        .single();

   if (updateError) {
  console.error("Could not update payment proof:", {
    message: updateError.message,
    code: updateError.code,
    details: updateError.details,
    hint: updateError.hint,
  });

  return NextResponse.json(
    {
      success: false,
      error: updateError.message,
    },
    { status: 500 }
  );
}

// If the POP has been verified, update the linked invoice.
if (status === "Verified") {
  const { data: invoice, error: invoiceError } =
    await supabase
      .from("invoices")
      .select(`
        id,
        grand_total,
        amount_paid,
        balance_due,
        status
      `)
      .eq("id", paymentProof.invoice_id)
      .maybeSingle();

  if (invoiceError) {
    console.error("Could not load linked invoice:", {
      message: invoiceError.message,
      code: invoiceError.code,
      details: invoiceError.details,
      hint: invoiceError.hint,
    });

    return NextResponse.json(
      {
        success: false,
        error:
          "Payment was verified, but the invoice could not be loaded.",
      },
      { status: 500 }
    );
  }

  if (!invoice) {
    return NextResponse.json(
      {
        success: false,
        error: "Linked invoice was not found.",
      },
      { status: 404 }
    );
  }

  const { data: fullPaymentProof, error: amountError } =
    await supabase
      .from("payment_proofs")
      .select("amount_paid")
      .eq("id", Number(id))
      .single();

  if (amountError) {
    return NextResponse.json(
      {
        success: false,
        error: "Could not read the payment amount.",
      },
      { status: 500 }
    );
  }

  const paymentAmount = Number(
    fullPaymentProof.amount_paid || 0
  );

  const currentAmountPaid = Number(
    invoice.amount_paid || 0
  );

  const grandTotal = Number(
    invoice.grand_total || 0
  );

const currentBalance = Number(invoice.balance_due || 0);

if (status === "Verified") {
  if (currentBalance <= 0) {
    return NextResponse.json(
      {
        success: false,
        error:
          "This invoice is already fully paid. No additional payments can be verified.",
      },
      { status: 409 }
    );
  }

  if (paymentAmount > currentBalance) {
    return NextResponse.json(
      {
        success: false,
        error: `Payment amount exceeds the remaining balance of P${currentBalance.toFixed(
          2
        )}.`,
      },
      { status: 409 }
    );
  }
}

  const newAmountPaid =
    currentAmountPaid + paymentAmount;

  const newBalance = Math.max(
    grandTotal - newAmountPaid,
    0
  );

  const invoiceStatus =
    newBalance <= 0
      ? "Paid"
      : newAmountPaid > 0
        ? "Partially Paid"
        : invoice.status;

  const { error: invoiceUpdateError } =
    await supabase
      .from("invoices")
      .update({
        amount_paid: newAmountPaid,
        balance_due: newBalance,
        status: invoiceStatus,
      })
      .eq("id", paymentProof.invoice_id);

  if (invoiceUpdateError) {
    console.error("Could not update invoice payment:", {
      message: invoiceUpdateError.message,
      code: invoiceUpdateError.code,
      details: invoiceUpdateError.details,
      hint: invoiceUpdateError.hint,
    });

    return NextResponse.json(
      {
        success: false,
        error:
          "Payment was verified, but the invoice could not be updated.",
      },
      { status: 500 }
    );
  }
}

    return NextResponse.json({
      success: true,
      message:
        status === "Verified"
          ? "Payment verified successfully."
          : status === "Rejected"
            ? "Payment proof rejected."
            : "Payment status updated.",
      paymentProof: updatedProof,
      invoiceId: paymentProof.invoice_id,
    });
  } catch (error) {
    console.error(
      "Payment proof PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not update payment proof.",
      },
      { status: 500 }
    );
  }
}