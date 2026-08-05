import Navbar from "../../components/Navbar";

const services = [
  {
    title: "Same-Day Delivery",
    description:
      "Fast delivery for urgent parcels and documents within selected towns and cities.",
    features: ["Priority handling", "Fast collection", "Same-day completion"],
    icon: "⚡",
  },
  {
    title: "Nationwide Courier",
    description:
      "Reliable parcel delivery to towns and cities throughout Botswana.",
    features: ["Door-to-door service", "Tracking updates", "Secure handling"],
    icon: "🚚",
  },
  {
    title: "International Shipping",
    description:
      "Shipping solutions for parcels travelling outside Botswana.",
    features: ["Cross-border delivery", "Customs support", "Tracking assistance"],
    icon: "✈️",
  },
  {
    title: "Business Logistics",
    description:
      "Flexible courier solutions for companies with regular delivery needs.",
    features: ["Scheduled collections", "Corporate accounts", "Monthly reports"],
    icon: "🏢",
  },
  {
    title: "E-commerce Delivery",
    description:
      "Reliable last-mile delivery services for online stores and sellers.",
    features: ["Customer notifications", "Cash-on-delivery ready", "Returns support"],
    icon: "🛍️",
  },
  {
    title: "Document Delivery",
    description:
      "Secure delivery for legal, financial and confidential documents.",
    features: ["Confidential handling", "Proof of delivery", "Priority service"],
    icon: "📄",
  },
  {
    title: "Parcel Collection",
    description:
      "Book a pickup from your home, office or business location.",
    features: ["Convenient scheduling", "Professional collection", "Fast processing"],
    icon: "📦",
  },
  {
    title: "Freight Services",
    description:
      "Transport solutions for larger, heavier and commercial shipments.",
    features: ["Bulk cargo", "Pallet delivery", "Business support"],
    icon: "🚛",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Our services
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Courier and logistics solutions built around your needs.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            From urgent documents to regular business deliveries, we provide
            dependable services for individuals and companies.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Delivery options
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Choose the service that suits you
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Each service is designed to provide security, convenience and
              dependable delivery performance.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                  {service.icon}
                </div>

                <h2 className="mt-6 text-2xl font-black">{service.title}</h2>

                <p className="mt-4 leading-7 text-slate-600">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-slate-700"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/quote"
                  className="mt-8 inline-block font-bold text-blue-700 hover:text-blue-900"
                >
                  Request this service →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-blue-700 p-10 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
              Business customers
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Need regular deliveries?
            </h2>

            <p className="mt-5 leading-8 text-blue-100">
              We can create a customized courier plan for businesses that need
              scheduled collections, account billing and delivery reports.
            </p>

            <a
              href="/contact"
              className="mt-8 inline-block rounded-xl bg-white px-7 py-4 font-black text-blue-700"
            >
              Speak to Our Team
            </a>
          </div>

          <div className="rounded-3xl border border-slate-200 p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Not sure what to choose?
            </p>

            <h2 className="mt-3 text-4xl font-black">
              We’ll help you find the right option.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Tell us what you are sending, where it is going and when it must
              arrive. Our team will recommend the most suitable service.
            </p>

            <a
              href="/quote"
              className="mt-8 inline-block rounded-xl bg-orange-500 px-7 py-4 font-black text-white hover:bg-orange-600"
            >
              Request a Quote
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}