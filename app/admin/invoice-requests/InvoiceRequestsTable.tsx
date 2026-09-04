"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type InvoiceRequest = {
  id: number;
  shipment_id: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  request_status: string;
  requested_at: string;
  shipment: {
    tracking_number: string;
    origin: string;
    destination: string;
    sender_phone: string | null;
  } | null;
};

type Props = {
  requests: InvoiceRequest[];
};

function getStatusClasses(status: string) {
  switch (status) {
    case "Invoice Generated":
      return "bg-green-100 text-green-700";

    case "Approved":
      return "bg-blue-100 text-blue-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-orange-100 text-orange-700";
  }
}

export default function InvoiceRequestsTable({
  requests,
}: Props) {
  const [search, setSearch] = useState("");

 const filteredRequests = useMemo(() => {
  const term = search.trim().toLowerCase();

  if (!term) {
    return requests;
  }

  const phoneSearchTerm = term.replace(/\D/g, "");

  return requests.filter((request) => {
    const searchableText = [
      request.customer_name,
      request.customer_email,
      request.request_status,
      request.shipment?.tracking_number,
      request.shipment?.origin,
      request.shipment?.destination,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const customerPhone = (
  request.customer_phone ||
  request.shipment?.sender_phone ||
  ""
).replace(/\D/g, "");

    const normalMatch =
      searchableText.includes(term);

    const phoneMatch =
      phoneSearchTerm.length > 0 &&
      customerPhone.includes(phoneSearchTerm);

    return normalMatch || phoneMatch;
  });
}, [requests, search]);
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
              placeholder="Search customer, phone, tracking number, route or status..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <p className="text-sm font-semibold text-slate-500">
            Showing{" "}
            <span className="font-black text-slate-900">
              {filteredRequests.length}
            </span>{" "}
            of {requests.length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black">
            Customer Requests
          </h2>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-black text-slate-700">
              No matching invoice requests found.
            </p>

            <p className="mt-2 text-slate-500">
              Try another customer name, phone number,
              tracking number or status.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                    Tracking
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                    Route
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black text-slate-600">
                    Requested
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
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <p className="font-black">
                        {request.customer_name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {request.customer_email ||
                          request.customer_phone ||
                          request.shipment?.sender_phone ||
                          "—"}
                      </p>
                    </td>

                    <td className="px-6 py-5 font-bold">
                      {request.shipment?.tracking_number ||
                        "—"}
                    </td>

                    <td className="px-6 py-5">
                      {request.shipment
                        ? `${request.shipment.origin} → ${request.shipment.destination}`
                        : "—"}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {new Date(
                        request.requested_at
                      ).toLocaleString()}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-2 text-xs font-black ${getStatusClasses(
                          request.request_status
                        )}`}
                      >
                        {request.request_status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      {request.request_status ===
                      "Invoice Generated" ? (
                        <span className="font-bold text-green-700">
                          Completed
                        </span>
                      ) : (
                        <Link
                          href={`/admin/invoices/new?shipmentId=${request.shipment_id}&requestId=${request.id}`}
                          className="font-black text-blue-700 hover:text-blue-900"
                        >
                          Generate Invoice →
                        </Link>
                      )}
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