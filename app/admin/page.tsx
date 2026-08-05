const statistics = [
  {
    title: "Total Shipments",
    value: "1,284",
    change: "+12% this month",
    icon: "📦",
  },
  {
    title: "In Transit",
    value: "148",
    change: "Currently moving",
    icon: "🚚",
  },
  {
    title: "Delivered",
    value: "1,036",
    change: "98% success rate",
    icon: "✅",
  },
  {
    title: "Pending Quotes",
    value: "26",
    change: "Requires attention",
    icon: "📝",
  },
];

const recentShipments = [
  {
    trackingNumber: "SWC-2026-000145",
    customer: "Mpho Enterprises",
    destination: "Gaborone",
    status: "In Transit",
    date: "5 August 2026",
  },
  {
    trackingNumber: "SWC-2026-000144",
    customer: "Lorato Fashion Store",
    destination: "Francistown",
    status: "Delivered",
    date: "5 August 2026",
  },
  {
    trackingNumber: "SWC-2026-000143",
    customer: "Thato Holdings",
    destination: "Maun",
    status: "Out for Delivery",
    date: "4 August 2026",
  },
  {
    trackingNumber: "SWC-2026-000142",
    customer: "Kagiso Molefe",
    destination: "Palapye",
    status: "Pending",
    date: "4 August 2026",
  },
];

const quickActions = [
  {
    title: "Create Shipment",
    description: "Register a new parcel and generate a tracking number.",
    icon: "➕",
    href: "/admin/shipments/new",
  },
  {
    title: "Update Tracking",
    description: "Change parcel status and current location.",
    icon: "📍",
    href: "/admin/tracking",
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

export default function AdminDashboardPage() {
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

          <a
            href="/admin/shipments/new"
            className="w-fit rounded-xl bg-orange-500 px-7 py-4 font-black text-white transition hover:bg-orange-600"
          >
            Create New Shipment
          </a>
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
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-7 py-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                  Latest activity
                </p>

                <h2 className="mt-2 text-2xl font-black">Recent Shipments</h2>
              </div>

              <a
                href="/admin/shipments"
                className="font-bold text-blue-700 hover:text-blue-900"
              >
                View all shipments →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-7 py-4 font-bold">Tracking Number</th>
                    <th className="px-7 py-4 font-bold">Customer</th>
                    <th className="px-7 py-4 font-bold">Destination</th>
                    <th className="px-7 py-4 font-bold">Status</th>
                    <th className="px-7 py-4 font-bold">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentShipments.map((shipment) => (
                    <tr
                      key={shipment.trackingNumber}
                      className="border-t border-slate-200"
                    >
                      <td className="px-7 py-5 font-black text-blue-700">
                        {shipment.trackingNumber}
                      </td>

                      <td className="px-7 py-5 font-semibold">
                        {shipment.customer}
                      </td>

                      <td className="px-7 py-5 text-slate-600">
                        {shipment.destination}
                      </td>

                      <td className="px-7 py-5">
                        <span
                          className={`rounded-full px-4 py-2 text-xs font-black ${getStatusStyles(
                            shipment.status,
                          )}`}
                        >
                          {shipment.status}
                        </span>
                      </td>

                      <td className="px-7 py-5 text-slate-500">
                        {shipment.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-blue-700 p-7 text-white shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
                Today&apos;s deliveries
              </p>

              <p className="mt-3 text-5xl font-black">42</p>

              <p className="mt-3 leading-7 text-blue-100">
                31 completed and 11 currently out for delivery.
              </p>

              <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-3/4 rounded-full bg-white" />
              </div>

              <p className="mt-3 text-sm font-bold text-blue-100">
                74% completed
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Attention required
              </p>

              <div className="mt-6 space-y-5">
                <div className="rounded-2xl bg-red-50 p-5">
                  <p className="font-black text-red-800">3 delayed shipments</p>
                  <p className="mt-2 text-sm leading-6 text-red-700">
                    Review delayed parcels and contact the affected customers.
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-50 p-5">
                  <p className="font-black text-orange-800">
                    26 pending quotations
                  </p>
                  <p className="mt-2 text-sm leading-6 text-orange-700">
                    Customers are waiting for delivery prices.
                  </p>
                </div>
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
      </section>
    </main>
  );
}