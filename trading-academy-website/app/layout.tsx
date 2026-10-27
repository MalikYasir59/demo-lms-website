import type { Metadata } from "next";
import "./globals.css";

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/images/Logoitt.jpg", type: "image/jpeg" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

import Providers from "@/components/shared/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-jakarta: 'Plus Jakarta Sans', sans-serif;
              --font-jetbrains: 'JetBrains Mono', monospace;
            }
          `
        }} />
      </head>
      <body className="bg-background font-sans text-foreground antialiased flex flex-col min-h-screen relative">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
