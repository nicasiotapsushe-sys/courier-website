"use client";

import { FormEvent, useState } from "react";

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

  return `SWC-${year}-${randomNumber}`;
}

export default function CreateShipmentPage() {
  const [createdShipment, setCreatedShipment] =
    useState<CreatedShipment | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const shipment: CreatedShipment = {
      trackingNumber: generateTrackingNumber(),
      senderName: String(formData.get("senderName")),
      recipientName: String(formData.get("recipientName")),
      origin: String(formData.get("origin")),
      destination: String(formData.get("destination")),
      service: String(formData.get("service")),
    };

    setCreatedShipment(shipment);
    form.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                  Sender name
                </label>

                <input
                  id="senderName"
                  name="senderName"
                  type="text"
                  required
                  placeholder="Full name or business name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="senderPhone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Sender phone
                </label>

                <input
                  id="senderPhone"
                  name="senderPhone"
                  type="tel"
                  required
                  placeholder="+267"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="senderEmail"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Sender email
                </label>

                <input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  placeholder="sender@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="origin"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Origin town
                </label>

                <input
                  id="origin"
                  name="origin"
                  type="text"
                  required
                  placeholder="Example: Francistown"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
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
                  Recipient name
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
                  Recipient phone
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
                  Recipient email
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
                  Destination town
                </label>

                <input
                  id="destination"
                  name="destination"
                  type="text"
                  required
                  placeholder="Example: Gaborone"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="deliveryAddress"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Delivery address
                </label>

                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  rows={4}
                  required
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
                  Parcel type
                </label>

                <select
                  id="parcelType"
                  name="parcelType"
                  required
                  defaultValue=""
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
                  Delivery service
                </label>

                <select
                  id="service"
                  name="service"
                  required
                  defaultValue=""
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
                  Weight in kilograms
                </label>

                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  placeholder="Example: 2.5"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="parcelValue"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Parcel value in pula
                </label>

                <input
                  id="parcelValue"
                  name="parcelValue"
                  type="number"
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
                  Estimated delivery date
                </label>

                <input
                  id="estimatedDelivery"
                  name="estimatedDelivery"
                  type="date"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="paymentStatus"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Payment status
                </label>

                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  required
                  defaultValue="Pending"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Cash on Delivery">Cash on delivery</option>
                  <option value="Account Customer">Account customer</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Handling notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows={5}
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
              className="rounded-xl bg-orange-500 px-8 py-4 font-black text-white hover:bg-orange-600"
            >
              Create Shipment
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}