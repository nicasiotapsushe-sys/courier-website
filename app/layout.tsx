import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: {
    default: "Swift Courier Services",
    template: "%s | Swift Courier Services",
  },
  description:
    "Fast, secure and reliable courier and logistics services across Botswana and beyond.",
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