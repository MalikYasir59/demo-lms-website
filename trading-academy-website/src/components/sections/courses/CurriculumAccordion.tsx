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
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200" id="curriculum">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#006c49] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded">
            Syllabus
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Complete Course Curriculum
          </h2>
          <p className="text-sm text-slate-600">
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
                className="bg-brand-surface rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(m.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100/70 px-2.5 py-1 rounded border border-emerald-200 shrink-0">
                      MODULE {m.moduleNumber}
                    </span>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                        {m.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-normal hidden sm:block">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                      {m.lessons.length} Lessons
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-200/80 flex flex-col gap-3">
                    <p className="text-xs text-slate-600 font-normal sm:hidden pb-1">
                      {m.description}
                    </p>

                    <div className="grid grid-cols-1 gap-2.5">
                      {m.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-white text-xs border border-slate-200 hover:border-brand-emerald transition-colors"
                        >
                          <div className="flex items-center gap-3 font-medium text-slate-800">
                            {lesson.isFree ? (
                              <PlayCircle className="w-4 h-4 text-brand-emerald shrink-0" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="font-semibold text-slate-900">
                              {lesson.title}
                            </span>
                            {lesson.isFree && (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                                FREE PREVIEW
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500 font-mono text-[11px] shrink-0">
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

