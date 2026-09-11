import React from "react";
import { TIMELINE_MILESTONES } from "@/data/team";

export default function TimelineMilestones() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F17] border-b border-white/[0.06]">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="label-telemetry text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3.5 py-1 rounded-full">
            Our Evolution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From Boutique Prop Desk to Global Academy
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl">
            A track record built on verified trading milestones and audited student evaluations.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="relative border-l-2 border-white/[0.08] ml-4 sm:ml-8 flex flex-col gap-8">
          {TIMELINE_MILESTONES.map((milestone) => (
            <div key={milestone.year} className="relative pl-8 sm:pl-10">
              <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-[#10B981] border-4 border-[#0B0F17] shadow-md" />
              <div className="bg-[#121824]/90 backdrop-blur-xl p-6 rounded-lg border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] hover:border-[#6366F1]/40 transition-colors">
                <span className="px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] font-mono text-xs font-bold inline-block mb-2 border border-[#10B981]/30 label-telemetry">
                  {milestone.year}
                </span>
                <h3 className="font-bold text-white text-xl mb-1">
                  {milestone.title}
                </h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
