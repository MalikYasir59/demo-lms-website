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
    <div className="bg-[#121824]/95 backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 rounded-lg flex flex-col gap-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_20px_48px_-12px_rgba(0,0,0,0.75)] relative">
      <div className="flex flex-col gap-1 border-b border-white/[0.06] pb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#10B981] font-semibold label-telemetry">
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
              className="flex items-center gap-4 p-4 rounded bg-[#0B0F17] border border-white/[0.06] shadow-sm transition-all hover:border-[#6366F1]/30"
            >
              <div className="w-12 h-12 rounded bg-[#182234] border border-white/[0.08] flex items-center justify-center shrink-0 text-[#10B981]">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-400 font-mono uppercase label-telemetry">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className={`text-sm font-bold text-white hover:text-[#c0c1ff] transition-colors ${
                      item.isMono ? "font-mono tabular-nums" : ""
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

      <div className="flex items-center gap-3 pt-2 text-xs text-[#10B981] font-mono label-telemetry">
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        <span>Typical response time: under 15 minutes during live market hours</span>
      </div>
    </div>
  );
}
