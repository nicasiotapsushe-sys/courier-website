import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type Shipment = {
  id: number;
  tracking_number: string;
  sender_name: string;
  sender_phone: string;
  recipient_name: string;
  origin: string;
  destination: string;
  current_status: string;
  current_location: string;
  service: string;
  estimated_delivery: string | null;
  created_at: string;
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
async function getShipments(): Promise<Shipment[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return [];
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
    .select(`
      id,
      tracking_number,
      sender_name,
      sender_phone,
      recipient_name,
      origin,
      destination,
      current_status,
      current_location,
      service,
      estimated_delivery,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load shipments:", error);
    return [];
  }

  return data ?? [];
}

function getStatusClasses(status: string) {
  switch (status) {
    case "Pending":
      return "bg-slate-100 text-slate-700";

    case "Collected":
      return "bg-blue-100 text-blue-700";

    case "In Transit":
      return "bg-purple-100 text-purple-700";

    case "Out for Delivery":
      return "bg-orange-100 text-orange-700";

    case "Delivered":
      return "bg-green-100 text-green-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}) {
  const shipments = await getShipments();
  const params = await searchParams;

  const query = (params.q || "").trim().toLowerCase();
  const normalizedQueryPhone = normalizeBotswanaPhone(query);
  const statusFilter = params.status || "All";

  const filteredShipments = shipments.filter((shipment) => {
    const matchesQuery =
  !query ||
  shipment.tracking_number.toLowerCase().includes(query) ||
  shipment.sender_name.toLowerCase().includes(query) ||
  shipment.sender_phone.toLowerCase().includes(query) ||
  normalizeBotswanaPhone(shipment.sender_phone).includes(
    normalizedQueryPhone
  ) ||
  shipment.recipient_name.toLowerCase().includes(query) ||
  shipment.destination.toLowerCase().includes(query);
  

    const matchesStatus =
      statusFilter === "All" ||
      shipment.current_status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Link
              href="/admin"
              className="text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-orange-500">
              Shipment Management
            </p>

            <h1 className="mt-2 text-4xl font-black">
              All Shipments
            </h1>

            <p className="mt-3 text-slate-600">
              Search, review and manage registered parcels.
            </p>
          </div>

          <Link
            href="/admin/shipments/new"
            className="w-fit rounded-xl bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600"
          >
            + Create Shipment
          </Link>
        </div>

        <form className="mt-10 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_240px_auto]">
          <input
            type="text"
            name="q"
            defaultValue={params.q || ""}
            placeholder="Search tracking number, sender, recipient or destination"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          />

          <select
            name="status"
            defaultValue={statusFilter}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Collected">Collected</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-slate-950 px-6 py-3 font-black text-white hover:bg-slate-800"
          >
            Search
          </button>
        </form>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-950 text-sm text-white">
                <tr>
                  <th className="px-6 py-4">Tracking</th>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredShipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <p className="font-black">
                        {shipment.tracking_number}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(
                          shipment.created_at
                        ).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      {shipment.sender_name}
                    </td>

                    <td className="px-6 py-5">
                      {shipment.recipient_name}
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold">
                        {shipment.origin}
                      </p>

                      <p className="text-sm text-slate-500">
                        → {shipment.destination}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-bold ${getStatusClasses(
                          shipment.current_status
                        )}`}
                      >
                        {shipment.current_status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      {shipment.current_location}
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/shipments/${shipment.id}`}
                        className="font-black text-orange-600 hover:text-orange-700"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredShipments.length === 0 && (
  <tr>
    <td
      colSpan={7}
      className="px-6 py-16 text-center"
    >
      {shipments.length === 0 ? (
        <div>
          <p className="text-lg font-black text-slate-800">
            No shipments created yet
          </p>

          <p className="mt-2 text-sm text-slate-500">
            New shipments will appear here once they are registered.
          </p>

          <Link
            href="/admin/shipments/new"
            className="mt-5 inline-block font-black text-orange-600 hover:text-orange-700"
          >
            + Create your first shipment
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-lg font-black text-slate-800">
            No shipments match your search
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Try changing the search term or status filter.
          </p>

          <Link
            href="/admin/shipments"
            className="mt-5 inline-block font-black text-orange-600 hover:text-orange-700"
          >
            Clear filters
          </Link>
        </div>
      )}
    </td>
  </tr>
)}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          Showing {filteredShipments.length} of {shipments.length} shipments.
        </p>
      </div>
    </main>
  );
}