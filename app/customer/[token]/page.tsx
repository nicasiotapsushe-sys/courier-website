import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

type Shipment = {
  id: number;
  quote_id: number | null;
  tracking_number: string;
  sender_name: string;
  sender_phone: string;
  sender_email: string | null;
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string | null;
  origin: string;
  destination: string;
  pickup_address: string;
  delivery_address: string;
  parcel_type: string;
  service: string;
  current_status: string;
  payment_status: string;
  estimated_delivery: string | null;
  created_at: string;
  customer_portal_token: string;
};
type Quote = {
  id: number;
  quoted_price: number | null;
  status: string;
  customer_access_token: string;
};
type Invoice = {
  id: number;
  invoice_number: string;
  shipment_id: number | null;
  customer_access_token: string;
  grand_total: number;
  amount_paid: number;
  balance_due: number;
  status: string;
};
function getStatusClasses(status: string) {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Out for Delivery":
      return "bg-purple-100 text-purple-700";

    case "In Transit":
      return "bg-blue-100 text-blue-700";

    case "Collected":
      return "bg-cyan-100 text-cyan-700";

    default:
      return "bg-orange-100 text-orange-700";
  }
}

async function getShipment(
  token: string
): Promise<Shipment | null> {
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
    .from("shipments")
    .select("*")
    .eq("customer_portal_token", token)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function CustomerPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const shipment = await getShipment(token);

  if (!shipment) {
  notFound();
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  notFound();
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

let linkedQuote: Quote | null = null;
if (shipment.quote_id) {
  const { data: quoteData, error: quoteError } =
    await supabase
      .from("quotes")
      .select(
        "id, quoted_price, status, customer_access_token"
      )
      .eq("id", shipment.quote_id)
      .single();

  if (quoteError) {
    console.error(
      "Could not load linked customer quote:",
      quoteError
    );
  } else {
    linkedQuote = quoteData;
  }
}
let linkedInvoice: Invoice | null = null;

const { data: invoiceData, error: invoiceError } =
  await supabase
    .from("invoices")
    .select(
      `
        id,
        invoice_number,
        shipment_id,
        customer_access_token,
        grand_total,
        amount_paid,
        balance_due,
        status
      `
    )
    .eq("shipment_id", shipment.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

if (invoiceError) {
  console.error(
    "Could not load linked customer invoice:",
    invoiceError
  );
} else {
  linkedInvoice = invoiceData;
}
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-400">
            Drop It Courier Services
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Hello, {shipment.sender_name}
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Track your delivery, view your documents and
            manage payment information from your secure
            customer portal.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Current Shipment
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {shipment.tracking_number}
              </h2>

              <p className="mt-2 text-slate-500">
                {shipment.origin} → {shipment.destination}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-5 py-2 text-sm font-black ${getStatusClasses(
                shipment.current_status
              )}`}
            >
              {shipment.current_status}
            </span>

          </div>

          <div className="mt-8 grid gap-5 border-t border-slate-200 pt-8 sm:grid-cols-3">

            <div>
              <p className="text-sm font-bold text-slate-400">
                RECIPIENT
              </p>

              <p className="mt-1 font-black">
                {shipment.recipient_name}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-400">
                SERVICE
              </p>

              <p className="mt-1 font-black">
                {shipment.service}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-400">
                ESTIMATED DELIVERY
              </p>

              <p className="mt-1 font-black">
                {shipment.estimated_delivery
                  ? new Date(
                      `${shipment.estimated_delivery}T12:00:00Z`
                    ).toLocaleDateString("en-GB", {
                      timeZone: "Africa/Gaborone",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Not available"}
              </p>
            </div>

          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <a
            href={`/track?tracking=${encodeURIComponent(
              shipment.tracking_number
            )}`}
            className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">📦</div>

            <p className="mt-5 text-sm font-bold uppercase tracking-widest text-orange-500">
              Shipment
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Track Shipment
            </h2>

            <p className="mt-3 text-slate-500">
              View the latest location and delivery progress
              for your parcel.
            </p>

            <p className="mt-6 font-black text-orange-600">
              View tracking →
            </p>
          </a>

          {linkedQuote ? (
  <a
    href={`/quote/${linkedQuote.id}?token=${encodeURIComponent(
      linkedQuote.customer_access_token
    )}`}
    className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
  >
    <div className="text-3xl">📄</div>

    <p className="mt-5 text-sm font-bold uppercase tracking-widest text-orange-500">
      Quotation
    </p>

    <h2 className="mt-2 text-2xl font-black">
      Quote #{linkedQuote.id}
    </h2>

    <p className="mt-3 text-3xl font-black text-slate-950">
      {linkedQuote.quoted_price !== null
        ? `P${Number(
            linkedQuote.quoted_price
          ).toFixed(2)}`
        : "Price pending"}
    </p>

    <div className="mt-4">
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
        {linkedQuote.status}
      </span>
    </div>

    <p className="mt-6 font-black text-orange-600">
      View quotation →
    </p>
  </a>
) : (
  <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
    <div className="text-3xl">📄</div>

    <p className="mt-5 text-sm font-bold uppercase tracking-widest text-slate-400">
      Quotation
    </p>

    <h2 className="mt-2 text-2xl font-black">
      No linked quotation
    </h2>

    <p className="mt-3 text-slate-500">
      This shipment was created manually and does not have
      a quotation linked to it.
    </p>
  </div>
)}

          {linkedInvoice ? (
  <a
    href={`/invoice/${linkedInvoice.id}?token=${encodeURIComponent(
      linkedInvoice.customer_access_token
    )}`}
    className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
  >
    <div className="text-3xl">🧾</div>

    <p className="mt-5 text-sm font-bold uppercase tracking-widest text-orange-500">
      Billing
    </p>

    <div className="mt-2 flex flex-wrap items-center gap-3">
      <h2 className="text-2xl font-black">
        {linkedInvoice.invoice_number}
      </h2>

      <span
        className={`rounded-full px-3 py-1 text-xs font-black ${
          linkedInvoice.status === "Paid"
            ? "bg-green-100 text-green-700"
            : linkedInvoice.status === "Partially Paid"
              ? "bg-orange-100 text-orange-700"
              : "bg-slate-100 text-slate-700"
        }`}
      >
        {linkedInvoice.status}
      </span>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs font-bold uppercase text-slate-400">
          Total
        </p>

        <p className="mt-1 text-lg font-black">
          P{Number(linkedInvoice.grand_total).toFixed(2)}
        </p>
      </div>

      <div>
        <p className="text-xs font-bold uppercase text-slate-400">
          Balance
        </p>

        <p
          className={`mt-1 text-lg font-black ${
            Number(linkedInvoice.balance_due) <= 0
              ? "text-green-600"
              : "text-orange-600"
          }`}
        >
          P{Number(linkedInvoice.balance_due).toFixed(2)}
        </p>
      </div>
    </div>

    <p className="mt-6 font-black text-orange-600">
      View invoice →
    </p>
  </a>
) : (
  <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
    <div className="text-3xl">🧾</div>

    <p className="mt-5 text-sm font-bold uppercase tracking-widest text-slate-400">
      Billing
    </p>

    <h2 className="mt-2 text-2xl font-black">
      Invoice
    </h2>

    <p className="mt-3 text-slate-500">
      An invoice has not been issued for this shipment yet.
    </p>

    <p className="mt-6 font-bold text-slate-400">
      Not available yet
    </p>
  </div>
)}

          
{linkedInvoice ? (
  Number(linkedInvoice.balance_due) <= 0 ? (
    <div className="rounded-3xl border border-green-200 bg-green-50 p-7 shadow-sm">
      <div className="text-3xl">✅</div>

      <p className="mt-5 text-sm font-bold uppercase tracking-widest text-green-600">
        Payments
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        Fully Paid
      </h2>

      <p className="mt-3 text-slate-600">
        Payment for this invoice has been completed.
      </p>

      <div className="mt-5 rounded-2xl bg-white p-4">
        <p className="text-xs font-bold uppercase text-slate-400">
          Amount Paid
        </p>

        <p className="mt-1 text-xl font-black text-green-600">
          P{Number(linkedInvoice.amount_paid).toFixed(2)}
        </p>
      </div>

      <p className="mt-6 font-black text-green-700">
        ✓ No balance outstanding
      </p>
    </div>
  ) : (
    <a
      href={`/payment-proof?${new URLSearchParams({
  invoiceId: String(linkedInvoice.id),
  shipmentId: String(shipment.id),
  customerName: shipment.sender_name,
  customerPhone: shipment.sender_phone || "",
  amount: Number(
    linkedInvoice.balance_due
  ).toFixed(2),
}).toString()}`}
      className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="text-3xl">💳</div>

      <p className="mt-5 text-sm font-bold uppercase tracking-widest text-orange-500">
        Payments
      </p>

      <h2 className="mt-2 text-2xl font-black">
        {linkedInvoice.status === "Partially Paid"
          ? "Make Another Payment"
          : "Payment & POP"}
      </h2>

      <p className="mt-3 text-slate-500">
        Upload your proof of payment for this invoice.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">
            Paid
          </p>

          <p className="mt-1 text-lg font-black text-green-600">
            P{Number(linkedInvoice.amount_paid).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-slate-400">
            Balance
          </p>

          <p className="mt-1 text-lg font-black text-orange-600">
            P{Number(linkedInvoice.balance_due).toFixed(2)}
          </p>
        </div>
      </div>

      <p className="mt-6 font-black text-orange-600">
        Upload proof of payment →
      </p>
    </a>
  )
) : (
  <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
    <div className="text-3xl">💳</div>

    <p className="mt-5 text-sm font-bold uppercase tracking-widest text-slate-400">
      Payments
    </p>

    <h2 className="mt-2 text-2xl font-black">
      Payment & POP
    </h2>

    <p className="mt-3 text-slate-500">
      Payment options will become available once an invoice
      has been issued.
    </p>

    <p className="mt-6 font-bold text-slate-400">
      Waiting for invoice
    </p>
  </div>
)}

        </div>

        <section className="mt-8 rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Need assistance?
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Drop It Courier Services
          </h2>

          <p className="mt-3 text-slate-300">
            Contact our team if you need help with your
            shipment, quotation, invoice or payment.
          </p>
        </section>

        <p className="mt-8 text-center text-xs text-slate-400">
          Montelview Holdings (Pty) Ltd T/A Drop It
        </p>

      </section>
    </main>
  );
}