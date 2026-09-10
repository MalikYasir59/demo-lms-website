import React from "react";
import Image from "next/image";
import { Globe, Share2 } from "lucide-react";
import { TEAM_MEMBERS } from "@/data/team";

export default function TeamGrid() {
  return (
    <section className="w-full bg-[#0b1220] py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-3.5 py-1 rounded block w-fit mx-auto mb-3">
            Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Meet the Desk Masters
          </h2>
          <p className="text-slate-400 text-sm">
            Decades of cumulative live floor experience from Goldman Sachs, Citadel, and Jane Street.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-[#0e1626] p-6 rounded-2xl flex flex-col items-center text-center border border-slate-800 shadow-xl hover:border-emerald-500 transition-all group"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-emerald-500/40 shadow-inner group-hover:border-emerald-400 transition-colors relative">
                <Image
                  src={member.avatarUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="font-bold text-white text-lg mb-1">{member.name}</h3>
              <span className="text-xs text-emerald-400 font-semibold mb-2 font-mono">
                {member.role}
              </span>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                {member.bio}
              </p>

              <div className="flex items-center gap-3 text-slate-400 mt-auto">
                <a
                  href="#"
                  aria-label="Public Profile"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500 transition-all"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Share"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500 transition-all"
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

