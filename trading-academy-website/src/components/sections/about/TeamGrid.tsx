import React from "react";
import Image from "next/image";
import { Globe, Share2 } from "lucide-react";
import { TEAM_MEMBERS } from "@/data/team";

export default function TeamGrid() {
  return (
    <section className="w-full bg-[#080B11] py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="label-telemetry text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3.5 py-1 rounded-full block w-fit mx-auto mb-3">
            Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Meet the Desk Masters
          </h2>
          <p className="text-[#94A3B8] text-sm">
            Decades of cumulative live floor experience from Goldman Sachs, Citadel, and Jane Street.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-[#121824]/90 backdrop-blur-xl p-6 rounded-lg flex flex-col items-center text-center border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] hover:border-[#6366F1]/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)] transition-all group"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#10B981]/50 shadow-inner group-hover:border-[#10B981] transition-colors relative">
                <Image
                  src={member.avatarUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="font-bold text-white text-lg mb-1">{member.name}</h3>
              <span className="text-xs text-[#10B981] font-semibold mb-2 font-mono label-telemetry">
                {member.role}
              </span>
              <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">
                {member.bio}
              </p>

              <div className="flex items-center gap-3 text-slate-400 mt-auto">
                <a
                  href="#"
                  aria-label="Public Profile"
                  className="w-8 h-8 rounded bg-[#182234] border border-white/[0.08] flex items-center justify-center hover:text-white hover:border-[#6366F1]/40 transition-all"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Share"
                  className="w-8 h-8 rounded bg-[#182234] border border-white/[0.08] flex items-center justify-center hover:text-white hover:border-[#6366F1]/40 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
