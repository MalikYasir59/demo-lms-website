import React from "react";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#070b14] via-[#0b1120] to-[#0b1222] pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 terminal-grid">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 relative z-10">
        <div className="max-w-3xl flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-brand-emerald text-xs font-mono font-bold uppercase tracking-widest shadow-inner">
              <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
              Our Story
            </span>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-brand-royal/20 border border-brand-royal/40 text-blue-400 text-[11px] font-mono font-semibold">
              Institutional Order Flow Heritage
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
            Built by Traders, for Traders
          </h1>

          <p className="mt-2 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            The Institute of Trading Tricks was forged out of a singular frustration with retail indicators and internet misinformation. We built an institution based entirely on transparent order flow, institutional edge, and rigorous risk control.
          </p>
        </div>

        {/* Prop Desk Image Container with HUD */}
        <div className="w-full h-80 sm:h-96 lg:h-[480px] rounded-2xl relative overflow-hidden shadow-2xl border border-slate-700/80 bg-[#090d16]">
          <Image
            src="https://lh3.googleusercontent.com/aida/AEtjO1XxH3SlLFywoVznsm-weWwRbgurmv4hMvOQXGfM0SHvnj0I8U9PruEIEhC21b2PKsTeD7HZvm42u7YtXMh9Mdd8ySQc3D4SRBPwcPeyuCm7DVWBMcpYXSY4zXkJ1GszhzOhByJcP4SeWsP0Evuq54rkY7FVcb5xYAIRx-HEClpVDdaqsN7ncL_STjsF9eZC7N16fwsM_GYnbBYiFuJpr_lILvQHHNS4Pt0jvm7SyHO2gs6y73bL9njmOh6Y"
            alt="Trading Desk Floor"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/90 via-transparent to-[#070b14]/30" />

          {/* Bottom Floating HUD Badge */}
          <div className="absolute bottom-4 left-4 right-4 hidden sm:flex justify-between items-center text-[11px] font-mono text-slate-300 bg-[#0c1220]/90 px-4 py-2.5 rounded-lg border border-slate-700/70 backdrop-blur-md shadow-lg">
            <span className="text-brand-emerald font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
              PROP DESK FLOOR // LONDON &amp; NY
            </span>
            <span className="text-slate-400">
              ORDER_FLOW_AUDIT // ALGO_EXECUTION_STATION
            </span>
            <span className="text-blue-400 font-semibold">VERIFIED TELEMETRY ACTIVE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

