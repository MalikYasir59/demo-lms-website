import React from "react";

export default function PhysicalCampusFloor() {
  return (
    <section className="w-full bg-[#0c1018] py-20 border-t border-white/[0.08]" id="campus">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="px-4 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold">
            Physical Trading Floor &amp; Real Academy
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            State-Of-The-Art Campus &amp; Live Seminars
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Not just an online course. Experience physical trading floors, in-person strategy audits, and weekly free community seminars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Trading Floor */}
          <div className="group rounded-2xl overflow-hidden bg-[#121722] border border-white/[0.08] hover:border-emerald-400/50 shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
            <div className="aspect-[4/3] w-full overflow-hidden bg-black relative">
              <img
                alt="Dedicated Trading Floor &amp; Workstations"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEPQZ-9cly71CAiFhcPP6c5LRd_Ee49bb0XSzKYAeydqCW6bMHVjiqunkmGwXICLrtxhOznxotihJsCn5Y-KkbZ3UpYng8wOubI7AYohbcROFZ9SP59jm4snuBwRaCesC883pMZqkA3nKXX2mcNFuOt_K5jlj4giEpgy0JUJJvO_0VxkONUOShCVD6flJ04Y5U5j_N1FQyvafPixwkZgkbumZB-U5LmRLqZnenI6uvl_utLZUTceGkvS5likZtNojO3A"
              />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-emerald-400/40 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                Islamabad HQ
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] text-emerald-400 uppercase font-bold tracking-wider">
                  Trading Floor
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Dedicated Workstations &amp; Live Desks
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Ultra high-speed optical terminals, multi-screen setups, and collaborative institutional desk zones.
              </p>
            </div>
          </div>

          {/* Card 2: Strategy Room */}
          <div className="group rounded-2xl overflow-hidden bg-[#121722] border border-white/[0.08] hover:border-indigo-400/50 shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
            <div className="h-[280px] sm:h-[320px] w-full overflow-hidden bg-[#0a0f16] relative">
              <img
                alt="Executive Strategy Room &amp; Live Audits"
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu0prW8rdazS0IKDsf6kDc_gctgqH6xrDR3gAtkIutLBhiLLC2E38fPt7dZMyduLLbbe8Oi8uvHnWMh5jyYnRlzXlaVmby8CTITj3Bl5qMfbRLC89GcU9dx9NPN96cYUzRtBWKyA8lJ53547iJ0rCv5hKctsd5B5JQIJdHoTDRw8OnNCPlA2bSPFWPSjLTtgzQ-fBDY-IfSPyKqYoqZkGVRuRDdLpIYkcEJObuYXS8n6kmQBcBt9-Z9YkYbjZU5oYhIg"
              />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-indigo-400/40 text-indigo-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                Strategy Labs
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] text-indigo-400 uppercase font-bold tracking-wider">
                  Strategy Labs
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Executive Strategy Room &amp; Live Audits
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                In-person trade dissection, order flow review sessions, and daily risk compliance checks.
              </p>
            </div>
          </div>

          {/* Card 3: Student Graduations */}
          <div className="group rounded-2xl overflow-hidden bg-[#121722] border border-white/[0.08] hover:border-emerald-400/50 shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
            <div className="aspect-[4/3] w-full overflow-hidden bg-black relative">
              <img
                alt="Certified Student Graduations"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC41RNE5l5fetWUGxbtdp24-qxsJRpKb-ZLpmDMPWwlWInW-Y_4XXnCFwMFsXXgxNOzSQUywfEfybJ1SXix1WizMCo9qkkNCkzTlKsy4Cc0LRA9FmHWoNeGmV8gzdtDXkJgbsRNPD5G0XFRlPdK6LVk0kekq9iJyYGcU9EaNhUxWUiLqAguShz0NRmFCfX8jH5duaSbHGCRmT0Zc9Lut5VO3j5hwticO3ErSkZmR_RsrDvjqQP6BJy9kwRbl1BIkt5OYw"
              />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                Accreditation
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] text-emerald-400 uppercase font-bold tracking-wider">
                  Funded Traders
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Certified Student Graduations
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Recognized course completion, funded account certifications, and proprietary desk allocations.
              </p>
            </div>
          </div>

          {/* Card 4: Free Weekly Seminars */}
          <div className="group rounded-2xl overflow-hidden bg-[#121722] border border-white/[0.08] hover:border-emerald-400/50 shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
            <div className="aspect-[4/3] w-full overflow-hidden bg-black relative">
              <img
                alt="Free Weekly In-Person Seminars"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsM0IwLfB_8lYKJBoPnjS4cS2LokVg8eAlagCXsVsVRs8-lUHbkHiZgvNIsePxqRUlOynriQb3WOf_NwnydG-Ha-TrwiPYpPtwQvZ-f1B9diHeNPoxCJ8sYHwo9S19BbtYwFToUPMucdePYAFPb_D9cYiDjg5tMu88NIFCMYBtmMgmdHOMYAy4PfC8RJrf3V5B7XlWbYs6kU5ldDxJYv8VSzEs8yrgPn2XEStCHqUvWN26tmQE0oPpggdyo3qbcTfz_A"
              />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-emerald-400/40 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                Every Sunday
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] text-emerald-400 uppercase font-bold tracking-wider">
                  Weekly Community
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Free Weekly In-Person Seminars
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Every Sunday 6:00 PM at Gul Arcade Plaza, PWD Road Islamabad. Open to all aspiring traders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

