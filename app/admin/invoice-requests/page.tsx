import InvoiceRequestsTable from "./InvoiceRequestsTable";
import { createClient } from "@supabase/supabase-js";

type InvoiceRequest = {
  id: number;
  shipment_id: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  request_status: string;
  requested_at: string;
  shipment: {
  tracking_number: string;
  origin: string;
  destination: string;
  sender_phone: string | null;
} | null;
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

async function getInvoiceRequests(): Promise<InvoiceRequest[]> {
  const supabase = getSupabaseAdmin();

  const { data: requests, error: requestsError } =
    await supabase
      .from("invoice_requests")
      .select(`
        id,
        shipment_id,
        customer_name,
        customer_email,
        customer_phone,
        request_status,
        requested_at
      `)
      .order("requested_at", {
        ascending: false,
      });

  if (requestsError) {
    console.error("Could not load invoice requests:", {
      message: requestsError.message,
      code: requestsError.code,
      details: requestsError.details,
      hint: requestsError.hint,
    });

    return [];
  }

  if (!requests || requests.length === 0) {
    return [];
  }

  const shipmentIds = requests.map(
    (request) => request.shipment_id
  );

  const { data: shipments, error: shipmentsError } =
    await supabase
      .from("shipments")
      .select(`
        id,
        tracking_number,
        origin,
        destination,
         sender_phone
      `)
      .in("id", shipmentIds);

  if (shipmentsError) {
    console.error("Could not load shipments for invoice requests:", {
      message: shipmentsError.message,
      code: shipmentsError.code,
      details: shipmentsError.details,
      hint: shipmentsError.hint,
    });

    return [];
  }

  return requests.map((request) => {
    const shipment =
      shipments?.find(
        (item) => item.id === request.shipment_id
      ) || null;

    return {
      ...request,
      shipment: shipment
        ? {
            tracking_number: shipment.tracking_number,
            origin: shipment.origin,
            destination: shipment.destination,
             sender_phone: shipment.sender_phone,
          }
        : null,
    };
  });
}


export default async function InvoiceRequestsPage() {
  const requests = await getInvoiceRequests();

  const pendingCount = requests.filter(
    (request) => request.request_status === "Pending"
  ).length;

  const generatedCount = requests.filter(
    (request) => request.request_status === "Invoice Generated"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
            Billing Management
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Invoice Requests
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Review customer invoice requests and generate invoices from
            existing shipments.
          </p>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-950 p-7 text-white">
            <p className="text-sm font-bold text-slate-400">
              Total Requests
            </p>

            <p className="mt-3 text-3xl font-black">
              {requests.length}
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
              Invoice Generated
            </p>

            <p className="mt-3 text-3xl font-black">
              {generatedCount}
            </p>
          </div>
        </section>

        <InvoiceRequestsTable requests={requests} />
      </div>
    </main>
  );
}