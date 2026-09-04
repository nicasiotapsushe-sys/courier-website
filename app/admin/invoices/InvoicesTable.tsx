"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Invoice = {
  id: number;
  invoice_number: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  grand_total: number;
  balance_due: number;
  status: string;
};

type Props = {
  invoices: Invoice[];
};

function getStatusClasses(status: string) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";

    case "Partially Paid":
      return "bg-blue-100 text-blue-700";

    case "Overdue":
      return "bg-red-100 text-red-700";

    case "Cancelled":
      return "bg-slate-200 text-slate-600";

    case "Issued":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function InvoicesTable({
  invoices,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredInvoices = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return invoices;
    }

    return invoices.filter((invoice) => {
      const searchableText = [
        invoice.invoice_number,
        invoice.customer_name,
        invoice.invoice_date,
        invoice.due_date,
        invoice.status,
        invoice.grand_total?.toString(),
        invoice.balance_due?.toString(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(term);
    });
  }, [invoices, search]);

  return (
    <section className="mt-8">
      {/* SEARCH */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xl">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔎
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search invoice number, customer, status or amount..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <p className="text-sm font-semibold text-slate-500">
            Showing{" "}
            <span className="font-black text-slate-900">
              {filteredInvoices.length}
            </span>{" "}
            of {invoices.length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black">
            Invoice History
          </h2>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-black text-slate-700">
              No matching invoices found.
            </p>

            <p className="mt-2 text-slate-500">
              Try a different invoice number,
              customer name or status.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                    Invoice
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                    Total
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                    Balance
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-black text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-5 font-black">
                      {invoice.invoice_number}
                    </td>

                    <td className="px-6 py-5">
                      {invoice.customer_name}
                    </td>

                    <td className="px-6 py-5">
                      {invoice.invoice_date}
                    </td>

                    <td className="px-6 py-5 font-bold">
                      P{" "}
                      {Number(
                        invoice.grand_total
                      ).toFixed(2)}
                    </td>

                    <td className="px-6 py-5 font-bold">
                      P{" "}
                      {Number(
                        invoice.balance_due
                      ).toFixed(2)}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-2 text-xs font-black ${getStatusClasses(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        className="font-black text-blue-700 hover:text-blue-900"
                      >
                        View Invoice →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}