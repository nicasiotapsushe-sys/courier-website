"use client";

import { useState } from "react";

type CustomerPortalActionsProps = {
  token: string;
  customerName: string;
  customerPhone: string;
  trackingNumber: string;
};

function normalizeBotswanaPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("267")) {
    return digits;
  }

  if (digits.length === 8) {
    return `267${digits}`;
  }

  return digits;
}

export default function CustomerPortalActions({
  token,
  customerName,
  customerPhone,
  trackingNumber,
}: CustomerPortalActionsProps) {
  const [copied, setCopied] = useState(false);

  function getPortalUrl() {
    return `${window.location.origin}/customer/${token}`;
  }

  async function copyPortalLink() {
    try {
      await navigator.clipboard.writeText(getPortalUrl());

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Could not copy customer portal link:",
        error
      );
    }
  }

  function sendWhatsApp() {
    const phone = normalizeBotswanaPhone(customerPhone);

    const message = `Hello ${customerName},

Your Drop It Courier Services customer portal is ready.

Tracking Number: ${trackingNumber}

You can use your secure portal to:
• Track your shipment
• View your quotation
• View your invoice
• Upload proof of payment

Customer Portal:
${getPortalUrl()}

Thank you for choosing Drop It Courier Services.`;

    const whatsappUrl =
      `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={copyPortalLink}
        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700 transition hover:bg-slate-100"
      >
        {copied ? "✓ Link Copied" : "Copy Portal Link"}
      </button>

      <button
        type="button"
        onClick={sendWhatsApp}
        className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-black text-white transition hover:bg-green-700"
      >
        Send via WhatsApp
      </button>
    </>
  );
}