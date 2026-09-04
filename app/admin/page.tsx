
import { createClient } from "@supabase/supabase-js";

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



const shipmentStatistics = [
  {
    title: "Total Shipments",
    value: "—",
    change: "Connecting shipment data",
    icon: "📦",
  },
  {
    title: "In Transit",
    value: "—",
    change: "Connecting shipment data",
    icon: "🚚",
  },
  {
    title: "Delivered",
    value: "—",
    change: "Connecting shipment data",
    icon: "✅",
  },
];



const quickActions = [
  {
  title: "Payment Proofs",
  description: "Review and verify customer payment submissions.",
  icon: "💳",
  href: "/admin/payment-proofs",
},
  {
  title: "Update Tracking",
  description: "Open shipments and update parcel status or location.",
  icon: "📍",
  href: "/admin/shipments",
},
  {
    title: "Manage Customers",
    description: "View and update customer information.",
    icon: "👥",
    href: "/admin/customers",
  },
  {
    title: "View Quotes",
    description: "Review customer quotation requests.",
    icon: "💰",
    href: "/admin/quotes",
  },
];

function getStatusStyles(status: string) {
  if (status === "Delivered") {
    return "bg-green-100 text-green-700";
  }

  if (status === "In Transit") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Out for Delivery") {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-slate-100 text-slate-700";
}
async function getDashboardData() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return {
      quoteStats: {
        total: 0,
        pending: 0,
      },
      shipmentStats: {
        total: 0,
        inTransit: 0,
        delivered: 0,
      },
      todayStats: {
        total: 0,
        delivered: 0,
        outForDelivery: 0,
        completionRate: 0,
      },
      delayedShipments: 0,
      recentShipments: [],
    };
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

  const [quotesResult, shipmentsResult] = await Promise.all([
    supabase
      .from("quotes")
      .select("status"),

    supabase
      .from("shipments")
      .select(`
        id,
        tracking_number,
        sender_name,
        destination,
        current_status,
        estimated_delivery,
        created_at
      `)
      .order("created_at", { ascending: false }),
  ]);

  if (quotesResult.error) {
  console.error(
    "QUOTES ERROR MESSAGE:",
    quotesResult.error.message
  );

  console.error(
    "QUOTES ERROR CODE:",
    quotesResult.error.code
  );

  console.error(
    "QUOTES ERROR DETAILS:",
    quotesResult.error.details
  );

  console.error(
    "QUOTES ERROR HINT:",
    quotesResult.error.hint
  );
}
  if (shipmentsResult.error) {
  console.error(
    "SHIPMENTS ERROR MESSAGE:",
    shipmentsResult.error.message
  );

  console.error(
    "SHIPMENTS ERROR CODE:",
    shipmentsResult.error.code
  );

  console.error(
    "SHIPMENTS ERROR DETAILS:",
    shipmentsResult.error.details
  );

  console.error(
    "SHIPMENTS ERROR HINT:",
    shipmentsResult.error.hint
  );
}

  const quotes = quotesResult.data ?? [];
  const shipments = shipmentsResult.data ?? [];

  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const todayDate =
    today.toISOString().split("T")[0];

  const todayShipments = shipments.filter(
    (shipment) => {
      const created = new Date(shipment.created_at);

      return (
        created >= startOfDay &&
        created <= endOfDay
      );
    }
  );

  const todayDelivered = todayShipments.filter(
    (shipment) =>
      shipment.current_status === "Delivered"
  ).length;

  const todayOutForDelivery =
    todayShipments.filter(
      (shipment) =>
        shipment.current_status ===
        "Out for Delivery"
    ).length;

  const delayedShipments = shipments.filter(
    (shipment) =>
      shipment.estimated_delivery &&
      shipment.estimated_delivery < todayDate &&
      shipment.current_status !== "Delivered"
  ).length;

  return {
    quoteStats: {
      total: quotes.length,
      pending: quotes.filter(
        (quote) => quote.status === "Pending"
      ).length,
    },

    shipmentStats: {
      total: shipments.length,

      inTransit: shipments.filter(
        (shipment) =>
          shipment.current_status === "In Transit"
      ).length,

      delivered: shipments.filter(
        (shipment) =>
          shipment.current_status === "Delivered"
      ).length,
    },

    todayStats: {
      total: todayShipments.length,
      delivered: todayDelivered,
      outForDelivery: todayOutForDelivery,

      completionRate:
        todayShipments.length > 0
          ? Math.round(
              (todayDelivered /
                todayShipments.length) *
                100
            )
          : 0,
    },

    delayedShipments,

    recentShipments: shipments.slice(0, 5),
     };
}
export default async function AdminDashboardPage() {
  const {
    quoteStats,
    shipmentStats,
    todayStats,
    delayedShipments,
    recentShipments,
  } = await getDashboardData();
  const statistics = [
    {
      title: "Total Shipments",
      value: String(shipmentStats.total),
      change: "All registered shipments",
      icon: "📦",
    },
    {
      title: "In Transit",
      value: String(shipmentStats.inTransit),
      change: "Currently moving",
      icon: "🚚",
    },
    {
      title: "Delivered",
      value: String(shipmentStats.delivered),
      change: "Completed deliveries",
      icon: "✅",
    },
    {
      title: "Pending Quotes",
      value: String(quoteStats.pending),
      change: `${quoteStats.total} total quote requests`,
      icon: "📝",
    },
  ];
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-10 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Administration
            </p>

            <h1 className="mt-2 text-4xl font-black">Courier Dashboard</h1>

            <p className="mt-3 text-slate-600">
              Manage shipments, customers, tracking updates and quotations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
  
  
</div>
</div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((statistic) => (
            <article
              key={statistic.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    {statistic.title}
                  </p>

                  <p className="mt-3 text-4xl font-black">{statistic.value}</p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  {statistic.icon}
                </div>
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                {statistic.change}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm">
  <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
    Today&apos;s deliveries
  </p>

  {todayStats.total > 0 ? (
    <>
      <p className="mt-3 text-5xl font-black">
        {todayStats.total}
      </p>

      <p className="mt-3 leading-7 text-slate-300">
        {todayStats.delivered} completed and{" "}
        {todayStats.outForDelivery} currently out for delivery.
      </p>

      <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-orange-500 transition-all"
          style={{
            width: `${todayStats.completionRate}%`,
          }}
        />
      </div>

      <p className="mt-3 text-sm font-bold text-slate-300">
        {todayStats.completionRate}% completed
      </p>
    </>
  ) : (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-xl font-black">
        No deliveries scheduled today
      </p>

      <p className="mt-2 max-w-xl leading-7 text-slate-300">
        New shipments and deliveries scheduled for today will appear here.
      </p>

      <a
        href="/admin/shipments/new"
        className="mt-5 inline-block font-black text-orange-400 transition hover:text-orange-300"
      >
        + Create a shipment
      </a>
    </div>
  )}
</section>

          <aside className="space-y-6">
            

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Attention required
              </p>

              <div className="mt-6 space-y-5">
  {delayedShipments > 0 ? (
    <div className="rounded-2xl bg-red-50 p-5">
      <p className="font-black text-red-800">
        {delayedShipments} delayed shipment
        {delayedShipments !== 1 ? "s" : ""}
      </p>

      <p className="mt-2 text-sm leading-6 text-red-700">
        Review delayed parcels and contact the affected customers.
      </p>
    </div>
  ) : (
    <div className="rounded-2xl bg-green-50 p-5">
      <p className="font-black text-green-800">
        ✓ No delayed shipments
      </p>

      <p className="mt-2 text-sm leading-6 text-green-700">
        All active shipments are currently on schedule.
      </p>
    </div>
  )}

  {quoteStats.pending > 0 ? (
    <div className="rounded-2xl bg-orange-50 p-5">
      <p className="font-black text-orange-800">
        {quoteStats.pending} pending quotation
        {quoteStats.pending !== 1 ? "s" : ""}
      </p>

      <p className="mt-2 text-sm leading-6 text-orange-700">
        Customers are waiting for delivery prices.
      </p>
    </div>
  ) : (
    <div className="rounded-2xl bg-green-50 p-5">
      <p className="font-black text-green-800">
        ✓ No pending quotations
      </p>

      <p className="mt-2 text-sm leading-6 text-green-700">
        All quotation requests have been attended to.
      </p>
    </div>
  )}
</div>
            </section>
          </aside>
        </div>

        <section className="mt-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Quick actions
            </p>

            <h2 className="mt-2 text-3xl font-black">Manage the courier system</h2>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                  {action.icon}
                </div>

                <h3 className="mt-5 text-xl font-black">{action.title}</h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {action.description}
                </p>

                <p className="mt-5 font-bold text-blue-700">Open section →</p>
              </a>
            ))}
          </div>
        </section>

<section className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
    <div>
      <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
        Shipments
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Recent Shipments
      </h2>
    </div>

    <a
      href="/admin/shipments/new"
      className="font-bold text-orange-600 hover:text-orange-700"
    >
      + Create Shipment
    </a>
  </div>

  <div className="mt-7 overflow-x-auto">
    <table className="w-full min-w-[800px] text-left">
      <thead>
        <tr className="border-b border-slate-200 text-sm text-slate-500">
          <th className="pb-4 pr-5">Tracking Number</th>
          <th className="pb-4 pr-5">Sender</th>
          <th className="pb-4 pr-5">Destination</th>
          <th className="pb-4 pr-5">Status</th>
          <th className="pb-4 pr-5">Created</th>
          <th className="pb-4">Action</th>
        </tr>
      </thead>

      <tbody>
        {recentShipments.map((shipment) => (
          <tr
            key={shipment.id}
            className="border-b border-slate-100 last:border-0"
          >
            <td className="py-5 pr-5 font-black">
              {shipment.tracking_number}
            </td>

            <td className="py-5 pr-5">
              {shipment.sender_name}
            </td>

            <td className="py-5 pr-5">
              {shipment.destination}
            </td>

            <td className="py-5 pr-5">
              <span
                className={`rounded-full px-3 py-2 text-xs font-black ${getStatusStyles(
                  shipment.current_status
                )}`}
              >
                {shipment.current_status}
              </span>
            </td>

            <td className="py-5 pr-5">
              {new Date(shipment.created_at).toLocaleDateString()}
            </td>

            <td className="py-5">
              <a
                href={`/admin/shipments/${shipment.id}`}
                className="font-black text-orange-600 hover:text-orange-700"
              >
                Manage →
              </a>
            </td>
          </tr>
        ))}

        {recentShipments.length === 0 && (
          <tr>
            <td
              colSpan={6}
              className="py-10 text-center text-slate-500"
            >
              No shipments have been created yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>

      </section>
    </main>
  );
}
