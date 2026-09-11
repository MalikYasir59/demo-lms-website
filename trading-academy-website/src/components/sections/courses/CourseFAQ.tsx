import React from "react";
import { HelpCircle } from "lucide-react";
import { COURSE_FAQS } from "@/data/faqs";

export default function CourseFAQ() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#0B0F17] border-b border-white/[0.06]" id="faq">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="label-telemetry text-[#c0c1ff] bg-[#6366F1]/15 border border-[#6366F1]/30 px-3.5 py-1 rounded-full">
            Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#94A3B8]">
            Everything you need to know about the masterclass curriculum, schedule, and prop guarantees.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {COURSE_FAQS.map((faq) => (
            <div
              key={faq.id}
              className="bg-[#121824]/90 backdrop-blur-xl p-6 rounded-lg border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] flex flex-col gap-3 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <h3 className="font-bold text-white text-base leading-snug">
                  {faq.question}
                </h3>
              </div>
              <p className="text-sm text-[#94A3B8] pl-8 leading-relaxed font-normal">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
