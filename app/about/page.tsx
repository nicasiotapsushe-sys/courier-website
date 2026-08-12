const values = [
  {
    title: "Reliability",
    description:
      "We are committed to dependable, on-time delivery and consistent service across every route we operate.",
  },
  {
    title: "Innovation",
    description:
      "We embrace modern logistics technology, route coordination and smarter systems to continuously improve our services.",
  },
  {
    title: "Integrity",
    description:
      "We operate with professionalism, confidentiality and respect for our customers, their information and their consignments.",
  },
  {
    title: "Customer Commitment",
    description:
      "Our customers are at the centre of our operations, with solutions designed around their individual and business logistics needs.",
  },
  {
    title: "Customized Solutions",
    description:
      "We develop flexible logistics solutions for individuals, SMEs, corporations and specialized industries.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.28),_transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            About Drop It
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Delivering excellence across every mile.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Established in Botswana in 2020, Drop It Courier Services is a
            100% citizen-owned logistics company committed to redefining
            delivery standards through speed, reliability and innovation.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Who we are
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              A growing Botswana logistics network.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Drop It Courier Services provides efficient, secure and
              customer-focused courier solutions tailored for individuals,
              SMEs and large organizations.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Since our inception, we have steadily expanded our delivery
              network across Botswana, building strong operations in Gaborone,
              Francistown, Mahalapye, Palapye and other key locations while
              continuing to expand our footprint.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Our nationwide and cross-border logistics solutions are designed
              to keep businesses, institutions and communities connected.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-950 p-10 text-white shadow-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
              Our commitment
            </p>

            <h3 className="mt-3 text-3xl font-black">
              Speed, reliability and innovation.
            </h3>

            <p className="mt-5 leading-8 text-slate-300">
              Our operational approach combines professional handling,
              technology, route coordination and customer-focused service to
              provide dependable logistics solutions.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-black text-orange-400">2020</p>
                <p className="mt-2 text-sm text-slate-300">
                  Established in Botswana
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-black text-orange-400">100%</p>
                <p className="mt-2 text-sm text-slate-300">
                  Citizen-owned business
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">

            <article className="rounded-3xl border border-slate-200 bg-white p-9 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Our Mission
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Reliable, on-time delivery.
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                To provide our customers with reliable, on-time delivery
                services by creating an environment focused on customer
                satisfaction through state-of-the-art technology, ongoing
                training, professionalism and continuous corporate
                improvement.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-9 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Our Vision
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Botswana&apos;s most trusted courier service.
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                To become Botswana&apos;s most trusted and innovative courier
                service, delivering excellence across every mile and setting
                new standards in the logistics industry.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Our Core Values
            </p>

            <h2 className="mt-3 text-4xl font-black">
              The principles behind every delivery.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Our values guide how we serve our customers, manage
              consignments and build long-term partnerships.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 font-black text-orange-600">
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

      {/* CTA */}
      <section className="bg-orange-500 py-20 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 lg:flex-row lg:items-center">
          <div>
            <p className="font-bold uppercase tracking-widest text-orange-100">
              Your logistics partner
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Let&apos;s move your business forward.
            </h2>

            <p className="mt-4 max-w-2xl text-orange-50">
              From everyday parcels to specialized business and cross-border
              logistics, our team is ready to help.
            </p>
          </div>

          <a
            href="/quote"
            className="rounded-xl bg-white px-8 py-4 font-black text-orange-600 shadow-lg transition hover:bg-slate-100"
          >
            Request a Quote
          </a>
        </div>
      </section>

    </main>
  );
}