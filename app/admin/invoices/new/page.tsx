import { createClient } from "@supabase/supabase-js";
import CreateInvoiceForm from "./CreateInvoiceForm";

export type ShipmentOption = {
  id: number;
  tracking_number: string;
  sender_name: string;
  sender_phone: string | null;
  sender_email: string | null;
  origin: string;
  destination: string;
  parcel_type: string | null;
  service: string | null;
  parcel_value: number | null;
  created_at: string;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

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

async function getShipments(): Promise<ShipmentOption[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("shipments")
    .select(`
      id,
      tracking_number,
      sender_name,
      sender_phone,
      sender_email,
      origin,
      destination,
      parcel_type,
      service,
      parcel_value,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Could not load shipments for invoicing:",
      error
    );

    return [];
  }

  return data ?? [];
}

export default async function NewInvoicePage() {
  const shipments = await getShipments();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
          Billing Management
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Create Invoice
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Select an existing shipment and generate a customer
          invoice.
        </p>

        <CreateInvoiceForm shipments={shipments} />
      </div>
    </main>
  );
}