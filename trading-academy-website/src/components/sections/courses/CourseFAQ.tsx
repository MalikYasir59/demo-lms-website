import React from "react";
import { HelpCircle } from "lucide-react";
import { COURSE_FAQS } from "@/data/faqs";

export default function CourseFAQ() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-brand-mist border-b border-slate-200" id="faq">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#0284C7] bg-[#E0F2FE] border border-[#0284C7]/20 px-3 py-1 rounded">
            Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Everything you need to know about the masterclass curriculum, schedule, and prop guarantees.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {COURSE_FAQS.map((faq) => (
            <div
              key={faq.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-brand-emerald shrink-0 mt-0.5" />
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {faq.question}
                </h3>
              </div>
              <p className="text-sm text-slate-600 pl-8 leading-relaxed font-normal">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

