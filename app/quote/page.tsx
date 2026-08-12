"use client";

import { FormEvent, useState } from "react";

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [submitting, setSubmitting] = useState(false);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setSubmitting(true);
  setErrorMessage("");

  const form = event.currentTarget;
  const formData = new FormData(form);

  const payload = {
    senderName: String(formData.get("senderName")),
    phoneNumber: String(formData.get("phoneNumber")),
    emailAddress: String(formData.get("emailAddress") || ""),
    pickupAddress: String(formData.get("pickupAddress")),
    deliveryAddress: String(formData.get("deliveryAddress")),
    pickupTown: String(formData.get("pickupTown")),
    deliveryTown: String(formData.get("deliveryTown")),
    parcelType: String(formData.get("parcelType")),
    deliveryService: String(formData.get("deliveryService")),
    weight: formData.get("weight")
      ? Number(formData.get("weight"))
      : null,
    parcelValue: formData.get("parcelValue")
      ? Number(formData.get("parcelValue"))
      : null,
    length: formData.get("length")
      ? Number(formData.get("length"))
      : null,
    width: formData.get("width")
      ? Number(formData.get("width"))
      : null,
    height: formData.get("height")
      ? Number(formData.get("height"))
      : null,
    collectionDate: String(formData.get("collectionDate") || ""),
    specialInstructions: String(
      formData.get("specialInstructions") || "",
    ),
  };

  const response = await fetch("/api/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    setErrorMessage(result.error || "Could not submit quote request.");
    setSubmitting(false);
    return;
  }

  form.reset();
  setSubmitted(true);
  setSubmitting(false);
}
    return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Request a quote
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Get an estimate for your delivery.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Complete the form below with your parcel and delivery details. Our
            team will review your request and contact you with a quotation.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_360px]">
          <form
  onSubmit={handleSubmit}
  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10"
>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Customer details
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Tell us about your shipment
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="sender-name"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Sender name
                </label>

                <input
                  id="sender-name"
                   name="senderName"
                  type="text"
                  required
                  placeholder="Full name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="phone-number"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Phone number
                </label>

                <input
                  id="phone-number"
                  name="phoneNumber"
                  type="tel"
                  required
                  placeholder="+267"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="email-address"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email-address"
                  name="emailAddress"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

            <div className="mt-12 border-t border-slate-200 pt-10">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
                Collection and delivery
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="pickup-address"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Pickup address
                  </label>

                  <textarea
                    id="pickup-address"
                    name="pickupAddress"
                    rows={4}
                    required
                    placeholder="Enter the collection address"
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="delivery-address"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Delivery address
                  </label>

                  <textarea
                    id="delivery-address"
                    name="deliveryAddress"
                    rows={4}
                    required
                    placeholder="Enter the destination address"
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pickup-town"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Pickup town
                  </label>

                  <input
                    id="pickup-town"
                    name="pickupTown"
                    type="text"
                    required
                    placeholder="Example: Francistown"
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="delivery-town"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Delivery town
                  </label>

                  <input
                    id="delivery-town"
                    name="deliveryTown"
                    type="text"
                    required
                    placeholder="Example: Gaborone"
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-slate-200 pt-10">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Parcel information
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="parcel-type"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Parcel type
                  </label>

                  <select
                    id="parcel-type"
                    name="parcelType"
                    defaultValue=""
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="" disabled>
                      Select parcel type
                    </option>
                    <option value="document">Document</option>
                    <option value="small-parcel">Small parcel</option>
                    <option value="large-parcel">Large parcel</option>
                    <option value="fragile">Fragile item</option>
                    <option value="business-goods">Business goods</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="delivery-service"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Delivery service
                  </label>

                  <select
                    id="delivery-service"
                    name="deliveryService"
                    defaultValue=""
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="" disabled>
  Select service
</option>

<option value="same-day">
  Same-Day Delivery
</option>

<option value="intercity">
  Intercity Logistics
</option>

<option value="overnight">
  Overnight Delivery
</option>

<option value="business">
  Business Logistics Solutions
</option>

<option value="medical">
  Healthcare & Medical Logistics
</option>

<option value="warehousing-customs">
  Warehousing & Customs Clearance
</option>

<option value="cross-border">
  Cross-Border & Visa Document Services
</option>

<option value="tender">
  Tender Collection & Delivery
</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="weight"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Estimated weight
                  </label>

                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    placeholder="Weight in kilograms"
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="parcel-value"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Estimated parcel value
                  </label>

                  <input
                    id="parcel-value"
                    name="parcelValue"
                    type="number"
                    required
                    min="0"
                    placeholder="Value in pula"
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="length"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Length
                  </label>

                  <input
                    id="length"
                    name="length"
                    type="number"
                    required
                    min="0"
                    placeholder="Centimetres"
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="width"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Width
                  </label>

                  <input
                    id="width"
                    name="width"
                    type="number"
                    required
                    min="0"
                    placeholder="Centimetres"
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="height"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Height
                  </label>

                  <input
                    id="height"
                    name="height"
                    type="number"
                    required
                    min="0"
                    placeholder="Centimetres"
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="collection-date"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Preferred collection date
                  </label>

                  <input
                    id="collection-date"
                    name="collectionDate"
                    type="date"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="special-instructions"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Special instructions
                  </label>

                  <textarea
                    id="special-instructions"
                    name="specialInstructions"
                    rows={5}
                    required
                    placeholder="Describe the contents, handling requirements or any other information"
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>

            <button
  type="submit"
  disabled={submitting}
  className="mt-10 w-full rounded-xl bg-orange-500 px-8 py-4 font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
>
  {submitting ? "Submitting..." : "Submit Quote Request"}
</button>

{submitted && (
  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-center font-bold text-green-700">
    Your quote request has been submitted successfully.
  </div>
)}

{errorMessage && (
  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-center font-bold text-red-700">
    {errorMessage}
  </div>
)}

           
          </form>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-slate-950 p-8 text-white">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
                What happens next?
              </p>

              <div className="mt-7 space-y-6">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-black text-orange-600">
                    1
                  </span>

                  <div>
                    <h2 className="font-black">Submit your details</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Tell us what you are sending and where it needs to go.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-black text-orange-600">
                    2
                  </span>

                  <div>
                    <h2 className="font-black">We calculate the price</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Our team reviews the distance, weight and delivery option.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-black text-orange-600">
                    3
                  </span>

                  <div>
                    <h2 className="font-black">You receive the quotation</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      We contact you by phone, email or WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Need urgent assistance?
              </p>

              <h2 className="mt-3 text-2xl font-black">
                Contact the courier team directly.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                For urgent same-day deliveries, call or WhatsApp us instead of
                waiting for an online quotation.
              </p>

              <a
                href="/contact"
                className="mt-6 inline-block font-black text-orange-600 hover:text-orange-600"
              >
                View contact information →
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}