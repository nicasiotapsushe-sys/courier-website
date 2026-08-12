const services = [
  {
    title: "Same-Day Delivery",
    description:
      "Designed for urgent parcels and documents, with rapid collection and delivery in and around Gaborone and Francistown.",
    features: [
      "Urgent parcel handling",
      "Rapid local collection",
      "Fast same-day delivery",
    ],
    icon: "⚡",
  },
  {
    title: "Intercity Logistics",
    description:
      "Reliable same-day movement between Gaborone and Francistown, with efficient routing through key transit points such as Mahalapye and Palapye.",
    features: [
      "Gaborone ↔ Francistown",
      "Same-day intercity service",
      "Strategic transit routing",
    ],
    icon: "🚚",
  },
  {
    title: "Overnight Delivery",
    description:
      "A dependable next-business-day delivery solution between Gaborone and Francistown for time-sensitive consignments.",
    features: [
      "Next-business-day delivery",
      "Scheduled cut-off times",
      "Secure overnight transit",
    ],
    icon: "🌙",
  },
  {
    title: "Business Logistics Solutions",
    description:
      "Tailored courier support for companies that require bulk deliveries, recurring routes and dependable movement between branches, suppliers and customers.",
    features: [
      "Scheduled collections",
      "Bulk deliveries",
      "Recurring delivery routes",
    ],
    icon: "🏢",
  },
  {
    title: "Healthcare & Medical Logistics",
    description:
      "Specialized transport of pathology samples and sensitive medical consignments with careful handling, confidentiality and time-critical delivery.",
    features: [
      "Medical sample transport",
      "Temperature-sensitive handling",
      "Botswana & South Africa routes",
    ],
    icon: "🏥",
  },
  {
    title: "Warehousing & Customs Clearance",
    description:
      "End-to-end logistics support including secure storage, inventory handling, organized distribution and customs processing for local and cross-border trade.",
    features: [
      "Secure warehousing",
      "Inventory handling",
      "Customs documentation",
    ],
    icon: "🏬",
  },
  {
    title: "Cross-Border & Visa Document Services",
    description:
      "Secure Botswana–South Africa parcel and document delivery, including dedicated collection and return of visa and immigration documentation.",
    features: [
      "Botswana–South Africa delivery",
      "Visa document handling",
      "Confidential processing",
    ],
    icon: "✈️",
  },
  {
    title: "Tender Collection & Delivery",
    description:
      "Secure collection and delivery of time-sensitive tender documents with strict attention to confidentiality, deadlines and accurate submission.",
    features: [
      "Tender collections",
      "Deadline-focused delivery",
      "Confidential document handling",
    ],
    icon: "📄",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.28),_transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Our Services
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Logistics solutions built for speed, security and reliability.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Drop It Courier Services provides tailored courier and logistics
            solutions for individuals, businesses, healthcare providers,
            government, mining and other organizations across Botswana and
            cross-border routes.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              What We Offer
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Courier and logistics services for every requirement.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              From urgent local deliveries to specialized medical,
              warehousing and cross-border logistics, our services are designed
              around customer needs.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl">
                  {service.icon}
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  {service.title}
                </h2>

                <p className="mt-4 leading-7 text-slate-600">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-slate-700"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                        ✓
                      </span>

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/quote"
                  className="mt-8 inline-block font-bold text-orange-600 transition hover:text-orange-700"
                >
                  Request this service →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS LOGISTICS */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-950 p-10 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
              Business Logistics
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Logistics solutions that grow with your business.
            </h2>

            <p className="mt-5 leading-8 text-slate-300">
              We support businesses with scheduled collections, recurring
              routes, bulk deliveries and customized logistics solutions
              designed around operational requirements.
            </p>

            <a
              href="/contact"
              className="mt-8 inline-block rounded-xl bg-orange-500 px-7 py-4 font-black text-white transition hover:bg-orange-600"
            >
              Speak to Our Team
            </a>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Not sure which service you need?
            </p>

            <h2 className="mt-3 text-4xl font-black">
              We&apos;ll help you choose the right solution.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Tell us what you are sending, where it needs to go and when it
              must arrive. Our team will recommend a suitable logistics option
              based on your requirements.
            </p>

            <a
              href="/quote"
              className="mt-8 inline-block rounded-xl bg-orange-500 px-7 py-4 font-black text-white transition hover:bg-orange-600"
            >
              Request a Quote
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}