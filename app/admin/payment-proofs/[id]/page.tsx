import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import PaymentProofActions from "./PaymentProofActions";
type PaymentProof = {
  id: number;
  invoice_id: number;
  shipment_id: number;
  customer_name: string;
  customer_phone: string | null;
  payment_reference: string | null;
  amount_paid: number | null;
  status: string;
  admin_note: string | null;
  file_name: string | null;
  file_url: string;
  uploaded_at: string;
  verified_at: string | null;
};

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

async function getPaymentProof(
  id: string
): Promise<PaymentProof | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("payment_proofs")
    .select(`
      id,
      invoice_id,
      shipment_id,
      customer_name,
      customer_phone,
      payment_reference,
      amount_paid,
      status,
      admin_note,
      file_name,
      file_url,
      uploaded_at,
      verified_at
    `)
    .eq("id", Number(id))
    .maybeSingle();

  if (error) {
    console.error("Could not load payment proof:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    return null;
  }

  return data as PaymentProof | null;
}

function getStatusClasses(status: string) {
  switch (status) {
    case "Verified":
      return "bg-green-100 text-green-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-orange-100 text-orange-700";
  }
}

export default async function PaymentProofDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const paymentProof = await getPaymentProof(id);

  if (!paymentProof) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <Link
              href="/admin/payment-proofs"
              className="text-sm font-bold text-blue-700 hover:text-blue-900"
            >
              ← Back to Payment Proofs
            </Link>

            <p className="mt-6 text-sm font-black uppercase tracking-widest text-orange-500">
              Payment Verification
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Payment Proof #{paymentProof.id}
            </h1>

            <p className="mt-3 text-slate-600">
              Review the customer's submitted payment
              information before verifying it.
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-black ${getStatusClasses(
              paymentProof.status
            )}`}
          >
            {paymentProof.status}
          </span>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-black">
              Customer Details
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Customer
                </p>

                <p className="mt-1 font-bold">
                  {paymentProof.customer_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Phone
                </p>

                <p className="mt-1 font-bold">
                  {paymentProof.customer_phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Uploaded
                </p>

                <p className="mt-1 font-bold">
                  {new Date(
                    paymentProof.uploaded_at
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-black">
              Payment Details
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Invoice
                </p>

                <Link
                  href={`/admin/invoices/${paymentProof.invoice_id}`}
                  className="mt-1 inline-block font-black text-blue-700 hover:text-blue-900"
                >
                  Invoice #{paymentProof.invoice_id} →
                </Link>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Shipment ID
                </p>

                <p className="mt-1 font-bold">
                  #{paymentProof.shipment_id}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Payment Reference
                </p>

                <p className="mt-1 font-bold">
                  {paymentProof.payment_reference || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Amount Paid
                </p>

                <p className="mt-1 text-2xl font-black">
                  {paymentProof.amount_paid !== null
                    ? `P ${Number(
                        paymentProof.amount_paid
                      ).toFixed(2)}`
                    : "—"}
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-black">
            Proof of Payment
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {paymentProof.file_name ||
              "Uploaded payment document"}
          </p>

          <div className="mt-6">
            <a
              href={`/api/payment-proofs/${paymentProof.id}/file`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-slate-950 px-6 py-3 font-black text-white transition hover:bg-slate-800"
            >
              View Uploaded POP
            </a>
          </div>
        </section>

        {paymentProof.admin_note && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-black">
              Admin Note
            </h2>

            <p className="mt-3 text-slate-700">
              {paymentProof.admin_note}
            </p>
          </section>
        )}

        <PaymentProofActions
  paymentProofId={paymentProof.id}
  currentStatus={paymentProof.status}
/>
      </div>
    </main>
  );
}