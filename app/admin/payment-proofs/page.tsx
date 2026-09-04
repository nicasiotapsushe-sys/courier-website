import PaymentProofsTable from "./PaymentProofsTable";
import { createClient } from "@supabase/supabase-js";

type PaymentProof = {
  id: number;
  invoice_id: number;
  shipment_id: number;
  customer_name: string;
  customer_phone: string | null;
  payment_reference: string | null;
  amount_paid: number | null;
  status: string;
  uploaded_at: string;
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

async function getPaymentProofs(): Promise<PaymentProof[]> {
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
      uploaded_at
    `)
    .order("uploaded_at", {
      ascending: false,
    });

  if (error) {
    console.error("Could not load payment proofs:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    return [];
  }

  return (data ?? []) as PaymentProof[];
}



export default async function PaymentProofsPage() {
  const proofs = await getPaymentProofs();

  const pendingCount = proofs.filter(
    (proof) => proof.status === "Pending"
  ).length;

  const verifiedCount = proofs.filter(
    (proof) => proof.status === "Verified"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-widest text-orange-500">
          Payment Management
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Payment Proofs
        </h1>

        <p className="mt-3 text-slate-600">
          Review and verify customer proof of payment submissions.
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-950 p-7 text-white">
            <p className="text-sm font-bold text-slate-400">
              Total Uploads
            </p>

            <p className="mt-3 text-3xl font-black">
              {proofs.length}
            </p>
          </div>

          <div className="rounded-3xl bg-orange-500 p-7 text-white">
            <p className="text-sm font-bold text-orange-100">
              Pending
            </p>

            <p className="mt-3 text-3xl font-black">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-3xl bg-green-700 p-7 text-white">
            <p className="text-sm font-bold text-green-100">
              Verified
            </p>

            <p className="mt-3 text-3xl font-black">
              {verifiedCount}
            </p>
          </div>
        </section>

        <PaymentProofsTable proofs={proofs} />
      </div>
    </main>
  );
}