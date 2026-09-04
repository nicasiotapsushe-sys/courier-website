"use client";

import { FormEvent, useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentProofPage() {

    const searchParams = useSearchParams();
  const [invoiceId, setInvoiceId] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [file, setFile] = useState<File | null>(null);
  

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

useEffect(() => {
  const invoiceIdFromUrl =
    searchParams.get("invoiceId");

  const shipmentIdFromUrl =
    searchParams.get("shipmentId");

  const customerNameFromUrl =
    searchParams.get("customerName");

    const customerPhoneFromUrl =
  searchParams.get("customerPhone");


  const amountFromUrl =
    searchParams.get("amount");

  if (invoiceIdFromUrl) {
    setInvoiceId(invoiceIdFromUrl);
  }

  if (shipmentIdFromUrl) {
    setShipmentId(shipmentIdFromUrl);
  }

  if (customerNameFromUrl) {
    setCustomerName(customerNameFromUrl);
  }

if (customerPhoneFromUrl) {
  setCustomerPhone(customerPhoneFromUrl);
}

  if (amountFromUrl) {
    setAmountPaid(amountFromUrl);
  }
}, [searchParams]);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    const numericAmountPaid = Number(amountPaid);

if (
  !invoiceId ||
  !shipmentId ||
  !customerName ||
  !file
) {
  setMessage(
    "Please complete the required fields and select your proof of payment."
  );
  return;
}

if (
  !amountPaid ||
  Number.isNaN(numericAmountPaid) ||
  numericAmountPaid <= 0
) {
  setMessage(
    "Amount paid must be greater than P0.00."
  );
  return;
}

    try {
      setIsUploading(true);

      const formData = new FormData();

      formData.append("invoiceId", invoiceId);
      formData.append("shipmentId", shipmentId);
      formData.append("customerName", customerName);
      formData.append("customerPhone", customerPhone);
      formData.append(
        "paymentReference",
        paymentReference
      );
      formData.append("amountPaid", amountPaid);
      formData.append("file", file);

      const response = await fetch(
        "/api/payment-proofs",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();

      let result: {
        success?: boolean;
        message?: string;
        error?: string;
      } = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          setMessage(
            "The server returned an invalid response."
          );
          return;
        }
      }

      if (!response.ok || !result.success) {
        setMessage(
          result.error ||
            "Could not upload proof of payment."
        );
        return;

      }

      setSuccess(true);

      setMessage(
        result.message ||
          "Proof of payment submitted successfully."
      );

      setPaymentReference("");
      setAmountPaid("");
      setFile(null);

      const fileInput = document.getElementById(
        "pop-file"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Proof of payment submission error:",
        error
      );

      setMessage(
        "Something went wrong while uploading your proof of payment."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-14 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-orange-500">
            Drop It Courier Services
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Upload Proof of Payment
          </h1>

          <p className="mt-4 text-slate-600">
            Submit your proof of payment for an
            invoice. Our team will review the payment
            and confirm it once verified.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="invoice-id"
                className="text-sm font-black text-slate-700"
              >
                Invoice ID *
              </label>

              <input
  id="invoice-id"
  type="number"
  value={invoiceId}
  readOnly
  className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
/>
            </div>

            <div>
              <label
                htmlFor="shipment-id"
                className="text-sm font-black text-slate-700"
              >
                Shipment ID *
              </label>

              <input
  id="shipment-id"
  type="number"
  value={shipmentId}
  readOnly
  className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
/>
            </div>

            <div>
              <label
                htmlFor="customer-name"
                className="text-sm font-black text-slate-700"
              >
                Customer Name *
              </label>

              <input
  id="customer-name"
  type="text"
  value={customerName}
  readOnly
  className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600"
/>
            </div>

            <div>
              <label
                htmlFor="customer-phone"
                className="text-sm font-black text-slate-700"
              >
                Phone Number
              </label>

              <input
                id="customer-phone"
                type="tel"
                value={customerPhone}
                onChange={(event) =>
                  setCustomerPhone(event.target.value)
                }
                placeholder="+267..."
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="payment-reference"
                className="text-sm font-black text-slate-700"
              >
                Payment Reference
              </label>

              <input
                id="payment-reference"
                type="text"
                value={paymentReference}
                onChange={(event) =>
                  setPaymentReference(
                    event.target.value
                  )
                }
                placeholder="Bank / transaction reference"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="amount-paid"
                className="text-sm font-black text-slate-700"
              >
                Amount Paid (P)
              </label>

              <input
                id="amount-paid"
                type="number"
                min="0,01"
                step="0.01"
                value={amountPaid}
                onChange={(event) =>
                  setAmountPaid(event.target.value)
                }
                placeholder="0.00"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="pop-file"
              className="text-sm font-black text-slate-700"
            >
              Proof of Payment *
            </label>

            <div className="mt-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
              <input
                id="pop-file"
                type="file"
                required
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={(event) =>
                  setFile(
                    event.target.files?.[0] || null
                  )
                }
                className="block w-full text-sm text-slate-600"
              />

              <p className="mt-3 text-xs text-slate-500">
                JPG, PNG, WEBP or PDF. Maximum file
                size: 10 MB.
              </p>
            </div>
          </div>

          {file && (
            <div className="mt-5 rounded-xl bg-slate-100 p-4">
              <p className="text-sm font-bold">
                Selected file
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {file.name}
              </p>
            </div>
          )}

          {message && (
            <div
              className={`mt-6 rounded-xl border p-4 font-semibold ${
                success
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="mt-7 w-full rounded-xl bg-orange-500 px-6 py-4 text-lg font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading
              ? "Uploading..."
              : "Submit Proof of Payment"}
          </button>
        </form>
      </div>
    </main>
  );
}