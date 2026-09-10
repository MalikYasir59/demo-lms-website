import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { TeamMember } from "@/types";

interface InstructorBioProps {
  instructor: TeamMember;
}

export default function InstructorBio({ instructor }: InstructorBioProps) {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-white border-b border-slate-200" id="instructor">
      <div className="max-w-4xl mx-auto">
        <div className="bg-brand-surface p-8 lg:p-12 rounded-2xl flex flex-col md:flex-row items-center gap-8 border border-slate-200 relative shadow-sm">
          {/* Avatar Container */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-brand-emerald relative shadow-md">
              <Image
                src={instructor.avatarUrl}
                alt={instructor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-brand-royal text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Bio Details */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">{instructor.name}</h3>
              <p className="text-brand-royal text-sm font-semibold pt-0.5">
                {instructor.role}
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {instructor.bio}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-500">
              <span className="px-3 py-1 rounded bg-slate-100 border border-slate-200">
                Specialization: <strong className="text-slate-800">{instructor.specialization}</strong>
              </span>
              {instructor.trackRecord && (
                <span className="px-3 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
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

