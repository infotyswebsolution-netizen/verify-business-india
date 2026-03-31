import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VerifyIndia — Verified Gujarat Supplier Platform",
    template: "%s | VerifyIndia",
  },
  description:
    "Find physically audited, verified suppliers from Gujarat, India. Connect with trusted manufacturers in textiles, diamonds, metals, chemicals and more. Western-standard audit reports for international buyers.",
  keywords: [
    "verified suppliers India",
    "Gujarat manufacturers",
    "India B2B sourcing",
    "verified textile suppliers India",
    "diamond suppliers Surat",
    "industrial suppliers Gujarat",
    "India supplier audit",
    "Canada India trade",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "VerifyIndia",
    title: "VerifyIndia — Verified Gujarat Supplier Platform",
    description:
      "The trusted bridge between Western buyers and verified Gujarat manufacturers. Every supplier is physically audited.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VerifyIndia — Verified Gujarat Supplier Platform",
    description: "Find physically audited, verified suppliers from Gujarat, India.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
