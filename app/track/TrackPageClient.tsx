"use client";
import { FormEvent, useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";


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
  deliveredAt: string | null;
receivedBy: string | null;
  events: TrackingEvent[];
  id: number;
senderEmail: string | null;
senderPhone: string | null;
};




export default function  TrackPageClient() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [searched, setSearched] = useState(false);
  const [invoiceRequestMessage, setInvoiceRequestMessage] =
  useState("");

const [isRequestingInvoice, setIsRequestingInvoice] =
  useState(false);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const tracking = searchParams.get("tracking");

    if (tracking) {
      setTrackingNumber(tracking.toUpperCase());
    }
  }, [searchParams]);

async function handleTracking(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const cleanedNumber =
    trackingNumber.trim().toUpperCase();

  if (!cleanedNumber) return;

  setSearched(false);
  setShipment(null);
  setInvoiceRequestMessage("");

  try {
    const response = await fetch(
      `/api/track/${encodeURIComponent(cleanedNumber)}`
    );

    const result = await response.json();

    if (!response.ok || !result.shipment) {
      setShipment(null);
      setSearched(true);
      return;
    }

    const data = result.shipment;

    const shipmentData: Shipment = {
      id: data.id,
      trackingNumber: data.tracking_number,
      senderEmail: data.sender_email || null,
      senderPhone: data.sender_phone || null,

      status: data.current_status,
      sender: data.sender_name,
      recipient: data.recipient_name,
      origin: data.origin,
      destination: data.destination,
      currentLocation: data.current_location,
      service: data.service,

      weight: data.weight
        ? `${data.weight} kg`
        : "Not provided",

      estimatedDelivery: data.estimated_delivery
        ? new Date(
            `${data.estimated_delivery}T00:00:00`
          ).toLocaleDateString()
        : "Not available",

      deliveredAt: data.delivered_at || null,
      receivedBy: data.received_by || null,

      events: (() => {
        const rawEvents =
          data.tracking_events &&
          data.tracking_events.length > 0
            ? data.tracking_events.map(
                (event: {
                  status: string;
                  location: string;
                  description: string | null;
                  event_time: string;
                }) => ({
                  status: event.status,
                  location: event.location,
                  date: new Date(
                    event.event_time
                  ).toLocaleString(),
                  completed: true,
                  eventTime: new Date(
                    event.event_time
                  ).getTime(),
                })
              )
            : [
                {
                  status: "Shipment Created",
                  location: data.origin,
                  date: new Date(
                    data.created_at
                  ).toLocaleString(),
                  completed: true,
                  eventTime: new Date(
                    data.created_at
                  ).getTime(),
                },
              ];

        const eventMap = new Map<
          string,
          {
            status: string;
            location: string;
            date: string;
            completed: boolean;
            eventTime: number;
          }
        >();

        rawEvents.forEach(
          (event: {
            status: string;
            location: string;
            date: string;
            completed: boolean;
            eventTime: number;
          }) => {
            const existing =
              eventMap.get(event.status);

            if (
              !existing ||
              event.eventTime > existing.eventTime
            ) {
              eventMap.set(
                event.status,
                event
              );
            }
          }
        );

        const stageOrder = [
          "Shipment Created",
          "Collected",
          "In Transit",
          "Out for Delivery",
          "Delivered",
        ];

        const cleanEvents = stageOrder
          .filter((status) =>
            eventMap.has(status)
          )
          .map(
            (status) =>
              eventMap.get(status)!
          );

        const completedStatuses =
  new Set(
    cleanEvents.map(
      (event) => event.status
    )
  );

const highestCompletedStageIndex =
  cleanEvents.reduce((highest, event) => {
    const index = stageOrder.indexOf(
      event.status
    );

    return index > highest
      ? index
      : highest;
  }, 0);

const remainingStages =
  stageOrder
    .filter((status, index) => {
      return (
        index > highestCompletedStageIndex &&
        !completedStatuses.has(status)
      );
    })
    .map((status) => ({
      status,
      location:
        status === "Delivered"
          ? data.destination
          : data.current_location ||
            data.origin,
      date: "Pending",
      completed: false,
      eventTime: 0,
    }));

return [
  ...cleanEvents,
  ...remainingStages,
];
      })(),
    };

    setShipment(shipmentData);
    setSearched(true);
  } catch (error) {
    console.error(
      "Tracking error:",
      error
    );

    setShipment(null);
    setSearched(true);
  }
}

async function handleRequestInvoice() {
  if (!shipment) return;

  try {
    setIsRequestingInvoice(true);
    setInvoiceRequestMessage("");

    const response = await fetch(
      "/api/invoice-requests",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          shipmentId: shipment.id,
          customerName:
            shipment.sender,
          customerEmail:
            shipment.senderEmail || "",
          customerPhone:
            shipment.senderPhone || "",
        }),
      }
    );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {
      setInvoiceRequestMessage(
        result.error ||
          "Could not request invoice."
      );
      return;
    }

    setInvoiceRequestMessage(
      "Invoice request submitted successfully."
    );
  } catch (error) {
    console.error(
      "Invoice request error:",
      error
    );

    setInvoiceRequestMessage(
      "Something went wrong while requesting the invoice."
    );
  } finally {
    setIsRequestingInvoice(false);
  }
}

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
     

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
                  placeholder="Example: DIT-2026-483721"
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
{shipment.status === "Delivered" && (
  <section className="rounded-3xl border border-green-200 bg-green-50 p-8 shadow-sm">
    <p className="text-sm font-bold uppercase tracking-widest text-green-700">
      Delivery Confirmation
    </p>

    <h2 className="mt-3 text-3xl font-black text-green-950">
      ✓ Parcel delivered successfully
    </h2>

    <p className="mt-3 text-green-800">
      This shipment has been successfully delivered to the recipient.
    </p>

    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl bg-white p-5">
        <p className="text-sm font-bold text-green-700">
          Received by
        </p>

        <p className="mt-2 text-lg font-black text-green-950">
          {shipment.receivedBy || "Recipient"}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5">
        <p className="text-sm font-bold text-green-700">
          Delivered on
        </p>

        <p className="mt-2 text-lg font-black text-green-950">
          {shipment.deliveredAt
            ? new Date(shipment.deliveredAt).toLocaleString()
            : "Delivery completed"}
        </p>
      </div>
    </div>
  </section>
)}

<section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
  <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
    Billing
  </p>

  <h2 className="mt-2 text-2xl font-black text-slate-950">
    Need an invoice?
  </h2>

  <p className="mt-3 text-slate-600">
    Request an invoice for this shipment.
  </p>

  <button
    type="button"
    onClick={handleRequestInvoice}
    disabled={isRequestingInvoice}
    className="mt-5 rounded-xl bg-orange-500 px-6 py-3 font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {isRequestingInvoice
      ? "Submitting Request..."
      : "Request Invoice"}
  </button>

  {invoiceRequestMessage && (
    <p className="mt-4 font-semibold text-slate-700">
      {invoiceRequestMessage}
    </p>
  )}
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