import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  category: "forex" | "metal" | "index" | "crypto";
  url: string;
}

interface AssetConfig {
  symbol: string;
  name: string;
  category: "forex" | "metal" | "index" | "crypto";
  yfSymbol: string;
  binanceSymbol?: string;
  tradingViewSymbol: string;
  decimals: number;
  isDollar: boolean;
  fallbackPrice: string;
  fallbackChange: string;
  fallbackPositive: boolean;
}

const ASSETS: AssetConfig[] = [
  // Forex Majors
  {
    symbol: "EUR/USD",
    name: "Euro",
    category: "forex",
    yfSymbol: "EURUSD=X",
    tradingViewSymbol: "EURUSD",
    decimals: 4,
    isDollar: false,
    fallbackPrice: "1.0846",
    fallbackChange: "+0.18%",
    fallbackPositive: true,
  },
  {
    symbol: "GBP/USD",
    name: "British Pound",
    category: "forex",
    yfSymbol: "GBPUSD=X",
    tradingViewSymbol: "GBPUSD",
    decimals: 4,
    isDollar: false,
    fallbackPrice: "1.2965",
    fallbackChange: "-0.12%",
    fallbackPositive: false,
  },
  {
    symbol: "USD/JPY",
    name: "Japanese Yen",
    category: "forex",
    yfSymbol: "USDJPY=X",
    tradingViewSymbol: "USDJPY",
    decimals: 2,
    isDollar: false,
    fallbackPrice: "154.32",
    fallbackChange: "+0.24%",
    fallbackPositive: true,
  },
  {
    symbol: "USD/CAD",
    name: "Canadian Dollar",
    category: "forex",
    yfSymbol: "USDCAD=X",
    tradingViewSymbol: "USDCAD",
    decimals: 4,
    isDollar: false,
    fallbackPrice: "1.3820",
    fallbackChange: "+0.08%",
    fallbackPositive: true,
  },
  {
    symbol: "AUD/USD",
    name: "Australian Dollar",
    category: "forex",
    yfSymbol: "AUDUSD=X",
    tradingViewSymbol: "AUDUSD",
    decimals: 4,
    isDollar: false,
    fallbackPrice: "0.6654",
    fallbackChange: "-0.22%",
    fallbackPositive: false,
  },
  {
    symbol: "USD/CHF",
    name: "Swiss Franc",
    category: "forex",
    yfSymbol: "USDCHF=X",
    tradingViewSymbol: "USDCHF",
    decimals: 4,
    isDollar: false,
    fallbackPrice: "0.8650",
    fallbackChange: "-0.05%",
    fallbackPositive: false,
  },

  // Precious Metals
  {
    symbol: "XAU/USD",
    name: "Gold Spot",
    category: "metal",
    yfSymbol: "GC=F",
    binanceSymbol: "PAXGUSDT",
    tradingViewSymbol: "XAUUSD",
    decimals: 2,
    isDollar: true,
    fallbackPrice: "$2,735.80",
    fallbackChange: "+0.65%",
    fallbackPositive: true,
  },
  {
    symbol: "XAG/USD",
    name: "Silver Spot",
    category: "metal",
    yfSymbol: "SI=F",
    tradingViewSymbol: "XAGUSD",
    decimals: 2,
    isDollar: true,
    fallbackPrice: "$33.75",
    fallbackChange: "+0.45%",
    fallbackPositive: true,
  },

  // Major Indices
  {
    symbol: "S&P 500",
    name: "US 500",
    category: "index",
    yfSymbol: "^GSPC",
    tradingViewSymbol: "SPX",
    decimals: 2,
    isDollar: false,
    fallbackPrice: "5,864.67",
    fallbackChange: "+0.41%",
    fallbackPositive: true,
  },
  {
    symbol: "NASDAQ",
    name: "US Tech 100",
    category: "index",
    yfSymbol: "^IXIC",
    tradingViewSymbol: "NDX",
    decimals: 2,
    isDollar: false,
    fallbackPrice: "18,518.60",
    fallbackChange: "+0.63%",
    fallbackPositive: true,
  },

  // Major Cryptocurrencies
  {
    symbol: "BTC/USD",
    name: "Bitcoin",
    category: "crypto",
    yfSymbol: "BTC-USD",
    binanceSymbol: "BTCUSDT",
    tradingViewSymbol: "BTCUSD",
    decimals: 2,
    isDollar: true,
    fallbackPrice: "$68,420.00",
    fallbackChange: "+1.85%",
    fallbackPositive: true,
  },
  {
    symbol: "ETH/USD",
    name: "Ethereum",
    category: "crypto",
    yfSymbol: "ETH-USD",
    binanceSymbol: "ETHUSDT",
    tradingViewSymbol: "ETHUSD",
    decimals: 2,
    isDollar: true,
    fallbackPrice: "$2,645.50",
    fallbackChange: "-0.45%",
    fallbackPositive: false,
  },
  {
    symbol: "SOL/USD",
    name: "Solana",
    category: "crypto",
    yfSymbol: "SOL-USD",
    binanceSymbol: "SOLUSDT",
    tradingViewSymbol: "SOLUSD",
    decimals: 2,
    isDollar: true,
    fallbackPrice: "$175.20",
    fallbackChange: "+3.12%",
    fallbackPositive: true,
  },
];

// In-memory cache to guarantee sub-millisecond responses and eliminate external rate-limits
let memoryCache: { data: MarketItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 10_000; // 10 seconds server cache

function formatPrice(val: number, decimals: number, isDollar: boolean): string {
  const formatted = val.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return isDollar ? `$${formatted}` : formatted;
}

function formatChange(percent: number): { change: string; isPositive: boolean } {
  const isPos = percent >= 0;
  const changeStr = `${isPos ? "+" : ""}${percent.toFixed(2)}%`;
  return { change: changeStr, isPositive: isPos };
}

async function fetchFromYahoo(asset: AssetConfig): Promise<MarketItem | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      asset.yfSymbol
    )}?interval=1d&range=1d`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 10 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta || typeof meta.regularMarketPrice !== "number") return null;

    const currentPrice = meta.regularMarketPrice;
    const prevClose =
      typeof meta.chartPreviousClose === "number" && meta.chartPreviousClose > 0
        ? meta.chartPreviousClose
        : currentPrice;

    const pct = ((currentPrice - prevClose) / prevClose) * 100;
    const { change, isPositive } = formatChange(pct);

    return {
      symbol: asset.symbol,
      name: asset.name,
      price: formatPrice(currentPrice, asset.decimals, asset.isDollar),
      change,
      isPositive,
      category: asset.category,
      url: `https://www.tradingview.com/symbols/${asset.tradingViewSymbol}/`,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchBinanceFallback(
  missingAssets: AssetConfig[]
): Promise<Map<string, MarketItem>> {
  const result = new Map<string, MarketItem>();
  const binanceItems = missingAssets.filter((a) => a.binanceSymbol);
  if (binanceItems.length === 0) return result;

  try {
    const symbolsParam = JSON.stringify(binanceItems.map((a) => a.binanceSymbol));
    const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(
      symbolsParam
    )}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return result;
    const data = await res.json();

    if (Array.isArray(data)) {
      for (const item of data) {
        const asset = binanceItems.find((a) => a.binanceSymbol === item.symbol);
        if (!asset) continue;

        const priceNum = parseFloat(item.lastPrice) || 0;
        const changeNum = parseFloat(item.priceChangePercent) || 0;
        const { change, isPositive } = formatChange(changeNum);

        result.set(asset.symbol, {
          symbol: asset.symbol,
          name: asset.name,
          price: formatPrice(priceNum, asset.decimals, asset.isDollar),
          change,
          isPositive,
          category: asset.category,
          url: `https://www.tradingview.com/symbols/${asset.tradingViewSymbol}/`,
        });
      }
    }
  } catch {
    // Ignore fallback errors
  }

  return result;
}

export async function GET() {
  const now = Date.now();

  // Return fresh memory-cached data if within TTL
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(
      { ok: true, data: memoryCache.data, cached: true },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
        },
      }
    );
  }

  try {
    // 1. Fetch all assets in parallel from Yahoo Finance
    const fetchPromises = ASSETS.map((asset) => fetchFromYahoo(asset));
    const settled = await Promise.allSettled(fetchPromises);

    const missingAssets: AssetConfig[] = [];
    const resolvedItems: MarketItem[] = [];

    settled.forEach((res, idx) => {
      if (res.status === "fulfilled" && res.value !== null) {
        resolvedItems.push(res.value);
      } else {
        missingAssets.push(ASSETS[idx]);
      }
    });

    // 2. If any crypto/gold assets missed Yahoo, attempt Binance fallback
    let binanceMap = new Map<string, MarketItem>();
    if (missingAssets.length > 0) {
      binanceMap = await fetchBinanceFallback(missingAssets);
    }

    // 3. Assemble final list in guaranteed stable order
    const finalData: MarketItem[] = ASSETS.map((asset) => {
      const fromYahoo = resolvedItems.find((r) => r.symbol === asset.symbol);
      if (fromYahoo) return fromYahoo;

      const fromBinance = binanceMap.get(asset.symbol);
      if (fromBinance) return fromBinance;

      // Previous cache if available
      const fromPreviousCache = memoryCache?.data.find((c) => c.symbol === asset.symbol);
      if (fromPreviousCache) return fromPreviousCache;

      // Safe default baseline
      return {
        symbol: asset.symbol,
        name: asset.name,
        price: asset.fallbackPrice,
        change: asset.fallbackChange,
        isPositive: asset.fallbackPositive,
        category: asset.category,
        url: `https://www.tradingview.com/symbols/${asset.tradingViewSymbol}/`,
      };
    });

    // Update memory cache
    memoryCache = {
      data: finalData,
      timestamp: now,
    };

    return NextResponse.json(
      { ok: true, data: finalData, cached: false },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
        },
      }
    );
  } catch {
    // If complete server network failure, return previous cache or fallback baseline
    const fallbackList: MarketItem[] = memoryCache?.data || ASSETS.map((asset) => ({
      symbol: asset.symbol,
      name: asset.name,
      price: asset.fallbackPrice,
      change: asset.fallbackChange,
      isPositive: asset.fallbackPositive,
      category: asset.category,
      url: `https://www.tradingview.com/symbols/${asset.tradingViewSymbol}/`,
    }));

    return NextResponse.json(
      { ok: true, data: fallbackList, fallback: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

