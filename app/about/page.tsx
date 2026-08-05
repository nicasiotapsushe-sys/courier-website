import Navbar from "../../components/Navbar";

const values = [
  {
    title: "Reliability",
    description:
      "We keep our promises and work hard to deliver every parcel safely and on time.",
  },
  {
    title: "Integrity",
    description:
      "We handle customer parcels, information and payments with honesty and care.",
  },
  {
    title: "Customer Service",
    description:
      "We listen to our customers and provide helpful support throughout every delivery.",
  },
  {
    title: "Innovation",
    description:
      "We use modern systems and tracking technology to improve the delivery experience.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            About our company
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Delivering trust, one parcel at a time.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Swift Courier provides dependable delivery and logistics services
            for individuals, businesses and online stores across Botswana.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Who we are
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              A courier company built around customers.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              We understand that every parcel matters. It may contain an
              important document, a customer order, a gift or essential
              business supplies.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Our team works to make the delivery process simple, secure and
              transparent from collection to final delivery.
            </p>
          </div>

          <div className="rounded-3xl bg-blue-700 p-10 text-white shadow-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
              Our commitment
            </p>

            <h3 className="mt-3 text-3xl font-black">
              Fast service without compromising safety.
            </h3>

            <p className="mt-5 leading-8 text-blue-100">
              We combine trained staff, careful parcel handling and clear
              communication to provide a dependable courier experience.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-5">
              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-3xl font-black">98%</p>
                <p className="mt-2 text-sm text-blue-100">On-time deliveries</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-3xl font-black">24/7</p>
                <p className="mt-2 text-sm text-blue-100">Tracking access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-9 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Our mission
              </p>

              <h2 className="mt-3 text-3xl font-black">
                To make delivery simple and dependable.
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                Our mission is to provide secure, affordable and efficient
                courier services while giving every customer professional
                support and peace of mind.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-9 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                Our vision
              </p>

              <h2 className="mt-3 text-3xl font-black">
                To become a trusted logistics leader.
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                Our vision is to grow into one of Southern Africa&apos;s most
                trusted courier and logistics companies through service,
                technology and strong customer relationships.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Our core values
            </p>

            <h2 className="mt-3 text-4xl font-black">
              The principles behind every delivery
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 font-black text-blue-700">
                  ✓
                </div>

                <h3 className="mt-6 text-xl font-black">{value.title}</h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-500 py-20 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 lg:flex-row lg:items-center">
          <div>
            <p className="font-bold uppercase tracking-widest text-orange-100">
              Work with us
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Let us handle your next delivery.
            </h2>
          </div>

          <a
            href="/contact"
            className="rounded-xl bg-white px-8 py-4 font-black text-orange-600 shadow-lg"
          >
            Contact Our Team
          </a>
        </div>
      </section>
    </main>
  );
}