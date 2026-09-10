import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { DESK_CONTACT_INFO } from "@/data/nav-links";

export default function ContactDeskInfo() {
  const contactItems = [
    {
      icon: Phone,
      label: "Desk Phone",
      value: DESK_CONTACT_INFO.phone,
      href: "tel:+18005558742",
      isMono: true,
    },
    {
      icon: Mail,
      label: "Admissions Email",
      value: DESK_CONTACT_INFO.email,
      href: `mailto:${DESK_CONTACT_INFO.email}`,
      isMono: true,
    },
    {
      icon: MapPin,
      label: "Trading Floor Address",
      value: DESK_CONTACT_INFO.address,
      isMono: false,
    },
    {
      icon: Clock,
      label: "Desk Operating Hours",
      value: DESK_CONTACT_INFO.hours,
      isMono: false,
    },
  ];

  return (
    <div className="bg-brand-navy-card border border-slate-700/80 p-6 sm:p-8 rounded-2xl flex flex-col gap-6 shadow-2xl relative">
      <div className="flex flex-col gap-1 border-b border-slate-800 pb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-brand-emerald font-semibold">
          Contact Channels
        </span>
        <h2 className="font-extrabold text-white text-2xl tracking-tight">
          Direct Desk Info
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {contactItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-4 p-4 rounded-xl bg-brand-navy-surface border border-slate-800 shadow-sm transition-all hover:border-slate-700"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-brand-emerald">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-400 font-mono uppercase">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className={`text-sm font-bold text-white hover:text-brand-emerald transition-colors ${
                      item.isMono ? "font-mono" : ""
                    }`}
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-sm font-bold text-white leading-snug">
                    {item.value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2 text-xs text-brand-emerald font-mono">
        <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
        <span>Typical response time: under 15 minutes during live market hours</span>
      </div>
    </div>
  );
}

