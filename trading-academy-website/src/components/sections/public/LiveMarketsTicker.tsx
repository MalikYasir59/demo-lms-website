"use client";

import React, { useEffect, useState } from "react";

export interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  category: "forex" | "metal" | "index" | "crypto";
  url: string;
}

const DEFAULT_MARKET_DATA: MarketItem[] = [
  // Forex Majors
  {
    symbol: "EUR/USD",
    name: "Euro",
    price: "1.0846",
    change: "+0.18%",
    isPositive: true,
    category: "forex",
    url: "https://www.tradingview.com/symbols/EURUSD/",
  },
  {
    symbol: "GBP/USD",
    name: "British Pound",
    price: "1.2965",
    change: "-0.12%",
    isPositive: false,
    category: "forex",
    url: "https://www.tradingview.com/symbols/GBPUSD/",
  },
  {
    symbol: "USD/JPY",
    name: "Japanese Yen",
    price: "154.32",
    change: "+0.24%",
    isPositive: true,
    category: "forex",
    url: "https://www.tradingview.com/symbols/USDJPY/",
  },
  {
    symbol: "USD/CAD",
    name: "Canadian Dollar",
    price: "1.3820",
    change: "+0.08%",
    isPositive: true,
    category: "forex",
    url: "https://www.tradingview.com/symbols/USDCAD/",
  },
  {
    symbol: "AUD/USD",
    name: "Australian Dollar",
    price: "0.6654",
    change: "-0.22%",
    isPositive: false,
    category: "forex",
    url: "https://www.tradingview.com/symbols/AUDUSD/",
  },
  {
    symbol: "USD/CHF",
    name: "Swiss Franc",
    price: "0.8650",
    change: "-0.05%",
    isPositive: false,
    category: "forex",
    url: "https://www.tradingview.com/symbols/USDCHF/",
  },

  // Precious Metals
  {
    symbol: "XAU/USD",
    name: "Gold Spot",
    price: "$2,735.80",
    change: "+0.65%",
    isPositive: true,
    category: "metal",
    url: "https://www.tradingview.com/symbols/XAUUSD/",
  },
  {
    symbol: "XAG/USD",
    name: "Silver Spot",
    price: "$33.75",
    change: "+0.45%",
    isPositive: true,
    category: "metal",
    url: "https://www.tradingview.com/symbols/XAGUSD/",
  },

  // Major Indices
  {
    symbol: "S&P 500",
    name: "US 500",
    price: "5,864.67",
    change: "+0.41%",
    isPositive: true,
    category: "index",
    url: "https://www.tradingview.com/symbols/SPX/",
  },
  {
    symbol: "NASDAQ",
    name: "US Tech 100",
    price: "18,518.60",
    change: "+0.63%",
    isPositive: true,
    category: "index",
    url: "https://www.tradingview.com/symbols/NDX/",
  },

  // Major Cryptocurrencies
  {
    symbol: "BTC/USD",
    name: "Bitcoin",
    price: "$68,420.00",
    change: "+1.85%",
    isPositive: true,
    category: "crypto",
    url: "https://www.tradingview.com/symbols/BTCUSD/",
  },
  {
    symbol: "ETH/USD",
    name: "Ethereum",
    price: "$2,645.50",
    change: "-0.45%",
    isPositive: false,
    category: "crypto",
    url: "https://www.tradingview.com/symbols/ETHUSD/",
  },
  {
    symbol: "SOL/USD",
    name: "Solana",
    price: "$175.20",
    change: "+3.12%",
    isPositive: true,
    category: "crypto",
    url: "https://www.tradingview.com/symbols/SOLUSD/",
  },
];

export default function LiveMarketsTicker() {
  const [markets, setMarkets] = useState<MarketItem[]>(DEFAULT_MARKET_DATA);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Streaming");

  useEffect(() => {
    let isMounted = true;

    async function fetchLiveMarkets() {
      try {
        // 1. Fetch live multi-asset rates from server endpoint
        const res = await fetch("/api/public/markets", {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
            if (!isMounted) return;
            setMarkets(json.data);
            setIsLive(true);
            const now = new Date();
            setLastUpdated(
              now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            );
            return;
          }
        }

        // 2. Client-side fallback to direct Binance if server route is unavailable
        const binanceRes = await fetch(
          'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","PAXGUSDT"]'
        )
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);

        if (Array.isArray(binanceRes) && isMounted) {
          setMarkets((prev) => {
            const next = [...prev];
            binanceRes.forEach(
              (item: { symbol: string; lastPrice: string; priceChangePercent: string }) => {
                const chg = parseFloat(item.priceChangePercent) || 0;
                const isPos = chg >= 0;
                const chgStr = `${isPos ? "+" : ""}${chg.toFixed(2)}%`;
                const price = parseFloat(item.lastPrice) || 0;
                const priceStr = `$${price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;

                let targetSymbol = "";
                if (item.symbol === "BTCUSDT") targetSymbol = "BTC/USD";
                else if (item.symbol === "ETHUSDT") targetSymbol = "ETH/USD";
                else if (item.symbol === "SOLUSDT") targetSymbol = "SOL/USD";
                else if (item.symbol === "PAXGUSDT") targetSymbol = "XAU/USD";

                const idx = next.findIndex((m) => m.symbol === targetSymbol);
                if (idx !== -1) {
                  next[idx] = {
                    ...next[idx],
                    price: priceStr,
                    change: chgStr,
                    isPositive: isPos,
                  };
                }
              }
            );
            return next;
          });
          setIsLive(true);
          const now = new Date();
          setLastUpdated(
            now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          );
        }
      } catch {
        // Retain fallback data gracefully
      }
    }

    fetchLiveMarkets();
    const interval = setInterval(fetchLiveMarkets, 15000); // Poll every 15 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Duplicate items twice to achieve seamless infinite marquee loop
  const tickerItems = [...markets, ...markets];

  return (
    <div className="bg-[#030611] border-b border-white/10 relative overflow-hidden select-none py-2">
      <div className="flex items-center">
        {/* Fixed Left Indicator Badge - Clickable to open TradingView Markets */}
        <a
          href="https://www.tradingview.com/markets/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Global Live Markets on TradingView"
          className="shrink-0 z-10 px-4 sm:px-6 bg-[#030611] border-r border-white/10 flex items-center gap-2.5 shadow-lg group hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
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
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white group-hover:text-[#D4C385] transition-colors">
            MARKETS
          </span>
          <span className="hidden md:inline-block text-[9px] tracking-wider text-slate-400 font-mono">
            {isLive ? `LIVE ${lastUpdated}` : "CONNECTING..."}
          </span>
          <span className="text-[9px] text-slate-500 group-hover:text-[#D4C385] opacity-50 group-hover:opacity-100 transition-opacity">
            ↗
          </span>
        </a>

        {/* Infinite Sliding Marquee Track */}
        <div className="overflow-hidden flex-1 relative">
          <div className="ticker-slider-track flex items-center">
            {tickerItems.map((item, idx) => (
              <a
                key={`${item.symbol}-${idx}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open live ${item.name} (${item.symbol}) chart on TradingView`}
                className="group flex items-center gap-2.5 px-4 py-1.5 rounded-md shrink-0 text-[11px] font-mono tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
              >
                {/* Category Icon / Indicator */}
                <span className="text-[10px] uppercase tracking-wider text-[#D4C385] font-sans font-semibold group-hover:underline underline-offset-2">
                  {item.symbol}
                </span>

                {/* Subtitle / Asset Name on wider view */}
                <span className="hidden xl:inline text-[9px] text-slate-400 font-sans">
                  {item.name}
                </span>

                {/* Price */}
                <span className="text-white font-medium group-hover:text-amber-100 transition-colors">
                  {item.price}
                </span>

                {/* 24h Change Badge */}
                <span
                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                    item.isPositive
                      ? "text-emerald-400 bg-emerald-500/15"
                      : "text-rose-400 bg-rose-500/15"
                  }`}
                >
                  {item.change}
                </span>

                {/* Subtle external link icon on hover */}
                <span className="text-[9px] text-slate-500 group-hover:text-amber-300 opacity-30 group-hover:opacity-100 transition-opacity font-sans">
                  ↗
                </span>

                {/* Divider dot */}
                <span className="text-white/15 ml-3 font-sans select-none pointer-events-none">
                  ·
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
