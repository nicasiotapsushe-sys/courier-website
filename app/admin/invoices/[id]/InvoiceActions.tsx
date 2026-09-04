"use client";

export default function InvoiceActions() {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <button
        type="button"
        onClick={handlePrint}
        className="rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
      >
        Print / Save PDF
      </button>
    </div>
  );
}