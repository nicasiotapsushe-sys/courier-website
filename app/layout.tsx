import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "Drop It Courier Services",
    template: "%s | Drop It Courier Services",
  },
  description:
    "Reliable courier, logistics, medical, warehousing and cross-border delivery services across Botswana and Southern Africa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}