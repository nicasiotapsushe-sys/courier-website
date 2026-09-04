import QuotesTable from "./QuotesTable";
import { createClient } from "@supabase/supabase-js";

type Quote = {
  id: number;
  sender_name: string;
  phone_number: string;
  email_address: string | null;
  pickup_town: string;
  delivery_town: string;
  delivery_service: string;
  quoted_price: number | null;
  status: string;
  created_at: string;
};

async function getQuotes(): Promise<Quote[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase
    .from("quotes")
    .select(
      `
      id,
      sender_name,
      phone_number,
      email_address,
      pickup_town,
      delivery_town,
      delivery_service,
      quoted_price,
      status,
      created_at
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load quotes:", error);
    return [];
  }

  return data ?? [];
}



export default async function AdminQuotesPage() {
  const quotes = await getQuotes();

  const pendingCount = quotes.filter(
    (quote) => quote.status === "Pending"
  ).length;

  const quotedCount = quotes.filter(
    (quote) => quote.status === "Quoted"
  ).length;

  const acceptedCount = quotes.filter(
    (quote) => quote.status === "Accepted"
  ).length;

  const rejectedCount = quotes.filter(
  (quote) => quote.status === "Rejected"
).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <a
              href="/admin"
              className="text-sm font-bold text-orange-600 transition hover:text-orange-700"
            >
              ← Back to Dashboard
            </a>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-orange-500">
              Admin Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Quote Requests
            </h1>

            <p className="mt-3 text-slate-600">
              Review quotation requests, set prices and track customer responses.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 px-6 py-4 text-white">
            <p className="text-sm text-slate-400">
              Total requests
            </p>

            <p className="mt-1 text-3xl font-black">
              {quotes.length}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">
              Total Quotes
            </p>

            <p className="mt-2 text-3xl font-black">
              {quotes.length}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
            <p className="text-sm font-bold text-orange-700">
              Pending
            </p>

            <p className="mt-2 text-3xl font-black text-orange-900">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
            <p className="text-sm font-bold text-purple-700">
              Quoted
            </p>

            <p className="mt-2 text-3xl font-black text-purple-900">
              {quotedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
            <p className="text-sm font-bold text-green-700">
              Accepted
            </p>

            <p className="mt-2 text-3xl font-black text-green-900">
              {acceptedCount}
            </p>
          </div>

<div className="rounded-2xl border border-red-200 bg-red-50 p-6">
  <p className="text-sm font-bold text-red-700">
    Rejected
  </p>

  <p className="mt-2 text-3xl font-black text-red-900">
    {rejectedCount}
  </p>
</div>

        </div>

        
        <QuotesTable quotes={quotes} />

      </div>
    </main>
  );
}