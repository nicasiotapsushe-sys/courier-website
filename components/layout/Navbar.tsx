"use client";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";



export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

if (pathname.startsWith("/admin")) {
  return null;
}

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      
          
<a href="/" className="flex items-center">
  <Image
    src="/logos/drop-it-logo.png"
    alt="Drop It Courier Services"
    width={190}
    height={64}
    priority
    className="h-auto w-[190px]"
  />
</a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
          <a className="transition hover:text-blue-700" href="/">
            Home
          </a>

          <a className="transition hover:text-blue-700" href="/about">
            About
          </a>

          <a className="transition hover:text-blue-700" href="/services">
            Services
          </a>

          

          <a className="transition hover:text-blue-700" href="/track">
            Track Parcel
          </a>

          <a className="transition hover:text-blue-700" href="/contact">
            Contact
          </a>
        </nav>

        <div className="hidden lg:block">
          <a
            href="/quote"
            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Request a Quote
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-2xl text-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-4 font-semibold text-slate-700">
            <a href="/" onClick={() => setMenuOpen(false)}>
              Home
            </a>

            <a href="/about" onClick={() => setMenuOpen(false)}>
              About
            </a>

            <a href="/services" onClick={() => setMenuOpen(false)}>
              Services
            </a>

            

            <a href="/track" onClick={() => setMenuOpen(false)}>
              Track Parcel
            </a>

            <a href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>

            <a
              href="/quote"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl bg-orange-500 px-5 py-3 text-center font-bold text-white"
            >
              Request Quote
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}