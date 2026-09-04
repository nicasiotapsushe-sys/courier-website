"use client";

import { useState,useEffect } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import type { ShipmentOption } from "./page";



type Props = {
    
  shipments: ShipmentOption[];
};

export default function CreateInvoiceForm({
  shipments,
}: Props) {

      const router = useRouter();
      const searchParams = useSearchParams();
      const requestId = searchParams.get("requestId");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedShipmentId, setSelectedShipmentId] =
    useState("");

const [invoiceDate, setInvoiceDate] = useState(
  new Date().toISOString().split("T")[0]
);

const [dueDate, setDueDate] = useState("");

const [salesRep, setSalesRep] = useState("");

const [description, setDescription] = useState("");

const [quantity, setQuantity] = useState("1");

const [unitPriceExcl, setUnitPriceExcl] =
  useState("");

const [discountPercent, setDiscountPercent] =
  useState("0");

const [vatRate, setVatRate] = useState("14");

useEffect(() => {
  const shipmentIdFromUrl = searchParams.get("shipmentId");

  if (!shipmentIdFromUrl) {
    return;
  }

  const shipment = shipments.find(
    (item) => String(item.id) === shipmentIdFromUrl
  );

  if (!shipment) {
    return;
  }

  setSelectedShipmentId(shipmentIdFromUrl);

  setDescription(
    `Freight Charge - Collect from ${shipment.origin} and Deliver to ${shipment.destination} - Waybill ${shipment.tracking_number}`
  );
}, [searchParams, shipments]);


const qty = Number(quantity) || 0;
const price = Number(unitPriceExcl) || 0;
const discount = Number(discountPercent) || 0;
const vat = Number(vatRate) || 0;

const beforeDiscount = qty * price;

const discountAmount =
  beforeDiscount * (discount / 100);

const exclusiveTotal =
  beforeDiscount - discountAmount;

const vatAmount =
  exclusiveTotal * (vat / 100);

const inclusiveTotal =
  exclusiveTotal + vatAmount;


  const selectedShipment = shipments.find(
    (shipment) =>
      String(shipment.id) === selectedShipmentId
  );

async function handleGenerateInvoice() {
  if (!selectedShipment) {
    return;
  }

  if (
    !invoiceDate ||
    !dueDate ||
    !description ||
    !unitPriceExcl
  ) {
    setErrorMessage(
      "Please complete all required invoice fields."
    );
    return;
  }

  try {
    setIsSaving(true);
    setErrorMessage("");

    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shipmentId: selectedShipment.id,
        customerName: selectedShipment.sender_name,
        invoiceDate,
        dueDate,
        salesRep,
        description:
          description ||
          `Freight Charge - Collect from ${selectedShipment.origin} and Deliver to ${selectedShipment.destination}`,
        quantity,
        unitPriceExcl,
        discountPercent,
        vatRate,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
  setErrorMessage(
    result.error || "Could not create invoice."
  );
  return;
}

if (requestId) {
  const requestResponse = await fetch(
    `/api/invoice-requests/${requestId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestStatus: "Invoice Generated",
        invoiceId: result.invoice.id,
      }),
    }
  );

  
  const requestText = await requestResponse.text();

let requestResult: {
  success?: boolean;
  error?: string;
} = {};

if (requestText) {
  try {
    requestResult = JSON.parse(requestText);
  } catch (error) {
    console.error(
      "Could not parse invoice request response:",
      error
    );
  }
}

if (!requestResponse.ok || !requestResult.success) {
  console.error(
    "Invoice created, but invoice request could not be updated:",
    requestResult
  );
}
}

router.push(
  `/admin/invoices/${result.invoice.id}`
);

router.refresh();
  } catch (error) {
    console.error("Invoice creation error:", error);

    setErrorMessage(
      "Something went wrong while creating the invoice."
    );
  } finally {
    setIsSaving(false);
  }
}


  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <label
        htmlFor="shipment"
        className="text-sm font-black text-slate-700"
      >
        Select Shipment
      </label>

      <select
        id="shipment"
        value={selectedShipmentId}
        onChange={(event) => {
  const shipmentId = event.target.value;

  setSelectedShipmentId(shipmentId);

  const shipment = shipments.find(
    (item) => String(item.id) === shipmentId
  );

  if (shipment) {
    setDescription(
      `Freight Charge - Collect from ${shipment.origin} and Deliver to ${shipment.destination} - Waybill ${shipment.tracking_number}`
    );
  } else {
    setDescription("");
  }
}
        }
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
      >
        <option value="">
          Select a shipment...
        </option>

        {shipments.map((shipment) => (
          <option
            key={shipment.id}
            value={shipment.id}
          >
            {shipment.tracking_number} —{" "}
            {shipment.origin} → {shipment.destination}
          </option>
        ))}
      </select>

      {selectedShipment && (
        <div className="mt-8 rounded-2xl bg-slate-50 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-orange-500">
            Selected Shipment
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {selectedShipment.tracking_number}
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold text-slate-500">
                CUSTOMER
              </p>

              <p className="mt-1 font-bold">
                {selectedShipment.sender_name}
              </p>

              <p className="text-sm text-slate-600">
                {selectedShipment.sender_phone || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500">
                ROUTE
              </p>

              <p className="mt-1 font-bold">
                {selectedShipment.origin} →{" "}
                {selectedShipment.destination}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500">
                SERVICE
              </p>

              <p className="mt-1 font-bold">
                {selectedShipment.service || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500">
                PARCEL
              </p>

              <p className="mt-1 font-bold">
                {selectedShipment.parcel_type || "—"}
              </p>
            </div>
          </div>
        </div>
      )}

{selectedShipment && (
  <div className="mt-8 border-t border-slate-200 pt-8">
    <h2 className="text-2xl font-black">
      Invoice Details
    </h2>

    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <div>
        <label className="text-sm font-bold text-slate-700">
          Invoice Date
        </label>

        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Due Date
        </label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Sales Representative
        </label>

        <input
          type="text"
          value={salesRep}
          onChange={(e) => setSalesRep(e.target.value)}
          placeholder="e.g. Oduetse Malope"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>
    </div>

    <h3 className="mt-10 text-xl font-black">
      Invoice Item
    </h3>

    <div className="mt-5 grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Freight Charge - Collect from ${selectedShipment.origin} and Deliver to ${selectedShipment.destination}`}
          rows={3}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Quantity
        </label>

        <input
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Price Excluding VAT (P)
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          value={unitPriceExcl}
          onChange={(e) =>
            setUnitPriceExcl(e.target.value)
          }
          placeholder="0.00"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Discount %
        </label>

        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={discountPercent}
          onChange={(e) =>
            setDiscountPercent(e.target.value)
          }
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          VAT %
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          value={vatRate}
          onChange={(e) => setVatRate(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>
    </div>

    <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
      <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
        Invoice Summary
      </p>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between">
          <span>Exclusive Total</span>
          <strong>
            P {exclusiveTotal.toFixed(2)}
          </strong>
        </div>

        <div className="flex justify-between">
          <span>VAT</span>
          <strong>
            P {vatAmount.toFixed(2)}
          </strong>
        </div>

        <div className="border-t border-slate-700 pt-4">
          <div className="flex justify-between text-xl">
            <span className="font-black">
              Grand Total
            </span>

            <strong className="text-orange-400">
              P {inclusiveTotal.toFixed(2)}
            </strong>
          </div>
        </div>
      </div>
    </div>

    {errorMessage && (
  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
    {errorMessage}
  </div>
)}

<button
  type="button"
  onClick={handleGenerateInvoice}
  disabled={isSaving}
  className="mt-7 w-full rounded-xl bg-orange-500 px-6 py-4 text-lg font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSaving
    ? "Generating Invoice..."
    : "Generate Invoice"}
</button>
  </div>
)}

    </section>
  );
}