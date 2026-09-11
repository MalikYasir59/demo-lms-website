import React from "react";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#080B11] pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] terminal-grid">
      {/* Floor 0 Controlled Luminescence */}
      <div className="absolute top-0 right-0 w-[650px] h-[450px] bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[350px] bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08)_0%,transparent_55%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 relative z-10">
        <div className="max-w-3xl flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121824] border border-white/[0.08] text-[#10B981] text-xs font-mono font-bold uppercase tracking-widest shadow-inner label-telemetry">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              Our Story
            </span>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-[#6366F1]/15 border border-[#6366F1]/35 text-[#c0c1ff] text-[11px] font-mono font-semibold label-telemetry">
              Institutional Order Flow Heritage
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
            Built by Traders, for Traders
          </h1>

          <p className="mt-2 text-base sm:text-lg text-[#94A3B8] leading-relaxed font-normal">
            The Institute of Trading Tricks was forged out of a singular frustration with retail indicators and internet misinformation. We built an institution based entirely on transparent order flow, institutional edge, and rigorous risk control.
          </p>
        </div>

        {/* Prop Desk Image Container with HUD */}
        <div className="w-full h-80 sm:h-96 lg:h-[480px] rounded-lg relative overflow-hidden shadow-2xl border border-white/[0.08] bg-[#0B0F17]">
          <Image
            src="https://lh3.googleusercontent.com/aida/AEtjO1XxH3SlLFywoVznsm-weWwRbgurmv4hMvOQXGfM0SHvnj0I8U9PruEIEhC21b2PKsTeD7HZvm42u7YtXMh9Mdd8ySQc3D4SRBPwcPeyuCm7DVWBMcpYXSY4zXkJ1GszhzOhByJcP4SeWsP0Evuq54rkY7FVcb5xYAIRx-HEClpVDdaqsN7ncL_STjsF9eZC7N16fwsM_GYnbBYiFuJpr_lILvQHHNS4Pt0jvm7SyHO2gs6y73bL9njmOh6Y"
            alt="Trading Desk Floor"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B11]/95 via-transparent to-[#080B11]/40" />

          {/* Bottom Floating HUD Badge */}
          <div className="absolute bottom-4 left-4 right-4 hidden sm:flex justify-between items-center text-[11px] font-mono text-slate-300 bg-[#121824]/95 px-4 py-2.5 rounded border border-white/[0.08] backdrop-blur-md shadow-lg">
            <span className="text-[#10B981] font-bold flex items-center gap-1.5 label-telemetry">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              PROP DESK FLOOR // LONDON &amp; NY
            </span>
            <span className="text-slate-400 label-telemetry">
              ORDER_FLOW_AUDIT // ALGO_EXECUTION_STATION
            </span>
            <span className="text-[#c0c1ff] font-semibold label-telemetry">VERIFIED TELEMETRY ACTIVE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
