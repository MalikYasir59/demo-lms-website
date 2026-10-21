"use client";

import React, { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Do I need prior experience to join the Basic trading course?",
    a: "No prior experience is required. Basic starts from candlestick formations, market trends, account creation and live trading setup.",
  },
  {
    q: "Do you offer both on-campus and online classes?",
    a: "Yes. We run in-person classroom batches at our Islamabad campus (plus sessions in Wah Cantt and Attock) as well as online training options.",
  },
  {
    q: "How do I check the current batch schedule and fee?",
    a: "Fees are shared on request based on your chosen track. Call 0307 7330777 or submit an enrollment request on our Contact page.",
  },
  {
    q: "Can I see a live class before joining a batch?",
    a: "Absolutely. Book a campus visit Monday through Saturday and our mentors will assess your level and let you experience the classroom environment.",
  },
  {
    q: "What is the student trading competition?",
    a: "After course completion, the institute holds a trading competition for its students with 1st prize of PKR 285,000, 2nd prize of PKR 140,000, and 3rd prize of PKR 70,000.",
  },
];

export default function HomeFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="divide-y divide-white/10 border-t border-b border-white/10">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="py-4">
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-medium text-white hover:text-[#E5D7A3] transition"
            >
              <span>{item.q}</span>
              <span className="text-slate-400 ml-4 font-mono text-base">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="pt-3 text-xs text-slate-400 leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
