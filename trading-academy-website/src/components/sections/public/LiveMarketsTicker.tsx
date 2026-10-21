"use client";

import React, { useEffect, useState } from "react";

interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  category: "forex" | "metal" | "crypto";
}

const DEFAULT_MARKET_DATA: MarketItem[] = [
  { symbol: "EUR/USD", name: "Euro", price: "1.0846", change: "+0.18%", isPositive: true, category: "forex" },
  { symbol: "GBP/USD", name: "British Pound", price: "1.2965", change: "-0.12%", isPositive: false, category: "forex" },
  { symbol: "USD/JPY", name: "Japanese Yen", price: "154.32", change: "+0.24%", isPositive: true, category: "forex" },
  { symbol: "XAU/USD", name: "Gold Spot", price: "$2,735.80", change: "+0.65%", isPositive: true, category: "metal" },
  { symbol: "BTC/USD", name: "Bitcoin", price: "$68,420.00", change: "+1.85%", isPositive: true, category: "crypto" },
  { symbol: "ETH/USD", name: "Ethereum", price: "$2,645.50", change: "-0.45%", isPositive: false, category: "crypto" },
  { symbol: "USD/CAD", name: "Canadian Dollar", price: "1.3820", change: "+0.08%", isPositive: true, category: "forex" },
  { symbol: "AUD/USD", name: "Australian Dollar", price: "0.6654", change: "-0.22%", isPositive: false, category: "forex" },
  { symbol: "USD/CHF", name: "Swiss Franc", price: "0.8650", change: "-0.05%", isPositive: false, category: "forex" },
];

export default function LiveMarketsTicker() {
  const [markets, setMarkets] = useState<MarketItem[]>(DEFAULT_MARKET_DATA);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Streaming");

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveRates() {
      try {
        // 1. Fetch live crypto & gold token prices from free public Binance endpoint
        const binancePromise = fetch(
          'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","PAXGUSDT","EURUSDT","GBPUSDT"]'
        )
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null);

        // 2. Fetch live fiat forex rates from free Open Exchange Rates endpoint
        const forexPromise = fetch("https://open.er-api.com/v6/latest/USD")
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null);

        const [binanceData, forexData] = await Promise.all([binancePromise, forexPromise]);

        if (!isMounted) return;

        const updated: MarketItem[] = [...DEFAULT_MARKET_DATA];

        // Process Binance prices
        if (Array.isArray(binanceData)) {
          binanceData.forEach((item: { symbol: string; lastPrice: string; priceChangePercent: string }) => {
            const chgNum = parseFloat(item.priceChangePercent) || 0;
            const isPos = chgNum >= 0;
            const chgStr = `${isPos ? "+" : ""}${chgNum.toFixed(2)}%`;
            const priceNum = parseFloat(item.lastPrice) || 0;

            if (item.symbol === "BTCUSDT") {
              const btcIdx = updated.findIndex((m) => m.symbol === "BTC/USD");
              if (btcIdx !== -1) {
                updated[btcIdx] = {
                  ...updated[btcIdx],
                  price: `$${priceNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  change: chgStr,
                  isPositive: isPos,
                };
              }
            } else if (item.symbol === "ETHUSDT") {
              const ethIdx = updated.findIndex((m) => m.symbol === "ETH/USD");
              if (ethIdx !== -1) {
                updated[ethIdx] = {
                  ...updated[ethIdx],
                  price: `$${priceNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  change: chgStr,
                  isPositive: isPos,
                };
              }
            } else if (item.symbol === "PAXGUSDT") {
              // PAXG tracks 1 troy oz of physical gold
              const goldIdx = updated.findIndex((m) => m.symbol === "XAU/USD");
              if (goldIdx !== -1) {
                updated[goldIdx] = {
                  ...updated[goldIdx],
                  price: `$${priceNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  change: chgStr,
                  isPositive: isPos,
                };
              }
            } else if (item.symbol === "EURUSDT") {
              const eurIdx = updated.findIndex((m) => m.symbol === "EUR/USD");
              if (eurIdx !== -1) {
                updated[eurIdx] = {
                  ...updated[eurIdx],
                  price: priceNum.toFixed(4),
                  change: chgStr,
                  isPositive: isPos,
                };
              }
            } else if (item.symbol === "GBPUSDT") {
              const gbpIdx = updated.findIndex((m) => m.symbol === "GBP/USD");
              if (gbpIdx !== -1) {
                updated[gbpIdx] = {
                  ...updated[gbpIdx],
                  price: priceNum.toFixed(4),
                  change: chgStr,
                  isPositive: isPos,
                };
              }
            }
          });
        }

        // Process Forex Rates from Open ER API
        if (forexData && forexData.rates) {
          const rates = forexData.rates;
          if (rates.JPY) {
            const jpyIdx = updated.findIndex((m) => m.symbol === "USD/JPY");
            if (jpyIdx !== -1) {
              updated[jpyIdx] = {
                ...updated[jpyIdx],
                price: parseFloat(rates.JPY).toFixed(2),
              };
            }
          }
          if (rates.CAD) {
            const cadIdx = updated.findIndex((m) => m.symbol === "USD/CAD");
            if (cadIdx !== -1) {
              updated[cadIdx] = {
                ...updated[cadIdx],
                price: parseFloat(rates.CAD).toFixed(4),
              };
            }
          }
          if (rates.CHF) {
            const chfIdx = updated.findIndex((m) => m.symbol === "USD/CHF");
            if (chfIdx !== -1) {
              updated[chfIdx] = {
                ...updated[chfIdx],
                price: parseFloat(rates.CHF).toFixed(4),
              };
            }
          }
          if (rates.AUD) {
            const audIdx = updated.findIndex((m) => m.symbol === "AUD/USD");
            if (audIdx !== -1) {
              // 1 USD = x AUD -> AUD/USD = 1/x
              const audUsd = 1 / parseFloat(rates.AUD);
              updated[audIdx] = {
                ...updated[audIdx],
                price: audUsd.toFixed(4),
              };
            }
          }
        }

        setMarkets(updated);
        setIsLive(true);
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      } catch {
        // Fallback silently kept
      }
    }

    fetchLiveRates();
    const interval = setInterval(fetchLiveRates, 25000); // Poll every 25 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Duplicate items twice to achieve seamless infinite loop
  const tickerItems = [...markets, ...markets];

  return (
    <div className="bg-[#030611] border-b border-white/10 relative overflow-hidden select-none py-2.5">
      <div className="flex items-center">
        {/* Fixed Left Indicator Badge */}
        <div className="shrink-0 z-10 px-4 sm:px-6 bg-[#030611] border-r border-white/10 flex items-center gap-2.5 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLive ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLive ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </span>
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white">
            MARKETS
          </span>
          <span className="hidden md:inline-block text-[9px] tracking-wider text-slate-500 font-mono">
            {isLive ? `LIVE ${lastUpdated}` : "CONNECTING..."}
          </span>
        </div>

        {/* Infinite Sliding Marquee Track */}
        <div className="overflow-hidden flex-1 relative">
          <div className="ticker-slider-track flex items-center">
            {tickerItems.map((item, idx) => (
              <div
                key={`${item.symbol}-${idx}`}
                className="flex items-center gap-2.5 px-6 shrink-0 text-[11px] font-mono tracking-wider transition-opacity hover:opacity-80"
              >
                {/* Category Icon / Indicator */}
                <span className="text-[9px] uppercase tracking-wider text-[#D4C385] font-sans font-medium">
                  {item.symbol}
                </span>

                {/* Price */}
                <span className="text-white font-medium">{item.price}</span>

                {/* 24h Change Badge */}
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded ${
                    item.isPositive
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-rose-400 bg-rose-500/10"
                  }`}
                >
                  {item.change}
                </span>

                {/* Divider dot */}
                <span className="text-white/15 ml-3 font-sans">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
