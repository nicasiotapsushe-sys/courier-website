"use client";

import { useState } from "react";

type Props = {
  invoiceId: number;
  token: string;
};

export default function CopyCustomerInvoiceLink({
  invoiceId,
  token,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const link = `${window.location.origin}/invoice/${invoiceId}?token=${token}`;

    try {
      await navigator.clipboard.writeText(link);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Could not copy customer invoice link:",
        error
      );
    }
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="rounded-xl bg-slate-700 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
    >
      {copied ? "✓ Link Copied" : "Copy Customer Link"}
    </button>
  );
}