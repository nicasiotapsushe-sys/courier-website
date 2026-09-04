"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function ScanParcelPage() {
  const router = useRouter();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [message, setMessage] = useState(
    "Point the camera at a shipment QR code."
  );

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        setMessage("QR code detected.");

        try {
          let trackingNumber = "";

          if (decodedText.includes("tracking=")) {
            const url = new URL(decodedText);
            trackingNumber =
              url.searchParams.get("tracking") || "";
          } else if (decodedText.startsWith("DIT-")) {
            trackingNumber = decodedText;
          }

          if (!trackingNumber) {
            setMessage(
              "This QR code is not a valid Drop It shipment."
            );
            return;
          }

          const response = await fetch(
            `/api/track/${encodeURIComponent(
              trackingNumber
            )}`
          );

          const result = await response.json();

          if (!response.ok || !result.shipment?.id) {
            setMessage("Shipment could not be found.");
            return;
          }

          await scanner.clear();

          router.push(
            `/admin/shipments/${result.shipment.id}`
          );
        } catch (error) {
          console.error("QR scan error:", error);
          setMessage("Could not process this QR code.");
        }
      },
      () => {
        // Ignore normal scan misses while camera is running.
      }
    );

    return () => {
      scanner
        .clear()
        .catch(() => {});
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
          Shipment Scanner
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Scan Parcel QR Code
        </h1>

        <p className="mt-4 text-slate-600">
          Scan a parcel label to open the shipment management page.
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div id="qr-reader" />

          <p className="mt-5 text-center font-semibold text-slate-600">
            {message}
          </p>
        </div>
      </div>
    </main>
  );
}