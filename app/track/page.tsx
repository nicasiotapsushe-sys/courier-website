"use client";

import { FormEvent, useState } from "react";
import Navbar from "../../components/layout/Navbar";

type TrackingEvent = {
  status: string;
  location: string;
  date: string;
  completed: boolean;
};

type Shipment = {
  trackingNumber: string;
  status: string;
  sender: string;
  recipient: string;
  origin: string;
  destination: string;
  currentLocation: string;
  service: string;
  weight: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
};

const demoShipments: Record<string, Shipment> = {
  "SWC-2026-000001": {
    trackingNumber: "SWC-2026-000001",
    status: "In Transit",
    sender: "Mpho Enterprises",
    recipient: "Kagiso Molefe",
    origin: "Francistown",
    destination: "Gaborone",
    currentLocation: "Palapye Distribution Hub",
    service: "Express Delivery",
    weight: "3.5 kg",
    estimatedDelivery: "8 August 2026",
    events: [
      {
        status: "Parcel Received",
        location: "Francistown Office",
        date: "5 August 2026, 09:15",
        completed: true,
      },
      {
        status: "Collected",
        location: "Francistown",
        date: "5 August 2026, 11:30",
        completed: true,
      },
      {
        status: "Sorting Facility",
        location: "Francistown Distribution Centre",
        date: "5 August 2026, 16:45",
        completed: true,
      },
      {
        status: "In Transit",
        location: "Palapye Distribution Hub",
        date: "6 August 2026, 08:20",
        completed: true,
      },
      {
        status: "Out for Delivery",
        location: "Gaborone",
        date: "Pending",
        completed: false,
      },
      {
        status: "Delivered",
        location: "Recipient address",
        date: "Pending",
        completed: false,
      },
    ],
  },

  "SWC-2026-000002": {
    trackingNumber: "SWC-2026-000002",
    status: "Delivered",
    sender: "Thato Online Store",
    recipient: "Lorato Kgosidintsi",
    origin: "Gaborone",
    destination: "Francistown",
    currentLocation: "Delivered to recipient",
    service: "Standard Delivery",
    weight: "1.2 kg",
    estimatedDelivery: "Delivered 4 August 2026",
    events: [
      {
        status: "Parcel Received",
        location: "Gaborone Office",
        date: "2 August 2026, 10:00",
        completed: true,
      },
      {
        status: "Collected",
        location: "Gaborone",
        date: "2 August 2026, 12:10",
        completed: true,
      },
      {
        status: "Sorting Facility",
        location: "Gaborone Distribution Centre",
        date: "2 August 2026, 17:30",
        completed: true,
      },
      {
        status: "In Transit",
        location: "Palapye",
        date: "3 August 2026, 07:45",
        completed: true,
      },
      {
        status: "Out for Delivery",
        location: "Francistown",
        date: "4 August 2026, 08:15",
        completed: true,
      },
      {
        status: "Delivered",
        location: "Francistown",
        date: "4 August 2026, 11:42",
        completed: true,
      },
    ],
  },
};

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [searched, setSearched] = useState(false);

  function handleTracking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedNumber = trackingNumber.trim().toUpperCase();

    setShipment(demoShipments[cleanedNumber] ?? null);
    setSearched(true);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Parcel tracking
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
            Know where your parcel is at every step.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Enter your tracking number to view the latest shipment status,
            location and delivery history.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <form
              onSubmit={handleTracking}
              className="flex flex-col gap-4 md:flex-row"
            >
              <div className="flex-1">
                <label
                  htmlFor="tracking-number"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Tracking number
                </label>

                <input
                  id="tracking-number"
                  type="text"
                  value={trackingNumber}
                  onChange={(event) => setTrackingNumber(event.target.value)}
                  placeholder="Example: SWC-2026-000001"
                  className="w-full rounded-xl border border-slate-300 px-4 py-4 uppercase outline-none transition placeholder:normal-case focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-auto rounded-xl bg-orange-500 px-8 py-4 font-black text-white transition hover:bg-orange-600"
              >
                Track Parcel
              </button>
            </form>

            <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
              Test the page using:
              <span className="ml-2 font-black">SWC-2026-000001</span>
              <span className="mx-2">or</span>
              <span className="font-black">SWC-2026-000002</span>
            </div>
          </div>

          {searched && !shipment && (
            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <div className="text-5xl">🔍</div>

              <h2 className="mt-4 text-2xl font-black text-red-900">
                Tracking number not found
              </h2>

              <p className="mt-3 text-red-700">
                Please check the tracking number and try again.
              </p>
            </div>
          )}

          {shipment && (
            <div className="mt-8 space-y-8">
              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                      Tracking number
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-slate-900">
                      {shipment.trackingNumber}
                    </h2>
                  </div>

                  <span
                    className={`w-fit rounded-full px-5 py-2 text-sm font-black ${
                      shipment.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {shipment.status}
                  </span>
                </div>

                <div className="mt-8 grid gap-6 border-t border-slate-200 pt-8 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Current location
                    </p>
                    <p className="mt-2 font-black">
                      {shipment.currentLocation}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Estimated delivery
                    </p>
                    <p className="mt-2 font-black">
                      {shipment.estimatedDelivery}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Delivery service
                    </p>
                    <p className="mt-2 font-black">{shipment.service}</p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Parcel weight
                    </p>
                    <p className="mt-2 font-black">{shipment.weight}</p>
                  </div>
                </div>
              </section>

              <section className="grid gap-8 lg:grid-cols-2">
                <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                    Shipment details
                  </p>

                  <div className="mt-7 space-y-5">
                    <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                      <span className="text-slate-500">Sender</span>
                      <span className="text-right font-black">
                        {shipment.sender}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                      <span className="text-slate-500">Recipient</span>
                      <span className="text-right font-black">
                        {shipment.recipient}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
                      <span className="text-slate-500">Origin</span>
                      <span className="text-right font-black">
                        {shipment.origin}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Destination</span>
                      <span className="text-right font-black">
                        {shipment.destination}
                      </span>
                    </div>
                  </div>
                </article>

                <article className="rounded-3xl bg-blue-700 p-8 text-white shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
                    Need assistance?
                  </p>

                  <h2 className="mt-3 text-3xl font-black">
                    Have a question about this shipment?
                  </h2>

                  <p className="mt-5 leading-8 text-blue-100">
                    Contact our courier support team and provide your tracking
                    number for faster assistance.
                  </p>

                  <a
                    href="/contact"
                    className="mt-7 inline-block rounded-xl bg-white px-7 py-4 font-black text-blue-700"
                  >
                    Contact Support
                  </a>
                </article>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                  Delivery progress
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  Shipment timeline
                </h2>

                <div className="mt-10 space-y-0">
                  {shipment.events.map((trackingEvent, index) => (
                    <div
                      key={`${trackingEvent.status}-${trackingEvent.date}`}
                      className="relative flex gap-5 pb-10 last:pb-0"
                    >
                      {index < shipment.events.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 h-full w-0.5 ${
                            trackingEvent.completed
                              ? "bg-blue-600"
                              : "bg-slate-200"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black ${
                          trackingEvent.completed
                            ? "bg-blue-700 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {trackingEvent.completed ? "✓" : index + 1}
                      </div>

                      <div className="pt-1">
                        <h3
                          className={`text-lg font-black ${
                            trackingEvent.completed
                              ? "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {trackingEvent.status}
                        </h3>

                        <p className="mt-1 text-slate-600">
                          {trackingEvent.location}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-400">
                          {trackingEvent.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}