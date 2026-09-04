import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import InvoiceActions from "./InvoiceActions";
import CopyCustomerInvoiceLink from "./CopyCustomerInvoiceLink";
import SendInvoiceWhatsApp from "./SendInvoiceWhatsApp";
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

type Shipment = {
  id: number;
  tracking_number: string;
  sender_name: string;
  sender_phone: string | null;
  sender_email: string | null;
  pickup_address: string;
  origin: string;

  recipient_name: string;
  recipient_phone: string | null;
  recipient_email: string | null;
  delivery_address: string;
  destination: string;

  service: string | null;
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
  sales_rep: string | null;
  overall_discount_percent: number;
  subtotal_excl: number;
  vat_total: number;
  grand_total: number;
  amount_paid: number;
  balance_due: number;
  status: string;
  created_at: string;
  invoice_items: InvoiceItem[];
};

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

async function getInvoice(
  id: string
): Promise<Invoice | null> {
  const supabase = getSupabaseAdmin();

  const { data: invoiceData, error: invoiceError } =
    await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single();

  if (invoiceError) {
    console.error("Could not load invoice:", {
      message: invoiceError.message,
      code: invoiceError.code,
      details: invoiceError.details,
      hint: invoiceError.hint,
    });

    return null;
  }

  const { data: itemsData, error: itemsError } =
  await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", Number(id))
    .order("id", {
      ascending: true,
    });

  if (itemsError) {
    console.error("Could not load invoice items:", {
      message: itemsError.message,
      code: itemsError.code,
      details: itemsError.details,
      hint: itemsError.hint,
    });

    return null;
  }

  return {
    ...invoiceData,
    invoice_items: itemsData ?? [],
  } as Invoice;
}

export default async function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const invoice = await getInvoice(id);

  async function getShipment(
  shipmentId: number | null
): Promise<Shipment | null> {
  if (!shipmentId) {
    return null;
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("shipments")
    .select(`
      id,
      tracking_number,
      sender_name,
      sender_phone,
      sender_email,
      pickup_address,
      origin,
      recipient_name,
      recipient_phone,
      recipient_email,
      delivery_address,
      destination,
      service
    `)
    .eq("id", shipmentId)
    .single();

  if (error) {
    console.error("Could not load linked shipment:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    return null;
  }

  return data;
}

  if (!invoice) {
    notFound();
  }
const shipment = await getShipment(
  invoice.shipment_id
);
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
  {/* Back */}
  <a
    href="/admin/invoices"
    className="inline-flex text-sm font-bold text-blue-700 transition hover:text-blue-900"
  >
    ← Back to Invoices
  </a>

  {/* Invoice heading */}
  <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          {invoice.invoice_number}
        </h1>

        <span
          className={`rounded-full px-4 py-2 text-xs font-black uppercase ${
            invoice.status === "Paid"
              ? "bg-green-100 text-green-700"
              : invoice.status === "Partially Paid"
                ? "bg-orange-100 text-orange-700"
                : "bg-slate-200 text-slate-700"
          }`}
        >
          {invoice.status}
        </span>
      </div>

      {Number(invoice.balance_due) <= 0 ? (
        <div className="mt-4 inline-flex rounded-xl bg-green-100 px-5 py-3 font-black text-green-700">
          ✓ Invoice Fully Paid
        </div>
      ) : (
        <p className="mt-3 text-sm font-semibold text-slate-600">
          Balance Due:{" "}
          <span className="font-black text-orange-600">
            P {Number(invoice.balance_due).toFixed(2)}
          </span>
        </p>
      )}
    </div>

    {/* Actions */}
    <div className="flex flex-wrap gap-3 lg:max-w-2xl lg:justify-end">
      <a
        href={`/invoice/${invoice.id}?token=${invoice.customer_access_token}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        View Customer Invoice
      </a>

      <SendInvoiceWhatsApp
        invoiceNumber={invoice.invoice_number}
        customerName={invoice.customer_name}
        customerPhone={shipment?.sender_phone || null}
        grandTotal={invoice.grand_total}
        balanceDue={invoice.balance_due}
        invoiceId={invoice.id}
        token={invoice.customer_access_token}
      />

      <CopyCustomerInvoiceLink
        invoiceId={invoice.id}
        token={invoice.customer_access_token}
      />

      <InvoiceActions />
    </div>
  </div>
</div>
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="flex flex-col justify-between gap-8 border-b border-slate-200 pb-8 md:flex-row">
            <div>
                <img
    src="/images/dropit-logo.png"
    alt="Drop It Courier Services"
    className="mb-6 h-auto w-72 object-contain"
  />
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Invoice
              </p>

              <h2 className="mt-2 text-4xl font-black">
                {invoice.invoice_number}
              </h2>
            </div>

            <div className="grid gap-3 text-sm md:text-right">
              <p>
                <span className="font-bold">Date:</span>{" "}
                {invoice.invoice_date}
              </p>

              <p>
                <span className="font-bold">Due Date:</span>{" "}
                {invoice.due_date}
              </p>

              <p>
                <span className="font-bold">Sales Rep:</span>{" "}
                {invoice.sales_rep || "Not assigned"}
              </p>

              <p>
                <span className="font-bold">Reference:</span>{" "}
                {invoice.reference || "—"}
              </p>
            </div>
          </div>

          <div className="grid gap-8 border-b border-slate-200 py-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                From
              </p>

              <h3 className="mt-3 text-xl font-black">
                Montelview Holdings (Pty) Ltd T/A Drop It
              </h3>

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
                To
              </p>

              <h3 className="mt-3 text-xl font-black">
                {invoice.customer_name}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Customer VAT No:{" "}
                {invoice.customer_vat_number || "—"}
              </p>

{shipment && (
    <>
      <p className="mt-3 text-sm text-slate-600">
        <strong>Phone:</strong>{" "}
        {shipment.sender_phone || "—"}
      </p>

      <p className="text-sm text-slate-600">
        <strong>Email:</strong>{" "}
        {shipment.sender_email || "—"}
      </p>

      <p className="text-sm text-slate-600">
        <strong>Address:</strong>{" "}
        {shipment.pickup_address || "—"}
      </p>
    </>
  )}

            </div>
          </div>

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
                    Excl. Price
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-600">
                    Disc %
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-600">
                    VAT %
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-600">
                    Excl. Total
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-600">
                    Incl. Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {invoice.invoice_items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4 font-semibold">
                      {item.description}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {Number(item.quantity).toFixed(2)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      P {Number(item.unit_price_excl).toFixed(2)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {Number(item.discount_percent).toFixed(2)}%
                    </td>

                    <td className="px-4 py-4 text-right">
                      {Number(item.vat_rate).toFixed(2)}%
                    </td>

                    <td className="px-4 py-4 text-right">
                      P {Number(item.excl_total).toFixed(2)}
                    </td>

                    <td className="px-4 py-4 text-right font-bold">
                      P {Number(item.incl_total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {shipment && (
  <div className="grid gap-6 border-b border-slate-200 py-6 md:grid-cols-3">
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
        Tracking / Waybill
      </p>

      <p className="mt-2 font-black">
        {shipment.tracking_number}
      </p>
    </div>

    <div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
        Route
      </p>

      <p className="mt-2 font-black">
        {shipment.origin} → {shipment.destination}
      </p>
    </div>

    <div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
        Service
      </p>

      <p className="mt-2 font-black">
        {shipment.service || "—"}
      </p>
    </div>
  </div>
)}

          <div className="grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-slate-500">
                Our Banking Details
              </p>

              <div className="mt-4 space-y-1 text-sm text-slate-700">
                <p>
                  <strong>Account Name:</strong>{" "}
                  MONTELVIEW HOLDINGS (PTY) LTD
                </p>

                <p>
                  <strong>Bank:</strong> First National Bank Botswana
                </p>

                <p>
                  <strong>Account No:</strong> 62537394710
                </p>

                <p>
                  <strong>Branch:</strong> Francistown
                </p>

                <p>
                  <strong>Branch Code:</strong> 281867
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 p-6 text-white">
  <div className="space-y-4">

    {/* Total Exclusive */}
    <div className="flex items-center justify-between gap-6">
      <span className="text-slate-300">
        Total Exclusive
      </span>

      <strong className="whitespace-nowrap">
        P {Number(invoice.subtotal_excl).toFixed(2)}
      </strong>
    </div>

    {/* VAT */}
    <div className="flex items-center justify-between gap-6">
      <span className="text-slate-300">
        Total VAT
      </span>

      <strong className="whitespace-nowrap">
        P {Number(invoice.vat_total).toFixed(2)}
      </strong>
    </div>

    {/* Grand Total */}
    <div className="flex items-center justify-between gap-6 border-t border-slate-700 pt-4">
      <span className="font-black">
        Grand Total
      </span>

      <strong className="whitespace-nowrap text-lg text-orange-400">
        P {Number(invoice.grand_total).toFixed(2)}
      </strong>
    </div>

    {/* Amount Paid */}
    <div className="flex items-center justify-between gap-6">
      <span className="text-slate-300">
        Amount Paid
      </span>

      <strong className="whitespace-nowrap text-green-400">
        P {Number(invoice.amount_paid).toFixed(2)}
      </strong>
    </div>

    {/* Balance Due */}
    <div className="border-t border-slate-700 pt-4">
      <div className="flex items-center justify-between gap-6">
        <span className="text-lg font-black">
          Balance Due
        </span>

        <strong className="whitespace-nowrap text-2xl font-black text-orange-400">
          P {Number(invoice.balance_due).toFixed(2)}
        </strong>
      </div>
    </div>

    {/* Payment Status */}
    <div className="border-t border-slate-700 pt-4">
      <div className="flex items-center justify-between gap-6">
        <span className="font-bold text-slate-300">
          Payment Status
        </span>

        <span
          className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ${
            invoice.status === "Paid"
              ? "bg-green-500 text-white"
              : invoice.status === "Partially Paid"
                ? "bg-orange-500 text-white"
                : "bg-slate-700 text-white"
          }`}
        >
          {invoice.status}
        </span>
      </div>
    </div>

  </div>
</div>
            </div>
        </section>

      </div>
    </main>
  );
}