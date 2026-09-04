import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type Quote = {
  id: number;
  sender_name: string;
  phone_number: string;
  email_address: string | null;
  pickup_address: string;
  delivery_address: string;
  pickup_town: string;
  delivery_town: string;
  parcel_type: string;
  delivery_service: string;
  weight: number | null;
  parcel_value: number | null;
  quoted_price: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  collection_date: string | null;
  special_instructions: string | null;
  status: string;
  created_at: string;
  customer_access_token: string;
};

async function getCustomerQuote(
  id: string,
  token: string
): Promise<Quote | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return null;
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

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .eq("customer_access_token", token)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function respondToQuote(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const token = String(formData.get("token") || "");
  const decision = String(formData.get("decision") || "");

  if (
    !id ||
    !token ||
    !["Accepted", "Rejected"].includes(decision)
  ) {
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return;
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

  // Only a valid secure token can respond,
  // and only while the quotation is still Quoted.
  const { data, error } = await supabase
    .from("quotes")
    .update({
      status: decision,
    })
    .eq("id", id)
    .eq("customer_access_token", token)
    .eq("status", "Quoted")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Could not respond to quotation:", error);
    return;
  }

  if (!data) {
    redirect(
      `/quote/${id}?token=${encodeURIComponent(token)}`
    );
  }

  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${id}`);
  revalidatePath(`/quote/${id}`);

  redirect(
    `/quote/${id}?token=${encodeURIComponent(token)}`
  );
}

export default async function CustomerQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  const quote = await getCustomerQuote(id, token);

  if (!quote) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
            Drop It Courier Services
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Your Quotation
          </h1>

          <p className="mt-3 text-slate-500">
            Quote #{quote.id}
          </p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="bg-slate-950 px-8 py-8 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
              Quoted Amount
            </p>

            <p className="mt-3 text-5xl font-black">
              {quote.quoted_price !== null
                ? `P${Number(
                    quote.quoted_price
                  ).toFixed(2)}`
                : "Pending"}
            </p>

            <div className="mt-5">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                {quote.status}
              </span>
            </div>
          </div>

          <div className="p-8">

            <section>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Customer
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {quote.sender_name}
              </h2>
            </section>

            <section className="mt-8 border-t border-slate-200 pt-8">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Delivery Route
              </p>

              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-bold text-slate-400">
                    FROM
                  </p>

                  <p className="mt-1 text-xl font-black">
                    {quote.pickup_town}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {quote.pickup_address}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-400">
                    TO
                  </p>

                  <p className="mt-1 text-xl font-black">
                    {quote.delivery_town}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {quote.delivery_address}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8 border-t border-slate-200 pt-8">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Parcel Details
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-sm text-slate-500">
                    Parcel type
                  </p>
                  <p className="mt-1 font-black">
                    {quote.parcel_type}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Delivery service
                  </p>
                  <p className="mt-1 font-black">
                    {quote.delivery_service}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Weight
                  </p>
                  <p className="mt-1 font-black">
                    {quote.weight !== null
                      ? `${quote.weight} kg`
                      : "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Parcel value
                  </p>
                  <p className="mt-1 font-black">
                    {quote.parcel_value !== null
                      ? `P${Number(
                          quote.parcel_value
                        ).toFixed(2)}`
                      : "Not provided"}
                  </p>
                </div>

              </div>
            </section>

            {quote.special_instructions && (
              <section className="mt-8 border-t border-slate-200 pt-8">
                <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                  Special Instructions
                </p>

                <p className="mt-4 leading-7 text-slate-600">
                  {quote.special_instructions}
                </p>
              </section>
            )}

            <section className="mt-8 rounded-2xl bg-slate-50 p-6">
              <p className="text-sm leading-6 text-slate-500">
                Please review the quotation details carefully.
                If you have any questions regarding the price
                or delivery details, contact Drop It Courier
                Services before accepting the quotation.
              </p>
            </section>
            {quote.status === "Quoted" &&
quote.quoted_price !== null &&
quote.quoted_price > 0 ? (
  <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">
    <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
      Your Decision
    </p>

    <h2 className="mt-2 text-2xl font-black text-slate-950">
      Would you like to proceed?
    </h2>

    <p className="mt-3 text-slate-600">
      Please review the quotation details above before
      accepting. Once accepted, Drop It can proceed with
      creating your shipment.
    </p>

    <form
      action={respondToQuote}
      className="mt-6 flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="hidden"
        name="id"
        value={quote.id}
      />

      <input
        type="hidden"
        name="token"
        value={token}
      />

      <button
        type="submit"
        name="decision"
        value="Accepted"
        className="rounded-xl bg-green-600 px-7 py-4 font-black text-white transition hover:bg-green-700"
      >
        Accept Quote
      </button>

      <button
        type="submit"
        name="decision"
        value="Rejected"
        className="rounded-xl border border-red-200 bg-red-50 px-7 py-4 font-black text-red-700 transition hover:bg-red-100"
      >
        Reject Quote
      </button>
    </form>
  </section>
) : null}

{quote.status === "Accepted" ? (
  <section className="mt-8 rounded-3xl border border-green-200 bg-green-50 p-8">
    <p className="text-sm font-black uppercase tracking-widest text-green-700">
      Quotation Accepted
    </p>

    <h2 className="mt-2 text-2xl font-black text-green-950">
      Thank you. Your quotation has been accepted.
    </h2>

    <p className="mt-3 text-green-800">
      Drop It Courier Services can now proceed with your
      shipment arrangements.
    </p>
  </section>
) : null}

{quote.status === "Rejected" ? (
  <section className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8">
    <p className="text-sm font-black uppercase tracking-widest text-red-700">
      Quotation Declined
    </p>

    <h2 className="mt-2 text-2xl font-black text-red-950">
      You have declined this quotation.
    </h2>

    <p className="mt-3 text-red-800">
      Contact Drop It Courier Services if you would like
      the quotation to be reviewed.
    </p>
  </section>
) : null}

          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Montelview Holdings (Pty) Ltd T/A Drop It
        </p>

      </div>
    </main>
  );
}