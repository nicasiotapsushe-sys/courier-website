import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import PrintInvoiceButton from "./PrintInvoiceButton";

type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  unit_price_excl: number;
  discount_percent: number;
  vat_rate: number;
  excl_total: number;
  incl_total: number;
};

type PaymentProof = {
  id: number;
  payment_reference: string | null;
  amount_paid: number;
  status: string;
  created_at: string;
  verified_at: string | null;
};

type Invoice = {
  id: number;
  invoice_number: string;
  shipment_id: number | null;
  customer_name: string;
  customer_vat_number: string | null;
  customer_access_token: string;
  reference: string | null;
  invoice_date: string;
  due_date: string;
  subtotal_excl: number;
  vat_total: number;
  grand_total: number;
  amount_paid: number;
  balance_due: number;
  status: string;
  invoice_items: InvoiceItem[];
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY;

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

async function getInvoice(
  id: string
): Promise<Invoice | null> {
  const supabase = getSupabaseAdmin();

  const { data: invoice, error } =
    await supabase
      .from("invoices")
      .select("*")
      .eq("id", Number(id))
      .maybeSingle();

  if (error || !invoice) {
    console.error(
      "Could not load customer invoice:",
      error
    );

    return null;
  }

  const { data: items, error: itemsError } =
    await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", Number(id))
      .order("id", {
        ascending: true,
      });

  if (itemsError) {
    console.error(
      "Could not load invoice items:",
      itemsError
    );

    return null;
  }

  return {
    ...invoice,
    invoice_items: items ?? [],
  } as Invoice;
}

async function getPayments(
  invoiceId: number
): Promise<PaymentProof[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
  .from("payment_proofs")
  .select("*")
  .eq("invoice_id", invoiceId)
  .eq("status", "Verified");

  if (error) {
    console.error("Could not load invoice payments:", {
  message: error.message,
  code: error.code,
  details: error.details,
  hint: error.hint,
});

    return [];
  }

  return (data ?? []) as PaymentProof[];
}

export default async function CustomerInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  const invoice = await getInvoice(id);

  if (!invoice) {
    notFound();
  }

  if (
  !token ||
  token !== invoice.customer_access_token
) {
  notFound();
}

const payments = await getPayments(invoice.id);

  const isPaid =
    Number(invoice.balance_due) <= 0 ||
    invoice.status === "Paid";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 md:px-6 print:min-h-0 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl print:max-w-none">

        {/* Customer heading */}
        <div className="mb-6 print:hidden">
          <p className="text-sm font-black uppercase tracking-widest text-orange-500">
            Customer Invoice
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            {invoice.invoice_number}
          </h1>

          <p className="mt-2 text-slate-600">
            View your invoice and payment status.
          </p>

<div className="mt-5 print:hidden">
  <PrintInvoiceButton />
</div>

        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 print:rounded-none print:border-0 print:p-6 print:shadow-none">

          {/* Header */}
          <div className="flex flex-col justify-between gap-8 border-b border-slate-200 pb-8 md:flex-row">

            <div>
              <img
                src="/images/dropit-logo.png"
                alt="Drop It Courier Services"
                className="h-auto w-64 object-contain"
              />
            </div>

            <div className="space-y-2 text-sm md:text-right">
              <p>
                <strong>Invoice:</strong>{" "}
                {invoice.invoice_number}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {invoice.invoice_date}
              </p>

              <p>
                <strong>Due:</strong>{" "}
                {invoice.due_date}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-4 py-2 text-xs font-black uppercase ${
                  isPaid
                    ? "bg-green-100 text-green-700"
                    : invoice.status ===
                        "Partially Paid"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Company / Customer */}
          <div className="grid gap-8 border-b border-slate-200 py-8 md:grid-cols-2">

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                From
              </p>

              <h2 className="mt-3 text-lg font-black">
                Montelview Holdings (Pty) Ltd
                T/A Drop It
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                VAT No: BW00000418913
              </p>

              <p className="text-sm text-slate-600">
                P.O. Box 40977
              </p>

              <p className="text-sm text-slate-600">
                Plot 64271, Unit A1
              </p>

              <p className="text-sm text-slate-600">
                Block 3 Industrial, Gaborone
              </p>

              <p className="text-sm text-slate-600">
                Botswana
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Bill To
              </p>

              <h2 className="mt-3 text-lg font-black">
                {invoice.customer_name}
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                VAT No:{" "}
                {invoice.customer_vat_number ||
                  "—"}
              </p>

              {invoice.reference && (
                <p className="mt-1 text-sm text-slate-600">
                  Reference:{" "}
                  {invoice.reference}
                </p>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="overflow-x-auto py-8">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-600">
                    Description
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-600">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-600">
                    Price
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-600">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {invoice.invoice_items.map(
                  (item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 font-semibold">
                        {item.description}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {Number(
                          item.quantity
                        ).toFixed(2)}
                      </td>

                      <td className="px-4 py-4 text-right">
                        P{" "}
                        {Number(
                          item.unit_price_excl
                        ).toFixed(2)}
                      </td>

                      <td className="px-4 py-4 text-right font-black">
                        P{" "}
                        {Number(
                          item.incl_total
                        ).toFixed(2)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="ml-auto max-w-md rounded-2xl bg-slate-950 p-6 text-white">

            <div className="space-y-4">

              <div className="flex justify-between gap-6">
                <span className="text-slate-300">
                  Total Exclusive
                </span>

                <strong className="whitespace-nowrap">
                  P{" "}
                  {Number(
                    invoice.subtotal_excl
                  ).toFixed(2)}
                </strong>
              </div>

              <div className="flex justify-between gap-6">
                <span className="text-slate-300">
                  VAT
                </span>

                <strong className="whitespace-nowrap">
                  P{" "}
                  {Number(
                    invoice.vat_total
                  ).toFixed(2)}
                </strong>
              </div>

              <div className="flex justify-between gap-6 border-t border-slate-700 pt-4">
                <span className="font-black">
                  Grand Total
                </span>

                <strong className="whitespace-nowrap text-orange-400">
                  P{" "}
                  {Number(
                    invoice.grand_total
                  ).toFixed(2)}
                </strong>
              </div>

              <div className="flex justify-between gap-6">
                <span>Amount Paid</span>

                <strong className="whitespace-nowrap text-green-400">
                  P{" "}
                  {Number(
                    invoice.amount_paid
                  ).toFixed(2)}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-6 border-t border-slate-700 pt-4">
                <span className="text-lg font-black">
                  Balance Due
                </span>

                <strong className="whitespace-nowrap text-2xl font-black text-orange-400">
                  P{" "}
                  {Number(
                    invoice.balance_due
                  ).toFixed(2)}
                </strong>
              </div>

            </div>
          </div>

 {payments.length > 0 && (
  <div className="mt-8 border-t border-slate-200 pt-8">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
          Payment History
        </p>

        <p className="mt-1 text-sm text-slate-600">
          Verified payments received for this invoice.
        </p>
      </div>

      <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-black text-green-700">
        {payments.length}{" "}
        {payments.length === 1
          ? "Payment"
          : "Payments"}
      </span>
    </div>

    <div className="mt-5 overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-600">
              Date
            </th>

            <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-600">
              Reference
            </th>

            <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-600">
              Amount
            </th>

            <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-600">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="whitespace-nowrap px-4 py-4 text-sm">
                {new Date(
                  payment.verified_at ||
                    payment.created_at
                ).toLocaleDateString(
                  "en-BW"
                )}
              </td>

              <td className="px-4 py-4 text-sm font-semibold">
                {payment.payment_reference ||
                  "—"}
              </td>

              <td className="whitespace-nowrap px-4 py-4 text-right font-black">
                P{" "}
                {Number(
                  payment.amount_paid
                ).toFixed(2)}
              </td>

              <td className="px-4 py-4 text-right">
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-black uppercase text-green-700">
                  Verified
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}         

          {/* Payment area */}
          <div className="mt-8 border-t border-slate-200 pt-8 print:hidden">

            {isPaid ? (
              <div className="rounded-2xl bg-green-50 p-6 text-center">
                <div className="text-3xl">
                  ✓
                </div>

                <h3 className="mt-2 text-xl font-black text-green-700">
                  Invoice Fully Paid
                </h3>

                <p className="mt-2 text-sm text-green-700">
                  No outstanding balance remains
                  on this invoice.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-orange-50 p-6">
                <p className="text-sm font-bold text-orange-700">
                  Outstanding Balance
                </p>

                <p className="mt-1 text-3xl font-black text-slate-950">
                  P{" "}
                  {Number(
                    invoice.balance_due
                  ).toFixed(2)}
                </p>

                <a
                  href={`/payment-proof?invoiceId=${
                    invoice.id
                  }&shipmentId=${
                    invoice.shipment_id || ""
                  }&customerName=${encodeURIComponent(
                    invoice.customer_name
                  )}&amount=${
                    invoice.balance_due
                  }`}
                  className="mt-5 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-black text-white transition hover:bg-orange-600"
                >
                  Upload Proof of Payment
                </a>
              </div>
            )}

          </div>

          {/* Banking Details */}
          {!isPaid && (
            <div className="mt-8 border-t border-slate-200 pt-8">

              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Banking Details
              </p>

              <div className="mt-4 space-y-1 text-sm text-slate-700">
                <p>
                  <strong>
                    Account Name:
                  </strong>{" "}
                  MONTELVIEW HOLDINGS (PTY)
                  LTD
                </p>

                <p>
                  <strong>Bank:</strong>{" "}
                  First National Bank Botswana
                </p>

                <p>
                  <strong>
                    Account No:
                  </strong>{" "}
                  62537394710
                </p>

                <p>
                  <strong>Branch:</strong>{" "}
                  Francistown
                </p>

                <p>
                  <strong>
                    Branch Code:
                  </strong>{" "}
                  281867
                </p>
              </div>

            </div>
          )}

        </section>
      </div>
    </main>
  );
}