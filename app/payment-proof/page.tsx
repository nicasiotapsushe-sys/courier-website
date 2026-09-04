import { Suspense } from "react";
import PaymentProofForm from "./PaymentProofForm";

export default function PaymentProofPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="font-semibold text-slate-600">
                Loading payment form...
              </p>
            </div>
          </div>
        </main>
      }
    >
      <PaymentProofForm />
    </Suspense>
  );
}