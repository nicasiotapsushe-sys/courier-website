"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PaymentProof = {
  id: number;
  invoice_id: number;
  shipment_id: number;
  customer_name: string;
  customer_phone: string | null;
  payment_reference: string | null;
  amount_paid: number | null;
  status: string;
  uploaded_at: string;
};

type Props = {
  proofs: PaymentProof[];
};

function getStatusClasses(status: string) {
  switch (status) {
    case "Verified":
      return "bg-green-100 text-green-700";

    case "Rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-orange-100 text-orange-700";
  }
}

export default function PaymentProofsTable({
  proofs,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredProofs = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return proofs;
    }

    const phoneSearchTerm = term.replace(/\D/g, "");

    return proofs.filter((proof) => {
      const searchableText = [
        proof.customer_name,
        proof.payment_reference,
        proof.status,
        proof.invoice_id?.toString(),
        proof.shipment_id?.toString(),
        proof.amount_paid?.toString(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const customerPhone = (
        proof.customer_phone || ""
      ).replace(/\D/g, "");

      const normalMatch =
        searchableText.includes(term);

      const phoneMatch =
        phoneSearchTerm.length > 0 &&
        customerPhone.includes(phoneSearchTerm);

      return normalMatch || phoneMatch;
    });
  }, [proofs, search]);

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
              placeholder="Search customer, phone, reference, invoice or status..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <p className="text-sm font-semibold text-slate-500">
            Showing{" "}
            <span className="font-black text-slate-900">
              {filteredProofs.length}
            </span>{" "}
            of {proofs.length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {filteredProofs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-black text-slate-700">
              No matching payment proofs found.
            </p>

            <p className="mt-2 text-slate-500">
              Try another customer name, phone number,
              payment reference or invoice number.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black">
                    Invoice
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black">
                    Reference
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-black">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-black">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredProofs.map((proof) => (
                  <tr
                    key={proof.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <p className="font-black">
                        {proof.customer_name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {proof.customer_phone || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-5 font-bold">
                      #{proof.invoice_id}
                    </td>

                    <td className="px-6 py-5">
                      {proof.payment_reference || "—"}
                    </td>

                    <td className="px-6 py-5 font-black">
                      {proof.amount_paid !== null
                        ? `P ${Number(
                            proof.amount_paid
                          ).toFixed(2)}`
                        : "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-2 text-xs font-black ${getStatusClasses(
                          proof.status
                        )}`}
                      >
                        {proof.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/payment-proofs/${proof.id}`}
                        className="font-black text-blue-700 hover:text-blue-900"
                      >
                        Review →
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