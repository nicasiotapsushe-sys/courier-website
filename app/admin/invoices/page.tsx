import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import InvoicesTable from "./InvoicesTable";

type Invoice = {
  id: number;
  invoice_number: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  grand_total: number;
  balance_due: number;
  status: string;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Supabase environment variables are missing.");
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

async function getInvoices(): Promise<Invoice[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_number,
      customer_name,
      invoice_date,
      due_date,
      grand_total,
      balance_due,
      status
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Could not load invoices:", error);
    return [];
  }

  return data ?? [];
}



export default async function InvoicesPage() {
  const invoices = await getInvoices();

  const totalInvoiced = invoices.reduce(
    (total, invoice) =>
      total + Number(invoice.grand_total || 0),
    0
  );

  const totalOutstanding = invoices.reduce(
    (total, invoice) =>
      total + Number(invoice.balance_due || 0),
    0
  );

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "Paid"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Billing Management
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Invoices
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Manage customer invoices, outstanding balances
              and payment status.
            </p>
          </div>

          <Link
            href="/admin/invoices/new"
            className="rounded-xl bg-orange-500 px-7 py-4 text-center font-black text-white transition hover:bg-orange-600"
          >
            Create Invoice
          </Link>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-950 p-7 text-white">
            <p className="text-sm font-bold text-slate-400">
              Total Invoiced
            </p>

            <p className="mt-3 text-3xl font-black">
              P {totalInvoiced.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-blue-700 p-7 text-white">
            <p className="text-sm font-bold text-blue-200">
              Outstanding
            </p>

            <p className="mt-3 text-3xl font-black">
              P {totalOutstanding.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-green-700 p-7 text-white">
            <p className="text-sm font-bold text-green-200">
              Paid Invoices
            </p>

            <p className="mt-3 text-3xl font-black">
              {paidInvoices}
            </p>
          </div>
        </section>

        <InvoicesTable invoices={invoices} />
      </div>
    </main>
  );
}