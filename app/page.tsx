import Navbar from "../components/layout/Navbar";
const services = [
  {
    title: "Same-Day Delivery",
    description:
      "Fast delivery for urgent parcels and documents within your city.",
    icon: "⚡",
  },
  {
    title: "Nationwide Courier",
    description:
      "Reliable parcel delivery to towns and cities across Botswana.",
    icon: "🚚",
  },
  {
    title: "International Shipping",
    description:
      "Secure shipping solutions for parcels travelling beyond Botswana.",
    icon: "✈️",
  },
  {
    title: "Business Logistics",
    description:
      "Flexible delivery solutions designed for companies and online stores.",
    icon: "🏢",
  },
];

const benefits = [
  "Fast and dependable delivery",
  "Secure parcel handling",
  "Affordable courier rates",
  "Easy parcel tracking",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-xl text-white">
              📦
            </div>

            <div>
              <p className="text-lg font-bold leading-none text-blue-800">
                Swift Courier
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                Fast. Secure. Reliable.
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
            <a className="transition hover:text-blue-700" href="#">
              Home
            </a>
            <a className="transition hover:text-blue-700" href="#about">
              About
            </a>
            <a className="transition hover:text-blue-700" href="#services">
              Services
            </a>
            <a className="transition hover:text-blue-700" href="#tracking">
              Track Parcel
            </a>
            <a className="transition hover:text-blue-700" href="#contact">
              Contact
            </a>
          </nav>

          <a
            href="#contact"
            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Request Quote
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.45),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(15,23,42,1)_15%,_rgba(30,64,175,0.9)_100%)]" />

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-100">
              Trusted courier and logistics solutions
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Delivering your parcels safely across Botswana and beyond.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              From urgent documents to business shipments, we provide fast,
              secure and dependable courier services for individuals and
              companies.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#tracking"
                className="rounded-xl bg-orange-500 px-7 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Track Your Parcel
              </a>

              <a
                href="#services"
                className="rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
              >
                Explore Services
              </a>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-white/20 pt-8">
              <div>
                <p className="text-3xl font-black text-white">10K+</p>
                <p className="mt-1 text-sm text-slate-300">Parcels delivered</p>
              </div>

              <div>
                <p className="text-3xl font-black text-white">98%</p>
                <p className="mt-1 text-sm text-slate-300">On-time delivery</p>
              </div>

              <div>
                <p className="text-3xl font-black text-white">24/7</p>
                <p className="mt-1 text-sm text-slate-300">Tracking access</p>
              </div>
            </div>
          </div>

          {/* Tracking Card */}
          <div
            id="tracking"
            className="rounded-3xl border border-white/20 bg-white p-8 shadow-2xl"
          >
            <div className="mb-7">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Shipment tracking
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Track your parcel
              </h2>

              <p className="mt-3 text-slate-600">
                Enter your tracking number to check the latest delivery status.
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="tracking-number"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Tracking number
                </label>

                <input
                  id="tracking-number"
                  type="text"
                  placeholder="Example: SWC-2026-000001"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-6 py-4 font-bold text-white transition hover:bg-blue-800"
              >
                Track Shipment
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-blue-50 p-5">
              <p className="font-bold text-blue-900">
                Where is my tracking number?
              </p>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                Your tracking number appears on your receipt, shipment label,
                email or WhatsApp delivery confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Our services
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
              Delivery solutions for every need
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Whether you are sending one document or managing regular business
              deliveries, we have a service designed for you.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                  {service.icon}
                </div>

                <h3 className="mt-6 text-xl font-black text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {service.description}
                </p>

                <a
                  href="#contact"
                  className="mt-6 inline-block font-bold text-blue-700 hover:text-blue-900"
                >
                  Learn more →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-blue-700 p-10 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
              Why choose us?
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Your trusted delivery partner
            </h2>

            <p className="mt-5 leading-8 text-blue-100">
              We combine professional service, secure handling and modern
              tracking technology to give customers peace of mind from
              collection to delivery.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              About our company
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Moving parcels. Connecting people.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Swift Courier is committed to making deliveries simple,
              affordable and dependable. We support individuals, online stores
              and established businesses with professional courier and
              logistics services.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                    ✓
                  </span>
                  <p className="font-semibold text-slate-800">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Call to Action */}
      <section id="contact" className="bg-orange-500 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 lg:flex-row lg:items-center">
          <div>
            <p className="font-bold uppercase tracking-widest text-orange-100">
              Ready to send a parcel?
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              Let us handle your next delivery.
            </h2>

            <p className="mt-4 max-w-2xl text-lg text-orange-50">
              Contact our team for pricing, parcel collection and business
              courier solutions.
            </p>
          </div>

          <a
            href="mailto:info@swiftcourier.co.bw"
            className="rounded-xl bg-white px-8 py-4 font-black text-orange-600 shadow-lg transition hover:-translate-y-0.5"
          >
            Contact Our Team
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-14 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
          <div>
            <p className="text-2xl font-black text-white">Swift Courier</p>
            <p className="mt-4 max-w-sm leading-7 text-slate-400">
              Fast, secure and reliable courier and logistics services across
              Botswana and beyond.
            </p>
          </div>

          <div>
            <p className="font-bold text-white">Quick links</p>
            <div className="mt-4 flex flex-col gap-3">
              <a href="#about" className="hover:text-white">
                About Us
              </a>
              <a href="#services" className="hover:text-white">
                Services
              </a>
              <a href="#tracking" className="hover:text-white">
                Track Parcel
              </a>
            </div>
          </div>

          <div>
            <p className="font-bold text-white">Contact information</p>
            <div className="mt-4 space-y-3 text-slate-400">
              <p>Francistown, Botswana</p>
              <p>+267 00 000 000</p>
              <p>info@swiftcourier.co.bw</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800 px-6 pt-7 text-sm text-slate-500">
          © 2026 Swift Courier Services. All rights reserved.
        </div>
      </footer>
    </main>
  );
}