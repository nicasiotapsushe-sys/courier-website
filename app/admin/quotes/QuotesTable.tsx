"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Quote = {
  id: number;
  sender_name: string;
  phone_number: string;
  email_address: string | null;
  pickup_town: string;
  delivery_town: string;
  delivery_service: string;
  quoted_price: number | null;
  status: string;
  created_at: string;
};

type Props = {
  quotes: Quote[];
};
function normalizeBotswanaPhone(phone: string) {
  const cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");

  if (cleaned.startsWith("+267")) {
    return cleaned.slice(4);
  }

  if (cleaned.startsWith("267") && cleaned.length === 11) {
    return cleaned.slice(3);
  }

  return cleaned;
}
function getStatusClasses(status: string) {
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-700";

    case "Reviewed":
      return "bg-blue-100 text-blue-700";

    case "Quoted":
      return "bg-purple-100 text-purple-700";

    case "Accepted":
      return "bg-green-100 text-green-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function QuotesTable({
  quotes,
}: Props) {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

   const filteredQuotes = useMemo(() => {
  const term = search.trim().toLowerCase();

  return quotes.filter((quote) => {
    const searchableText = [
      quote.sender_name,
      quote.phone_number,
      quote.email_address,
      quote.pickup_town,
      quote.delivery_town,
      quote.delivery_service,
      quote.status,
      quote.quoted_price?.toString(),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !term || searchableText.includes(term);

    const matchesStatus =
      statusFilter === "All" ||
      quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [quotes, search, statusFilter]);

  return (
    <div className="mt-10">
      {/* SEARCH */}
<div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

    <div className="flex w-full flex-col gap-3 md:max-w-3xl md:flex-row">

      {/* Search Input */}
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          🔎
        </span>

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search customer, phone, email, route or status..."
          className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value)
        }
        className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
      >
        <option value="All">All statuses</option>
        <option value="Pending">Pending</option>
        <option value="Reviewed">Reviewed</option>
        <option value="Quoted">Quoted</option>
        <option value="Accepted">Accepted</option>
        <option value="Rejected">Rejected</option>
      </select>

    </div>

    <p className="whitespace-nowrap text-sm font-semibold text-slate-500">
      Showing{" "}
      <span className="font-black text-slate-900">
        {filteredQuotes.length}
      </span>{" "}
      of {quotes.length}
    </p>

  </div>
</div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-950 text-left text-sm text-white">
              <tr>
                <th className="px-6 py-4">
                  Customer
                </th>

                <th className="px-6 py-4">
                  Route
                </th>

                <th className="px-6 py-4">
                  Service
                </th>

                <th className="px-6 py-4">
                  Price
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Submitted
                </th>

                <th className="px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredQuotes.map((quote) => (
                <tr
  key={quote.id}
  className={`transition hover:bg-slate-50 ${
    quote.status === "Pending"
      ? "bg-orange-50/50"
      : ""
  }`}
>
                  <td className="px-6 py-5">
  <p className="font-black">
    {quote.sender_name}
  </p>

  <a
    href={`https://wa.me/267${normalizeBotswanaPhone(
      quote.phone_number
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-green-700 hover:text-green-800"
    title="Chat with customer on WhatsApp"
  >
    <span>💬</span>
    <span>{quote.phone_number}</span>
  </a>

  {quote.email_address && (
    <p className="mt-1">
      <a
        href={`mailto:${quote.email_address}`}
        className="text-xs text-slate-500 hover:text-orange-600"
      >
        {quote.email_address}
      </a>
    </p>
  )}
</td>

                  <td className="px-6 py-5">
                    <p className="font-semibold">
                      {quote.pickup_town}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      → {quote.delivery_town}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span className="font-medium">
                      {quote.delivery_service}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    {quote.quoted_price !== null ? (
                      <span className="font-black text-slate-900">
                        P
                        {Number(
                          quote.quoted_price
                        ).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        Not quoted
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${getStatusClasses(
                        quote.status
                      )}`}
                    >
                      {quote.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm text-slate-600">
  {new Date(quote.created_at).toLocaleDateString("en-GB", {
    timeZone: "Africa/Gaborone",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</td>

                  <td className="px-6 py-5">
                    <Link
  href={`/admin/quotes/${quote.id}`}
  className={`inline-flex rounded-xl px-4 py-2 text-sm font-black transition ${
    quote.status === "Pending"
      ? "bg-orange-500 text-white hover:bg-orange-600"
      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
  }`}
>
  {quote.status === "Pending"
    ? "Review Quote"
    : "View Quote"}
</Link>
                  </td>
                </tr>
              ))}

              {filteredQuotes.length === 0 && (
  <tr>
    <td
      colSpan={7}
      className="px-6 py-16 text-center"
    >
      {quotes.length === 0 ? (
        <div>
          <p className="text-lg font-black text-slate-800">
            No quote requests yet
          </p>

          <p className="mt-2 text-sm text-slate-500">
            New customer quotation requests will appear here automatically.
          </p>

          <Link
            href="/quote"
            className="mt-5 inline-block font-black text-orange-600 hover:text-orange-700"
          >
            View Public Quote Page →
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-lg font-black text-slate-800">
            No quotes match your search
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Try a different customer name, phone number, route, service, or status.
          </p>

          <button
  type="button"
  onClick={() => {
    setSearch("");
    setStatusFilter("All");
  }}
  className="mt-5 font-black text-orange-600 hover:text-orange-700"
>
  Clear filters
</button>
        </div>
      )}
    </td>
  </tr>
)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}