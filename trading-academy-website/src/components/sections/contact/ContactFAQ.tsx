import React from "react";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { CONTACT_FAQS } from "@/data/faqs";
import { DESK_CONTACT_INFO } from "@/data/nav-links";

export default function ContactFAQ() {
  return (
    <section className="w-full bg-brand-mist text-slate-900 py-20 border-b border-slate-200" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-12">
        <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#0284C7] bg-[#E0F2FE] border border-[#0284C7]/20 px-3 py-1 rounded">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Before You Reach Out
          </h2>
          <p className="text-sm text-slate-600">
            Immediate answers regarding onboarding times, consultations, and payment rails.
          </p>
        </div>

        {/* 3 FAQ Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTACT_FAQS.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-slate-200 p-6 rounded-xl flex flex-col gap-3 shadow-sm hover:border-brand-emerald hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {faq.question}
                </h3>
                <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Live Support Banner */}
        <div className="w-full bg-white border border-slate-200 border-l-4 border-l-brand-emerald p-6 sm:p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-brand-emerald shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1 text-center md:text-left">
              <h3 className="font-bold text-slate-900 text-lg">
                Prefer to chat now?
              </h3>
              <p className="text-sm text-slate-600">
                Our admissions team is live on Discord and WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-center">
            <a
              href={DESK_CONTACT_INFO.discordHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white text-sm font-semibold hover:border-slate-400 hover:text-slate-900 transition-colors shadow-sm text-center"
            >
              Join Discord
            </a>
            <a
              href={DESK_CONTACT_INFO.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-brand-royal text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm text-center"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

