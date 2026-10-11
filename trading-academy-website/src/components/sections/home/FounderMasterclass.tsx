import React from "react";

export default function FounderMasterclass() {
  return (
    <section
      className="w-full bg-[#0c1018] py-16 border-t border-white/[0.08] relative overflow-hidden"
      id="founder-masterclass"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-luminosity bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/Mainbg2.JPG')",
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#080B11]/70 via-transparent to-[#080B11]/80" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#0d6938]/8 blur-[140px] rounded-full pointer-events-none" />

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
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            <video
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-black opacity-95"
              poster="https://lh3.googleusercontent.com/aida/AEtjO1WO1ZWpQZEvHpdscrUYnizozn3ncEOPADpD_xGXv7YvwfdwDK23IQFGxzZP7Hlz6pxOs8rJlAXpwSjxlNBZXQx4sBlCtJqoU4EhGKEByulwKH1v4Fg96fHi8AI_PppcuVp98qN6f-gL1SJoDYRjIL7IweOdInATL_-VP3V0wYm4HQ0oQ6GG4V8tkvzePsdMvu2vcTT7QLkywxXduPDS0eb_SHsIKGI5K5c25iE1H_OWeYidHAZeTR0vhSQ"
            >
              <source src="/videos/1%20Mints%20Short.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

