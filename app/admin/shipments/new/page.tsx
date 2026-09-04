"use client";

import { FormEvent, useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
type CreatedShipment = {
  trackingNumber: string;
  senderName: string;
  recipientName: string;
  origin: string;
  destination: string;
  service: string;
};

function generateTrackingNumber() {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  return `DIT-${year}-${randomNumber}`;
}

const serviceLocations = [
  { code: "GBE", name: "Gaborone" },
  { code: "LOB", name: "Lobatse" },
  { code: "RAM", name: "Ramotswa" },
  { code: "MOL", name: "Molepolole" },
  { code: "KYE", name: "Kanye" },
  { code: "MOC", name: "Mochudi" },
  { code: "JWG", name: "Jwaneng" },
  { code: "OODI", name: "Oodi" },
  { code: "MAH", name: "Mahalapye" },
  { code: "DIBETE", name: "Dibete" },
  { code: "PALLAROAD", name: "Palla Road" },
  { code: "SHOSHONG", name: "Shoshong" },
  { code: "PLY", name: "Palapye" },
  { code: "SRW", name: "Serowe" },
  { code: "SER", name: "Serule" },
  { code: "SPK", name: "Selibe Phikwe" },
  { code: "BOB", name: "Bobonong" },
  { code: "MMD", name: "Mmadinare" },
  { code: "FRW", name: "Francistown" },
  { code: "TNT", name: "Tonota" },
  { code: "MATH", name: "Mathangwane" },
  { code: "MAS", name: "Masunga" },
  { code: "SEB", name: "Sebina" },
  { code: "TTM", name: "Tutume" },
  { code: "LTK", name: "Letlhakane" },
  { code: "NAT", name: "Nata" },
  { code: "MAU", name: "Maun" },
  { code: "KAS", name: "Kasane" },
  { code: "GWE", name: "Gweta" },
];

export default function CreateShipmentPage() {
  const searchParams = useSearchParams();

const quoteId = searchParams.get("quoteId") || "";

const quotePrefill = {
  senderName: searchParams.get("senderName") || "",
  senderPhone: searchParams.get("senderPhone") || "",
  senderEmail: searchParams.get("senderEmail") || "",
  pickupAddress: searchParams.get("pickupAddress") || "",
  origin: searchParams.get("origin") || "",
  deliveryAddress: searchParams.get("deliveryAddress") || "",
  destination: searchParams.get("destination") || "",
  parcelType: searchParams.get("parcelType") || "",
  service: searchParams.get("service") || "",
  weight: searchParams.get("weight") || "",
  parcelValue: searchParams.get("parcelValue") || "",
  notes: searchParams.get("notes") || "",
};
  const [createdShipment, setCreatedShipment] =
    useState<CreatedShipment | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
  if (!createdShipment) {
    setQrCodeUrl("");
    return;
  }

  const trackingUrl =
    `${window.location.origin}/track?tracking=${encodeURIComponent(
      createdShipment.trackingNumber
    )}`;

  QRCode.toDataURL(trackingUrl, {
    width: 300,
    margin: 2,
  })
    .then(setQrCodeUrl)
    .catch((error) => {
      console.error("Could not generate QR code:", error);
    });
}, [createdShipment]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (isSubmitting) return;

setIsSubmitting(true);

  console.log("CREATE SHIPMENT SUBMIT FIRED");

  const form = event.currentTarget;
  const formData = new FormData(form);

  const trackingNumber = generateTrackingNumber();

  const shipmentPayload = {
    trackingNumber,
    quoteId: quoteId || null,
    senderName: String(formData.get("senderName")),
    senderPhone: String(formData.get("senderPhone")),
    senderEmail: String(formData.get("senderEmail") || ""),
    pickupAddress: String(formData.get("pickupAddress")),
    origin: String(formData.get("origin")),
    recipientName: String(formData.get("recipientName")),
    recipientPhone: String(formData.get("recipientPhone")),
    recipientEmail: String(formData.get("recipientEmail") || ""),
    deliveryAddress: String(formData.get("deliveryAddress")),
    destination: String(formData.get("destination")),
    parcelType: String(formData.get("parcelType")),
    service: String(formData.get("service")),
    weight: Number(formData.get("weight")),
    parcelValue: formData.get("parcelValue")
      ? Number(formData.get("parcelValue"))
      : null,
    estimatedDelivery: String(formData.get("estimatedDelivery")),
paymentStatus: "Pending",
    notes: String(formData.get("notes") || ""),
  };

  try {
  const response = await fetch("/api/shipments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shipmentPayload),
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.error || "Failed to create shipment.");
    return;
  }

  setCreatedShipment({
    trackingNumber,
    senderName: shipmentPayload.senderName,
    recipientName: shipmentPayload.recipientName,
    origin: shipmentPayload.origin,
    destination: shipmentPayload.destination,
    service: shipmentPayload.service,
  });

  form.reset();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
} finally {
  setIsSubmitting(false);
}
}
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-10 md:flex-row md:items-center">
          <div>
            <a
              href="/admin"
              className="text-sm font-bold text-blue-700 hover:text-blue-900"
            >
              ← Back to dashboard
            </a>

            <h1 className="mt-4 text-4xl font-black">Create New Shipment</h1>

            <p className="mt-3 text-slate-600">
              Register a parcel and generate a customer tracking number.
            </p>
          </div>

          <span className="w-fit rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-700">
            Staff Area
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {createdShipment && (
          <section className="mb-8 rounded-3xl border border-green-200 bg-green-50 p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-green-700">
                  Shipment created successfully
                </p>

                <h2 className="mt-3 text-3xl font-black text-green-950">
                  {createdShipment.trackingNumber}
                </h2>

                <p className="mt-3 text-green-800">
                  Give this tracking number to the customer.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    createdShipment.trackingNumber,
                  )
                }
                className="rounded-xl bg-green-700 px-7 py-4 font-black text-white hover:bg-green-800"
              >
                Copy Tracking Number
              </button>

<a
  href={`/track?tracking=${encodeURIComponent(
    createdShipment.trackingNumber
  )}`}
  className="rounded-xl bg-slate-950 px-7 py-4 text-center font-black text-white hover:bg-slate-800"
>
  Track This Shipment
</a>

{qrCodeUrl && (
  <div className="rounded-2xl border border-green-200 bg-white p-4 text-center">
    <p className="text-sm font-bold uppercase tracking-widest text-green-700">
      Shipment QR Code
    </p>

    <img
      src={qrCodeUrl}
      alt={`QR code for ${createdShipment.trackingNumber}`}
      className="mx-auto mt-3 h-48 w-48"
    />

    <p className="mt-3 text-sm font-semibold text-green-800">
      Scan to track this parcel
    </p>
  </div>
)}

            </div>

            <div className="mt-7 grid gap-5 border-t border-green-200 pt-7 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm font-bold text-green-700">Sender</p>
                <p className="mt-1 font-black text-green-950">
                  {createdShipment.senderName}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-green-700">Recipient</p>
                <p className="mt-1 font-black text-green-950">
                  {createdShipment.recipientName}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-green-700">Route</p>
                <p className="mt-1 font-black text-green-950">
                  {createdShipment.origin} → {createdShipment.destination}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-green-700">Service</p>
                <p className="mt-1 font-black text-green-950">
                  {createdShipment.service}
                </p>
              </div>
            </div>
          </section>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10"
        >
          <section>

            <p className="mt-2 text-sm text-slate-500">
  Fields marked <span className="font-bold text-orange-500">*</span> are required.
</p>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Sender information
            </p>

            <h2 className="mt-3 text-3xl font-black">Who is sending?</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="senderName"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                 Sender name <span className="text-orange-500">*</span>
                </label>

                <input
                  id="senderName"
                  name="senderName"
                  type="text"
                  required
                  defaultValue={quotePrefill.senderName}
                  placeholder="Full name or business name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="senderPhone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Sender phone<span className="text-orange-500">*</span>
                </label>

                <input
  id="senderPhone"
  name="senderPhone"
  type="tel"
  required
  defaultValue={quotePrefill.senderPhone}
  inputMode="tel"
  pattern="(\+267)?[0-9]{8}"
  title="Enter an 8-digit Botswana number, optionally starting with +267"
  placeholder="Example: 77123456 or +26777123456"
  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
/>
              </div>

              <div>
                <label
                  htmlFor="senderEmail"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                 Sender email{" "}
<span className="font-normal text-slate-400">
  (optional)
</span>
                </label>

                <input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  defaultValue={quotePrefill.senderEmail}
                  placeholder="sender@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="origin"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Origin town<span className="text-orange-500">*</span>
                </label>

                <select
  id="origin"
  name="origin"
  required
  defaultValue={quotePrefill.origin}
  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
>
  <option value="" disabled>
    Select origin town
  </option>

  {serviceLocations.map((location) => (
    <option
      key={location.code}
      value={location.name}
    >
      {location.code} — {location.name}
    </option>
  ))}
</select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="pickupAddress"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Pickup address
                </label>

                <textarea
                  id="pickupAddress"
                  name="pickupAddress"
                  rows={4}
                  required
                  defaultValue={quotePrefill.pickupAddress}
                  placeholder="Enter the complete pickup address"
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          <section className="mt-12 border-t border-slate-200 pt-10">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Recipient information
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Who will receive the parcel?
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="recipientName"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Recipient name <span className="text-orange-500">*</span>
                </label>

                <input
   
    id="recipientName"
    name="recipientName"
    type="text"
    required
    placeholder="Recipient's full name"
    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
  />
              </div>

              <div>
                <label
                  htmlFor="recipientPhone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Recipient phone <span className="text-orange-500">*</span>
                </label>

                <input
                  id="recipientPhone"
                  name="recipientPhone"
                  type="tel"
                  required
                  placeholder="+267"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="recipientEmail"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Recipient email <span className="font-normal text-slate-400">(optional)</span>
                </label>

                <input
                  id="recipientEmail"
                  name="recipientEmail"
                  type="email"
                  placeholder="recipient@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="destination"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Destination town <span className="text-orange-500">*</span>
                </label>

                <select
  id="destination"
  name="destination"
  required
  defaultValue={quotePrefill.destination}
  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
>
  <option value="" disabled>
    Select destination town
  </option>

  {serviceLocations.map((location) => (
    <option
      key={location.code}
      value={location.name}
    >
      {location.code} — {location.name}
    </option>
  ))}
</select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="deliveryAddress"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Delivery address <span className="text-orange-500">*</span>
                </label>

                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  rows={4}
                  required
                  defaultValue={quotePrefill.deliveryAddress}
                  placeholder="Enter the complete delivery address"
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          <section className="mt-12 border-t border-slate-200 pt-10">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
              Parcel details
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Shipment specifications
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label
                  htmlFor="parcelType"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Parcel type <span className="text-orange-500">*</span>
                </label>

                <select
                  id="parcelType"
                  name="parcelType"
                  required
                  defaultValue={quotePrefill.parcelType}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Select parcel type
                  </option>
                  <option value="Document">Document</option>
                  <option value="Small Parcel">Small parcel</option>
                  <option value="Large Parcel">Large parcel</option>
                  <option value="Fragile Item">Fragile item</option>
                  <option value="Business Goods">Business goods</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Delivery service <span className="text-orange-500">*</span>
                </label>

                <select
                  id="service"
                  name="service"
                  required
                  defaultValue={quotePrefill.service}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Select service
                  </option>
                  <option value="Same-Day Delivery">
                    Same-day delivery
                  </option>
                  <option value="Express Delivery">Express delivery</option>
                  <option value="Standard Delivery">Standard delivery</option>
                  <option value="International Shipping">
                    International shipping
                  </option>
                  <option value="Freight Service">Freight service</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="weight"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                 Weight (kg) <span className="text-orange-500">*</span>
                </label>

                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  defaultValue={quotePrefill.weight}
                  placeholder="Example: 2.5"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="parcelValue"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Parcel value (P) <span className="font-normal text-slate-400">
  (optional)
</span>
                </label>

                <input
                  id="parcelValue"
                  name="parcelValue"
                  type="number"
                  defaultValue={quotePrefill.parcelValue}
                  min="0"
                  placeholder="Example: 1500"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="estimatedDelivery"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Estimated delivery date <span className="text-orange-500">*</span>
                </label>

                <input
  id="estimatedDelivery"
  name="estimatedDelivery"
  type="date"
  required
  min={new Date().toISOString().split("T")[0]}
  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
/>
              </div>

              
              <div className="md:col-span-2 lg:col-span-3">
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Handling notes<span className="font-normal text-slate-400">
  (optional)
</span>
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows={5}
                  defaultValue={quotePrefill.notes}
                  placeholder="Fragile, keep upright, call before delivery, or other instructions"
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          <div className="mt-12 flex flex-col-reverse justify-end gap-4 border-t border-slate-200 pt-8 sm:flex-row">
            <a
              href="/admin"
              className="rounded-xl border border-slate-300 px-8 py-4 text-center font-black text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </a>

            <button
  type="submit"
  disabled={isSubmitting}
  className="rounded-xl bg-orange-500 px-8 py-4 font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSubmitting ? "Creating..." : "Create Shipment"}
</button>
          </div>
        </form>
      </section>
    </main>
  );
}