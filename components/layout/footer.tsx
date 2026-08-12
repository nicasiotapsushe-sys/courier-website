const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
 
  { label: "Track Parcel", href: "/track" },
  { label: "Request Quote", href: "/quote" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  "Same-Day Delivery",
  "Nationwide Courier",
  "International Shipping",
  "Business Logistics",
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-xl text-white">
              📦
            </div>

            <div>
              <p className="text-xl font-black text-white">Drop it Courier Services</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Fast. Secure. Reliable.
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-sm leading-7 text-slate-400">
            Professional courier and logistics services for individuals,
            online stores and businesses across Botswana and beyond.
          </p>
        </div>

        <div>
          <h2 className="font-black text-white">Quick links</h2>

          <nav className="mt-5 flex flex-col gap-3">
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="font-black text-white">Our services</h2>

          <div className="mt-5 flex flex-col gap-3 text-slate-400">
            {serviceLinks.map((service) => (
              <p key={service}>{service}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-black text-white">Contact information</h2>

          <div className="mt-5 space-y-4 text-slate-400">
            <p>📍 Plot 64271, Unit A1, Block 3 Industrial, Gaborone</p>

            <a
              href="tel:++267 396 0322"
              className="block transition hover:text-white"
            >
              📞 +267 396 0322
            </a>

            <a
              href="mailto:info@dropit.co.bw"
              className="block transition hover:text-white"
            >
              ✉️ info@dropit.co.bw
            </a>

            <p>🕒 Monday–Friday: 08:00–17:00</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row">
          <p>© 2026 Drop It Courier Services. All rights reserved.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-white">
              Terms and Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}