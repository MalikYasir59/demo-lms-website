import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import FloatingSupportButton from "@/components/layout/FloatingSupportButton";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Institute of Trading Tricks | Price Action & Market Structure Mastery",
  description:
    "Institutional-grade quantitative price action education, order flow telemetry, and prop firm funded trader coaching.",
  keywords: [
    "Forex Trading Academy",
    "Price Action Mastery",
    "Market Structure",
    "Prop Firm Passing",
    "Order Flow Analysis",
    "Smart Money Concepts",
  ],
  authors: [{ name: "Institute of Trading Tricks" }],
  openGraph: {
    title: "Institute of Trading Tricks | Institutional Trading Academy",
    description:
      "Learn institutional order flow, algorithmic market structure, and disciplined risk management.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="bg-brand-surface font-sans text-slate-900 antialiased selection:bg-brand-emerald selection:text-white flex flex-col min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <main className="pt-[113px] flex-1 flex flex-col">{children}</main>
        <Footer />
        <FloatingSupportButton />
      </body>
    </html>
  );
}

