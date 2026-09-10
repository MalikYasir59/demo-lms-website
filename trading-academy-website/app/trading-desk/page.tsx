import type { Metadata } from "next";
import HomePage from "../page";

export const metadata: Metadata = {
  title: "Trading Desk & Live Floor | Institute of Trading Tricks",
  description:
    "Institutional Trading Desk, live order flow telemetry, and prop firm execution floor at Institute of Trading Tricks.",
};

export default function TradingDeskPage() {
  return <HomePage />;
}

