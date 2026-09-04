"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  paymentProofId: number;
  currentStatus: string;
};

export default function PaymentProofActions({
  paymentProofId,
  currentStatus,
}: Props) {
  const router = useRouter();

  const [adminNote, setAdminNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function updateStatus(
    status: "Verified" | "Rejected"
  ) {
    try {
      setIsSaving(true);
      setMessage("");

      const response = await fetch(
        `/api/payment-proofs/${paymentProofId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            adminNote,
          }),
        }
      );

      const responseText = await response.text();

      let result: {
        success?: boolean;
        message?: string;
        error?: string;
      } = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          setMessage(
            "The server returned an invalid response."
          );
          return;
        }
      }

      if (!response.ok || !result.success) {
        setMessage(
          result.error ||
            "Could not update payment status."
        );
        return;
      }

      setMessage(
        result.message ||
          "Payment status updated successfully."
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Payment verification error:",
        error
      );

      setMessage(
        "Something went wrong while updating the payment."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-xl font-black">
        Payment Verification
      </h2>

      <p className="mt-2 text-slate-600">
        Review the submitted POP before approving or rejecting
        the payment.
      </p>

      <div className="mt-6">
        <label
          htmlFor="admin-note"
          className="text-sm font-black text-slate-700"
        >
          Admin Note
        </label>

        <textarea
          id="admin-note"
          value={adminNote}
          onChange={(event) =>
            setAdminNote(event.target.value)
          }
          rows={4}
          placeholder="Optional verification note..."
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
        />
      </div>

      {message && (
        <div className="mt-5 rounded-xl bg-slate-100 p-4 font-semibold text-slate-700">
          {message}
        </div>
      )}

      {currentStatus === "Pending" ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => updateStatus("Verified")}
            className="flex-1 rounded-xl bg-green-600 px-6 py-4 font-black text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? "Processing..."
              : "Verify Payment"}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => updateStatus("Rejected")}
            className="flex-1 rounded-xl bg-red-600 px-6 py-4 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? "Processing..."
              : "Reject Payment"}
          </button>
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-slate-100 p-4 font-bold text-slate-700">
          This payment proof has already been{" "}
          {currentStatus.toLowerCase()}.
        </div>
      )}
    </section>
  );
}