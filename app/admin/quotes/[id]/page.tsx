import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

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

function normalizeBotswanaPhone(phone: string) {
  const cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");

  if (cleaned.startsWith("+267")) {
    return cleaned.slice(4);
  }

  if (cleaned.startsWith("267") && cleaned.length === 11) {
    return cleaned.slice(3);
  }

  return cleaned;
}

function getAvailableQuoteStatuses(currentStatus: string) {
  switch (currentStatus) {
    case "Pending":
      return ["Pending", "Reviewed", "Rejected"];

    case "Reviewed":
      return ["Reviewed", "Quoted", "Rejected"];

    case "Quoted":
      return ["Quoted", "Accepted", "Rejected"];

    case "Accepted":
      return ["Accepted"];

    case "Rejected":
      return ["Rejected"];

    default:
      return [currentStatus];
  }
}

async function getQuote(id: string): Promise<Quote | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });


  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Could not load quote:", error);
    return null;
  }

  return data;
}
async function updateQuoteStatus(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

  const quotedPriceValue = formData.get("quotedPrice");

  const quotedPrice =
    quotedPriceValue && String(quotedPriceValue).trim() !== ""
      ? Number(quotedPriceValue)
      : null;

  const allowedStatuses = [
    "Pending",
    "Reviewed",
    "Quoted",
    "Accepted",
    "Rejected",
  ];

  if (!allowedStatuses.includes(status)) {
    return;
  }

  if (
  quotedPrice !== null &&
  (Number.isNaN(quotedPrice) || quotedPrice < 0)
) {
  return;
}

if (
  (status === "Quoted" || status === "Accepted") &&
  (quotedPrice === null || quotedPrice <= 0)
) {
  return;
}

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

 const { data: existingQuote, error: existingQuoteError } =
  await supabase
    .from("quotes")
    .select("status")
    .eq("id", id)
    .single();

if (existingQuoteError || !existingQuote) {
  console.error(
    "Could not load existing quote status:",
    existingQuoteError
  );
  return;
}

const allowedTransitions: Record<string, string[]> = {
  Pending: ["Pending", "Reviewed", "Rejected"],
  Reviewed: ["Reviewed", "Quoted", "Rejected"],
  Quoted: ["Quoted", "Accepted", "Rejected"],
  Accepted: ["Accepted"],
  Rejected: ["Rejected"],
};

const validNextStatuses =
  allowedTransitions[existingQuote.status] || [
    existingQuote.status,
  ];

if (!validNextStatuses.includes(status)) {
  console.error(
    `Invalid quote status transition: ${existingQuote.status} → ${status}`
  );
  return;
}

  const { error } = await supabase
    .from("quotes")
    .update({
      status,
      quoted_price: quotedPrice,
    })
    .eq("id", id);

  if (error) {
    console.error("Could not update quote:", error);
    return;
  }

  revalidatePath(`/admin/quotes/${id}`);
  revalidatePath("/admin/quotes");

  redirect(`/admin/quotes/${id}`);
}
export default async function QuoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await getQuote(id);

  if (!quote) {
    notFound();
  }

const availableStatuses = getAvailableQuoteStatuses(
  quote.status
);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
            Quote Request
          </p>

          <h1 className="mt-2 text-4xl font-black">
            {quote.sender_name}
          </h1>

          <p className="mt-2 text-slate-600">
            Quote #{quote.id}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black">
              Customer Details
            </h2>

            <div className="mt-6 space-y-4 text-slate-700">
  <p>
    <strong>Name:</strong> {quote.sender_name}
  </p>

  <p>
    <strong>Phone:</strong>{" "}
    <a
      href={`https://wa.me/267${normalizeBotswanaPhone(
        quote.phone_number
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-green-700 hover:text-green-800"
    >
      💬 {quote.phone_number}
    </a>
  </p>

  <p>
    <strong>Email:</strong>{" "}
    {quote.email_address ? (
      <a
        href={`mailto:${quote.email_address}`}
        className="font-semibold text-slate-700 hover:text-orange-600"
      >
        {quote.email_address}
      </a>
    ) : (
      <span className="text-slate-400">
        Not provided
      </span>
    )}
  </p>
</div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black">
              Delivery Route
            </h2>

            <div className="mt-6 space-y-4 text-slate-700">
              <p><strong>Pickup:</strong> {quote.pickup_town}</p>
              <p><strong>Pickup address:</strong> {quote.pickup_address}</p>
              <p><strong>Destination:</strong> {quote.delivery_town}</p>
              <p><strong>Delivery address:</strong> {quote.delivery_address}</p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black">
              Parcel Details
            </h2>

            <div className="mt-6 space-y-4 text-slate-700">
              <p><strong>Parcel type:</strong> {quote.parcel_type}</p>
              <p><strong>Service:</strong> {quote.delivery_service}</p>
              <p><strong>Weight:</strong> {quote.weight ?? "Not provided"} kg</p>
              <p><strong>Value:</strong> P{quote.parcel_value ?? "Not provided"}</p>

              <p>
                <strong>Dimensions:</strong>{" "}
                {quote.length ?? "-"} × {quote.width ?? "-"} × {quote.height ?? "-"} cm
              </p>

              <p>
                <strong>Collection date:</strong>{" "}
                {quote.collection_date || "Not provided"}
              </p>
            </div>
          </section>

          <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
  <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
    Current Status
  </p>
  

  <p className="mt-4 text-3xl font-black">
    {quote.status}
  </p>

  <p className="mt-5 text-slate-300">
  Submitted{" "}
  {new Date(quote.created_at).toLocaleString("en-GB", {
    timeZone: "Africa/Gaborone",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</p>

  <form action={updateQuoteStatus} className="mt-6">
    <input
      type="hidden"
      name="id"
      value={quote.id}
    />

    <div className="mt-6">
  <label
    htmlFor="quotedPrice"
    className="mb-2 block text-sm font-bold text-slate-300"
  >
    Quoted price
  </label>

  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">
      P
    </span>

    <input
      id="quotedPrice"
      name="quotedPrice"
      type="number"
      min="0.01"
      step="0.01"
      defaultValue={quote.quoted_price ?? ""}
      placeholder="0.00"
      className="w-full rounded-xl border border-white/20 bg-white py-3 pl-9 pr-4 font-bold text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
    />
  </div>
</div>

    <label
      htmlFor="status"
      className="mb-2 block text-sm font-bold text-slate-300"
    >
      Update status
    </label>

    <select
      id="status"
      name="status"
      defaultValue={quote.status}
      className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 font-bold text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20"
    >
      {availableStatuses.map((status) => (
  <option key={status} value={status}>
    {status}
  </option>
))}
    </select>

    <button
      type="submit"
      className="mt-4 w-full rounded-xl bg-orange-500 px-5 py-3 font-black text-white transition hover:bg-orange-600"
    >
      Save Status
    </button>
  </form>
  {quote.status === "Quoted" ||
quote.status === "Accepted" ||
quote.status === "Rejected" ? (
  <a
    href={`/quote/${quote.id}?token=${encodeURIComponent(
      quote.customer_access_token
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 block w-full rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-center font-black text-white transition hover:bg-white/20"
  >
    View Customer Quote
  </a>
) : null}

{quote.status === "Accepted" ? (
  <a
    href={`/admin/shipments/new?${new URLSearchParams({
      quoteId: String(quote.id),
      senderName: quote.sender_name,
      senderPhone: quote.phone_number,
      senderEmail: quote.email_address || "",
      pickupAddress: quote.pickup_address,
      origin: quote.pickup_town,
      deliveryAddress: quote.delivery_address,
      destination: quote.delivery_town,
      parcelType: quote.parcel_type,
      service: quote.delivery_service,
      weight:
        quote.weight !== null
          ? String(quote.weight)
          : "",
      parcelValue:
        quote.parcel_value !== null
          ? String(quote.parcel_value)
          : "",
      notes: quote.special_instructions || "",
    }).toString()}`}
    className="mt-4 block w-full rounded-xl bg-green-600 px-5 py-3 text-center font-black text-white transition hover:bg-green-700"
  >
    + Create Shipment from Quote
  </a>
) : null}
</section>

        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black">
            Special Instructions
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            {quote.special_instructions || "No special instructions provided."}
          </p>
        </section>
      </div>
    </main>
  );
}