import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type Shipment = {
  id: number;
  sender_name: string;
  sender_phone: string;
  sender_email: string | null;
  created_at: string;
};

type Customer = {
  name: string;
  phone: string;
  email: string | null;
  shipments: number;
  lastShipment: string;
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

async function getCustomers(): Promise<Customer[]> {
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
      sender_name,
      sender_phone,
      sender_email,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load customers:", error);
    return [];
  }

  const shipments = (data ?? []) as Shipment[];

  const customerMap = new Map<string, Customer>();

  for (const shipment of shipments) {
    const normalizedPhone = normalizeBotswanaPhone(
  shipment.sender_phone || ""
);

const key =
  normalizedPhone ||
  shipment.sender_email?.trim().toLowerCase() ||
  shipment.sender_name.trim().toLowerCase();
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: shipment.sender_name,
        phone: shipment.sender_phone,
        email: shipment.sender_email,
        shipments: 1,
        lastShipment: shipment.created_at,
      });
    } else {
      const existing = customerMap.get(key)!;

      existing.shipments += 1;

      if (
        new Date(shipment.created_at).getTime() >
        new Date(existing.lastShipment).getTime()
      ) {
        existing.lastShipment = shipment.created_at;
      }
    }
  }

  return Array.from(customerMap.values()).sort(
    (a, b) =>
      new Date(b.lastShipment).getTime() -
      new Date(a.lastShipment).getTime()
  );
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const customers = await getCustomers();
  const params = await searchParams;

  const query = (params.q || "").trim().toLowerCase();
const normalizedQueryPhone = normalizeBotswanaPhone(query);

  const filteredCustomers = customers.filter((customer) => {
    if (!query) return true;

    return (
  customer.name.toLowerCase().includes(query) ||
  customer.phone.toLowerCase().includes(query) ||
  normalizeBotswanaPhone(customer.phone).includes(
    normalizedQueryPhone
  ) ||
  (customer.email || "").toLowerCase().includes(query)
);
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
              Customer Management
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Customers
            </h1>

            <p className="mt-3 text-slate-600">
              View repeat senders and their shipment activity.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 px-6 py-4 text-white">
            <p className="text-sm text-slate-400">
              Total customers
            </p>

            <p className="mt-1 text-3xl font-black">
              {customers.length}
            </p>
          </div>
        </div>

        <form className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              name="q"
              defaultValue={params.q || ""}
              placeholder="Search customer name, phone or email"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />

            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-6 py-3 font-black text-white hover:bg-slate-800"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-950 text-sm text-white">
                <tr>
                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Phone
                  </th>

                  <th className="px-6 py-4">
                    Email
                  </th>

                  <th className="px-6 py-4">
                    Shipments
                  </th>

                  <th className="px-6 py-4">
                    Last Shipment
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={`${customer.phone}-${customer.email}-${customer.name}`}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5 font-black">
                      {customer.name}
                    </td>

                    <td className="px-6 py-5">
  <a
    href={`https://wa.me/267${normalizeBotswanaPhone(
      customer.phone
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 font-bold text-green-700 hover:text-green-800"
    title="Chat with customer on WhatsApp"
  >
    <span>💬</span>
    <span>{customer.phone}</span>
  </a>
</td>

                    <td className="px-6 py-5">
  {customer.email ? (
    <a
      href={`mailto:${customer.email}`}
      className="font-semibold text-slate-700 hover:text-orange-600"
    >
      {customer.email}
    </a>
  ) : (
    <span className="text-slate-400">
      Not provided
    </span>
  )}
</td>

                    <td className="px-6 py-5">
  <Link
    href={`/admin/shipments?q=${encodeURIComponent(
      normalizeBotswanaPhone(customer.phone)
    )}`}
    className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700 transition hover:bg-blue-200"
    title="View customer shipments"
  >
    {customer.shipments}
  </Link>
</td>

                    <td className="px-6 py-5">
  {new Date(customer.lastShipment).toLocaleDateString("en-GB", {
    timeZone: "Africa/Gaborone",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</td>

                    <td className="px-6 py-5">
                      <Link
  href={`/admin/shipments?q=${encodeURIComponent(
    normalizeBotswanaPhone(customer.phone)
  )}`}
  className="font-black text-orange-600 hover:text-orange-700"
>
  View Shipments →
</Link>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
  <tr>
    <td
      colSpan={6}
      className="px-6 py-16 text-center"
    >
      {customers.length === 0 ? (
        <div>
          <p className="text-lg font-black text-slate-900">
            No customers yet
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Customers will appear here automatically when shipments are created.
          </p>

          <Link
            href="/admin/shipments/new"
            className="mt-5 inline-block rounded-xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-orange-600"
          >
            + Create Shipment
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-lg font-black text-slate-900">
            No customers match your search
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Try another name, phone number, or email address.
          </p>

          <Link
            href="/admin/customers"
            className="mt-5 inline-block font-black text-orange-600 hover:text-orange-700"
          >
            Clear search
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
          Showing {filteredCustomers.length} of{" "}
          {customers.length} customers.
        </p>
      </div>
    </main>
  );
}