import Navbar from "../../components/Navbar";

const contactDetails = [
  {
    title: "Phone",
    value: "+267 00 000 000",
    description: "Call us during business hours.",
    icon: "📞",
  },
  {
    title: "WhatsApp",
    value: "+267 00 000 000",
    description: "Message us for quick assistance.",
    icon: "💬",
  },
  {
    title: "Email",
    value: "info@swiftcourier.co.bw",
    description: "Send us your enquiries.",
    icon: "✉️",
  },
  {
    title: "Office",
    value: "Francistown, Botswana",
    description: "Visit our courier service office.",
    icon: "📍",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Contact us
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Let’s talk about your next delivery.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Contact our team for parcel collections, delivery enquiries,
            business logistics and quotation requests.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">
          {contactDetails.map((detail) => (
            <article
              key={detail.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                {detail.icon}
              </div>

              <h2 className="mt-5 text-xl font-black">{detail.title}</h2>

              <p className="mt-2 font-bold text-blue-700">{detail.value}</p>

              <p className="mt-3 leading-7 text-slate-600">
                {detail.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Send us a message
            </p>

            <h2 className="mt-3 text-4xl font-black">
              How can we help you?
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Complete the form and our team will respond as soon as possible.
              The form is currently a design preview. We will connect it to a
              working email or database later.
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Select an enquiry type
                  </option>
                  <option value="delivery">Delivery enquiry</option>
                  <option value="tracking">Parcel tracking</option>
                  <option value="quote">Request a quotation</option>
                  <option value="business">Business logistics</option>
                  <option value="complaint">Complaint or support</option>
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
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-blue-700 px-8 py-4 font-black text-white transition hover:bg-blue-800"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <div className="rounded-3xl bg-blue-700 p-10 text-white">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
                Business hours
              </p>

              <h2 className="mt-3 text-3xl font-black">
                When you can reach us
              </h2>

              <div className="mt-8 space-y-5">
                <div className="flex justify-between border-b border-white/20 pb-4">
                  <span>Monday – Friday</span>
                  <span className="font-bold">08:00 – 17:00</span>
                </div>

                <div className="flex justify-between border-b border-white/20 pb-4">
                  <span>Saturday</span>
                  <span className="font-bold">08:00 – 13:00</span>
                </div>

                <div className="flex justify-between">
                  <span>Sunday and public holidays</span>
                  <span className="font-bold">Closed</span>
                </div>
              </div>

              <div className="mt-10 rounded-2xl bg-white/10 p-6">
                <p className="font-black">Urgent delivery?</p>

                <p className="mt-2 leading-7 text-blue-100">
                  Contact us directly by phone or WhatsApp for urgent same-day
                  delivery enquiries.
                </p>
              </div>
            </div>

            <div className="mt-8 flex min-h-[350px] items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 p-8 text-center">
              <div>
                <p className="text-5xl">🗺️</p>
                <h3 className="mt-4 text-2xl font-black">Google Map</h3>
                <p className="mt-3 max-w-sm leading-7 text-slate-600">
                  We will embed the company’s exact Google Maps location here
                  after receiving the official address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}