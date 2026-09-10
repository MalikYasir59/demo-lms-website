import React from "react";
import { TIMELINE_MILESTONES } from "@/data/team";

export default function TimelineMilestones() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#006c49] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded">
            Our Evolution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From Boutique Prop Desk to Global Academy
          </h2>
          <p className="text-sm text-slate-600 max-w-xl">
            A track record built on verified trading milestones and audited student evaluations.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 flex flex-col gap-8">
          {TIMELINE_MILESTONES.map((milestone) => (
            <div key={milestone.year} className="relative pl-8 sm:pl-10">
              <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-brand-emerald border-4 border-white shadow-md" />
              <div className="bg-brand-surface p-6 rounded-xl border border-slate-200 shadow-sm hover:border-brand-emerald transition-colors">
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold inline-block mb-2 border border-emerald-300">
                  {milestone.year}
                </span>
                <h3 className="font-bold text-slate-900 text-xl mb-1">
                  {milestone.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
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

