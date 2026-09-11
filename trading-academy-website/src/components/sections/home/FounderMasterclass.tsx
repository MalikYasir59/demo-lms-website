import React from "react";
import { Play } from "lucide-react";

export default function FounderMasterclass() {
  return (
    <section
      className="w-full bg-[#0c1018] py-16 border-t border-white/[0.08] relative overflow-hidden"
      id="founder-masterclass"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-luminosity bg-cover bg-center"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCU3ziKXuWSBRU21Qv7q2uUzjXam5xUdD9dXFskcQneej1DbJtWa82vABiGhp4-WylPh0_MbCCQvHY1D8MLYr-kzG9U8q1rVFZa9yUR4b_AhqwGlnkt0Tv6fHTwg6M6sBtvkuhr_262XuELqXlTFeRNnvUCX58mvwjdq600yPa0LP_If42kqDSZH0oYrfDtDVJGexI2C5s01ZDIqfRUMc1YqexwSqD3v64bzm7Cc0BhcPRdm003sUiL6-4mVM05FxRw3Q')`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#080B11] via-transparent to-[#080B11]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#0d6938]/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            Founder Masterclass
          </span>
          <h2 className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Inside Our System: How We Trade Institutional Liquidity
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            12:40 breakdown of real-time execution tape, order block sweeps, and London session killzones.
          </p>
        </div>

        <div className="group relative rounded-2xl overflow-hidden bg-[#121722] border border-white/10 hover:border-indigo-400/50 shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-all duration-300">
          <div className="flex items-center justify-between px-4 py-3 bg-[#080B11] border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-indigo-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-4 w-[1px] bg-white/10 mx-1" />
              <div className="flex items-center gap-2">
                <img
                  alt="Marcus Vance"
                  className="w-6 h-6 rounded-full object-cover border border-indigo-400/50"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WO1ZWpQZEvHpdscrUYnizozn3ncEOPADpD_xGXv7YvwfdwDK23IQFGxzZP7Hlz6pxOs8rJlAXpwSjxlNBZXQx4sBlCtJqoU4EhGKEByulwKH1v4Fg96fHi8AI_PppcuVp98qN6f-gL1SJoDYRjIL7IweOdInATL_-VP3V0wYm4HQ0oQ6GG4V8tkvzePsdMvu2vcTT7QLkywxXduPDS0eb_SHsIKGI5K5c25iE1H_OWeYidHAZeTR0vhSQ"
                />
                <span className="font-mono text-xs text-slate-300 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-red-600 text-[10px] text-white font-bold tracking-wider">
                    YouTube
                  </span>
                  <span className="font-semibold text-white">Marcus Vance</span> • Institutional Liquidity Tape (12:40)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                4K Ultra-HD
              </span>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer">
            <img
              alt="Marcus Vance - Masterclass Breakdown"
              className="w-full h-full object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WO1ZWpQZEvHpdscrUYnizozn3ncEOPADpD_xGXv7YvwfdwDK23IQFGxzZP7Hlz6pxOs8rJlAXpwSjxlNBZXQx4sBlCtJqoU4EhGKEByulwKH1v4Fg96fHi8AI_PppcuVp98qN6f-gL1SJoDYRjIL7IweOdInATL_-VP3V0wYm4HQ0oQ6GG4V8tkvzePsdMvu2vcTT7QLkywxXduPDS0eb_SHsIKGI5K5c25iE1H_OWeYidHAZeTR0vhSQ"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-[#080B11]/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-400 via-indigo-600 to-indigo-700 opacity-70 blur-md animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>
              <span className="mt-4 px-3.5 py-1.5 rounded-full bg-[#080B11]/90 border border-white/10 backdrop-blur-md text-white font-mono text-xs font-semibold tracking-wide">
                Click to Stream Masterclass (12:40)
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#080B11] to-transparent flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-white font-mono">
                <span className="font-bold truncate text-slate-200">
                  Tape Breakdown: London Fix Liquidity Run &amp; Fair Value Fill
                </span>
                <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-emerald-400 font-bold">
                  12:40
                </span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-[44%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

