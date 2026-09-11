import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { TeamMember } from "@/types";

interface InstructorBioProps {
  instructor: TeamMember;
}

export default function InstructorBio({ instructor }: InstructorBioProps) {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-[#0B0F17] border-b border-white/[0.06]" id="instructor">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#121824]/95 backdrop-blur-xl p-8 lg:p-12 rounded-lg flex flex-col md:flex-row items-center gap-8 border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_20px_48px_-12px_rgba(0,0,0,0.75)] relative">
          {/* Avatar Container */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#10B981] relative shadow-lg">
              <Image
                src={instructor.avatarUrl}
                alt={instructor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-[#6366F1] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Bio Details */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-extrabold text-white">{instructor.name}</h3>
              <p className="text-[#c0c1ff] text-sm font-semibold pt-0.5 label-telemetry">
                {instructor.role}
              </p>
            </div>

            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {instructor.bio}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-400">
              <span className="px-3 py-1 rounded bg-[#182234] border border-white/[0.08]">
                Specialization: <strong className="text-white">{instructor.specialization}</strong>
              </span>
              {instructor.trackRecord && (
                <span className="px-3 py-1 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 label-telemetry">
                  {instructor.trackRecord}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
