"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Shipments",
    href: "/admin/shipments",
  },
  {
    label: "Create Shipment",
    href: "/admin/shipments/new",
  },
  {
    label: "Customers",
    href: "/admin/customers",
  },
  {
    label: "Quotes",
    href: "/admin/quotes",
  },
  {
    label: "Invoices",
    href: "/admin/invoices",
  },
  {
    label: "Invoice Requests",
    href: "/admin/invoice-requests",
  },

{
  label: "Payment Proofs",
  href: "/admin/payment-proofs",


  },
];

export default function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    if (href === "/admin/shipments") {
      return (
        pathname === "/admin/shipments" ||
        (pathname.startsWith("/admin/shipments/") &&
          pathname !== "/admin/shipments/new")
      );
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {links.map((link) => {
        const active = isActive(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-base font-bold transition ${
              active
                ? "bg-orange-500 text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}

      <Link
        href="/admin/logout"
        className="rounded-lg bg-red-600 px-3 py-2 text-base font-bold text-white transition hover:bg-red-700"
      >
        Sign Out
      </Link>

      <Link
        href="/"
        className="ml-2 rounded-lg border border-white/20 px-3 py-2 text-base font-bold text-white transition hover:bg-white/10"
      >
        View Website
      </Link>





    </nav>
  );
}