import Navbar from "../../components/layout/Navbar";

const achievements = [
  "Built a customer-focused courier service",
  "Developed reliable local delivery operations",
  "Introduced digital parcel tracking",
  "Created logistics solutions for small businesses",
];

export default function FounderPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Meet the founder
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Leadership driven by service, trust and innovation.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Learn more about the person behind Swift Courier and the vision
            guiding the company&apos;s growth.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-100 p-8">
            <div className="flex min-h-[500px] items-center justify-center rounded-2xl bg-slate-300 text-center text-slate-600">
              <div>
                <p className="text-6xl">👤</p>
                <p className="mt-4 font-bold">Founder Photo Placeholder</p>
                <p className="mt-2 text-sm">
                  Replace this with a professional portrait
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Founder and managing director
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Your Founder&apos;s Name
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              The founder established Swift Courier with a simple goal: to make
              parcel delivery more reliable, transparent and customer-friendly.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              With a strong interest in logistics, technology and customer
              service, the founder developed a courier company focused on
              secure handling, clear communication and dependable delivery.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Today, that same vision continues to guide the company as it
              expands its services and builds stronger connections between
              customers, businesses and communities.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Leadership philosophy
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Put customers first and keep improving.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Strong leadership means listening to customers, supporting staff
              and constantly improving the systems used to collect, track and
              deliver parcels.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Vision for the future
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Build a trusted logistics network across the region.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              The long-term vision is to expand delivery coverage, strengthen
              digital tracking and support more businesses with dependable
              courier and logistics solutions.
            </p>
          </article>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Key achievements
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Building the company step by step
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <article
                key={achievement}
                className="flex items-start gap-5 rounded-2xl border border-slate-200 p-7"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-xl font-black text-white">
                  {index + 1}
                </span>

                <p className="pt-2 text-lg font-bold text-slate-800">
                  {achievement}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-700 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
            Message from the founder
          </p>

          <blockquote className="mt-6 text-3xl font-black leading-relaxed md:text-4xl">
            “Every parcel represents trust. Our responsibility is to protect
            that trust from collection to delivery.”
          </blockquote>

          <p className="mt-6 text-blue-100">
            Founder, Swift Courier Services
          </p>
        </div>
      </section>
    </main>
  );
}