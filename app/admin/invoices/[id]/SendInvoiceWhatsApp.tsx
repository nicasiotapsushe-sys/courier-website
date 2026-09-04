"use client";

type Props = {
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string | null;
  grandTotal: number;
  balanceDue: number;
  invoiceId: number;
  token: string;
};

export default function SendInvoiceWhatsApp({
  invoiceNumber,
  customerName,
  customerPhone,
  grandTotal,
  balanceDue,
  invoiceId,
  token,
}: Props) {
  function sendWhatsApp() {
    const invoiceLink =
      `${window.location.origin}/invoice/${invoiceId}?token=${token}`;

    const message = `Hello ${customerName},

Your Drop It Courier Services invoice ${invoiceNumber} is ready.

Total: P${Number(grandTotal).toFixed(2)}
Balance Due: P${Number(balanceDue).toFixed(2)}

View your secure invoice:
${invoiceLink}

Thank you for choosing Drop It Courier Services.`;

   let phone = customerPhone
  ? customerPhone.replace(/\D/g, "")
  : "";

if (phone.startsWith("00")) {
  phone = phone.substring(2);
}

if (phone.startsWith("0")) {
  phone = phone.substring(1);
}

if (phone && !phone.startsWith("267")) {
  phone = `267${phone}`;
}

    const whatsappUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
  <button
    type="button"
    onClick={sendWhatsApp}
    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
  >
    <img
      src="/images/whatsapp.png"
      alt=""
      className="h-5 w-5 object-contain"
    />

    <span>Send via WhatsApp</span>
  </button>
);
}