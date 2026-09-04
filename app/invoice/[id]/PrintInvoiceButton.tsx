"use client";

export default function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-slate-950 px-6 py-3 font-black text-white transition hover:bg-slate-800 print:hidden"
    >
      Print / Save PDF
    </button>
  );
}