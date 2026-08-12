const contactDetails = [
  {
    title: "Main Office",
    value: "+267 396 0322",
    description: "Contact our Gaborone head office.",
    icon: "📞",
  },
  {
    title: "Mobile",
    value: "+267 72 772 155",
    description: "Contact our team for courier and logistics enquiries.",
    icon: "📱",
  },
  {
    title: "Email",
    value: "info@dropit.co.bw",
    description: "Send us your general enquiries.",
    icon: "✉️",
  },
  {
    title: "Head Office",
    value: "Gaborone, Botswana",
    description: "Plot 64271, Unit A1, Block 3 Industrial.",
    icon: "📍",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.28),_transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Contact Us
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Let&apos;s talk about your next delivery.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Contact Drop It Courier Services for parcel collections,
            same-day deliveries, business logistics, medical logistics,
            cross-border services and quotation requests.
          </p>
        </div>
      </section>

      {/* CONTACT DETAILS */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">
          {contactDetails.map((detail) => (
            <article
              key={detail.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                {detail.icon}
              </div>

              <h2 className="mt-5 text-xl font-black">{detail.title}</h2>

              <p className="mt-2 font-bold text-orange-600">
                {detail.value}
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                {detail.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Send Us a Message
            </p>

            <h2 className="mt-3 text-4xl font-black">
              How can we help you?
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Complete the form below and our team will get back to you
              regarding your courier or logistics requirements.
            </p>

            <form className="mt-10 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="full-name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Full name
                  </label>

                  <input
                    id="full-name"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="+267"
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Subject
                </label>

                <select
                  id="subject"
                  defaultValue=""
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                >
                  <option value="" disabled>
                    Select an enquiry type
                  </option>

                  <option value="delivery">Delivery enquiry</option>
                  <option value="tracking">Parcel tracking</option>
                  <option value="quote">Request a quotation</option>
                  <option value="business">Business logistics</option>
                  <option value="medical">Medical logistics</option>
                  <option value="cross-border">Cross-border delivery</option>
                  <option value="support">Complaint or support</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows={6}
                  placeholder="Tell us how we can assist you"
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-orange-500 px-8 py-4 font-black text-white transition hover:bg-orange-600"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* COMPANY CONTACT */}
          <div>
            <div className="rounded-3xl bg-slate-950 p-10 text-white">

              <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                Get In Touch
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Drop It Courier Services
              </h2>

              <div className="mt-8 space-y-6 text-slate-300">

                <div className="border-b border-white/10 pb-5">
                  <p className="font-bold text-white">Head Office</p>
                  <p className="mt-2">
                    Plot 64271, Unit A1
                    <br />
                    Block 3 Industrial
                    <br />
                    Gaborone, Botswana
                  </p>
                </div>

                <div className="border-b border-white/10 pb-5">
                  <p className="font-bold text-white">Telephone</p>
                  <p className="mt-2">+267 396 0322</p>
                  <p>+267 72 772 155</p>
                  <p>+267 73 031 975</p>
                  <p>+267 75 886 570</p>
                </div>

                <div>
                  <p className="font-bold text-white">Email</p>
                  <p className="mt-2">info@dropit.co.bw</p>
                  <p>marketing@dropit.co.bw</p>
                </div>

              </div>
            </div>

            {/* BRANCHES */}
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Our Branches
              </p>

              <h3 className="mt-3 text-3xl font-black">
                Connecting Botswana and beyond.
              </h3>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-2xl">📍</p>
                  <p className="mt-3 font-black">Gaborone</p>
                  <p className="mt-1 text-sm text-slate-600">Head Office</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-2xl">📍</p>
                  <p className="mt-3 font-black">Francistown</p>
                  <p className="mt-1 text-sm text-slate-600">Botswana</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-2xl">📍</p>
                  <p className="mt-3 font-black">Johannesburg</p>
                  <p className="mt-1 text-sm text-slate-600">South Africa</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}