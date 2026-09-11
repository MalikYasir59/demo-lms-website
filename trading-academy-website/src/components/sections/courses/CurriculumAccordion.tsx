"use client";

import React, { useState } from "react";
import { PlayCircle, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { CourseModule } from "@/types";

interface CurriculumAccordionProps {
  modules: CourseModule[];
}

export default function CurriculumAccordion({ modules }: CurriculumAccordionProps) {
  const [expandedModule, setExpandedModule] = useState<string>(modules[0]?.id || "");

  const toggleModule = (id: string) => {
    setExpandedModule(expandedModule === id ? "" : id);
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#080B11] border-b border-white/[0.06]" id="curriculum">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="label-telemetry text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3.5 py-1 rounded-full">
            Syllabus
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Complete Course Curriculum
          </h2>
          <p className="text-sm text-[#94A3B8]">
            6 in-depth modules comprising 45+ hours of institutional price action mastery.
          </p>
        </div>

        {/* Modules Accordion */}
        <div className="flex flex-col gap-4">
          {modules.map((m) => {
            const isExpanded = expandedModule === m.id;
            return (
              <div
                key={m.id}
                className="bg-[#121824]/90 backdrop-blur-xl rounded-lg border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(m.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[#182234]/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="label-telemetry text-[#c0c1ff] bg-[#6366F1]/15 border border-[#6366F1]/30 px-2.5 py-1 rounded shrink-0">
                      MODULE {m.moduleNumber}
                    </span>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-white text-base sm:text-lg">
                        {m.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] font-normal hidden sm:block">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline tabular-nums">
                      {m.lessons.length} Lessons
                    </span>
                    <div className="w-8 h-8 rounded bg-[#182234] border border-white/[0.08] flex items-center justify-center text-slate-300">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#6366F1]" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] flex flex-col gap-3">
                    <p className="text-xs text-[#94A3B8] font-normal sm:hidden pb-1">
                      {m.description}
                    </p>

                    <div className="grid grid-cols-1 gap-2.5">
                      {m.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3.5 rounded bg-[#0B0F17] text-xs border border-white/[0.06] hover:border-[#6366F1]/40 transition-colors"
                        >
                          <div className="flex items-center gap-3 font-medium text-[#E0E2EB]">
                            {lesson.isFree ? (
                              <PlayCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                            <span className="font-semibold text-white">
                              {lesson.title}
                            </span>
                            {lesson.isFree && (
                              <span className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono font-bold label-telemetry">
                                FREE PREVIEW
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 font-mono text-[11px] shrink-0 tabular-nums">
                            {lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
