import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Institute of Trading Tricks | Quantitative Price Action & Order Flow Mastery",
  description:
    "Institutional-grade quantitative price action education, order flow telemetry, and prop firm funded trader coaching. Built for quantitative execution.",
  keywords: [
    "Forex Trading Academy",
    "Price Action Mastery",
    "Market Structure",
    "Prop Firm Passing",
    "Order Flow Analysis",
    "Smart Money Concepts",
    "Institutional Trading",
  ],
  authors: [{ name: "Institute of Trading Tricks" }],
  openGraph: {
    title: "Institute of Trading Tricks | Institutional Trading Terminal",
    description:
      "Learn institutional order flow, algorithmic market structure, and disciplined risk management.",
    type: "website",
  },
};

import Providers from "@/components/shared/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080b11] font-sans text-[#e0e2eb] antialiased selection:bg-[#10b981] selection:text-black flex flex-col min-h-screen relative">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
