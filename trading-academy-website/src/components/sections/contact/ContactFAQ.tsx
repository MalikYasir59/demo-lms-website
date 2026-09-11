import React from "react";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { CONTACT_FAQS } from "@/data/faqs";
import { DESK_CONTACT_INFO } from "@/data/nav-links";

export default function ContactFAQ() {
  return (
    <section className="w-full bg-[#0B0F17] text-white py-20 border-b border-white/[0.06]" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto">
          <span className="label-telemetry text-[#c0c1ff] bg-[#6366F1]/15 border border-[#6366F1]/30 px-3.5 py-1 rounded-full">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            Before You Reach Out
          </h2>
          <p className="text-sm text-[#94A3B8]">
            Immediate answers regarding onboarding times, consultations, and payment rails.
          </p>
        </div>

        {/* 3 FAQ Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTACT_FAQS.map((faq) => (
            <div
              key={faq.id}
              className="bg-[#121824]/90 backdrop-blur-xl border border-white/[0.08] p-6 rounded-lg flex flex-col gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-white text-sm leading-snug">
                  {faq.question}
                </h3>
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Live Support Banner */}
        <div className="w-full bg-[#121824]/95 backdrop-blur-xl border border-white/[0.08] border-l-4 border-l-[#10B981] p-6 sm:p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-[#182234] border border-white/[0.08] flex items-center justify-center text-[#10B981] shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1 text-center md:text-left">
              <h3 className="font-bold text-white text-lg">
                Prefer to chat now?
              </h3>
              <p className="text-sm text-[#94A3B8]">
                Our admissions team is live on Discord and WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-center">
            <a
              href={DESK_CONTACT_INFO.discordHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded border border-white/[0.08] text-[#E2E8F0] bg-[#182234] text-sm font-semibold hover:border-[#6366F1]/40 hover:text-white transition-colors shadow-sm text-center"
            >
              Join Discord
            </a>
            <a
              href={DESK_CONTACT_INFO.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white text-sm font-semibold border border-white/20 shadow-[0_0_12px_rgba(99,102,241,0.35)] hover:shadow-[0_0_18px_rgba(99,102,241,0.55)] transition-colors text-center"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
