import React from "react";

export default function PhysicalCampusFloor() {
  const campusCards = [
    {
      tag: "Islamabad HQ",
      category: "Trading Floor",
      title: "Dedicated Workstations & Live Desks",
      desc: "Ultra high-speed optical terminals, multi-screen setups, and collaborative institutional desk zones.",
      badge: "Live Execution",
      level: "Floor Level 1",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAEPQZ-9cly71CAiFhcPP6c5LRd_Ee49bb0XSzKYAeydqCW6bMHVjiqunkmGwXICLrtxhOznxotihJsCn5Y-KkbZ3UpYng8wOubI7AYohbcROFZ9SP59jm4snuBwRaCesC883pMZqkA3nKXX2mcNFuOt_K5jlj4giEpgy0JUJJvO_0VxkONUOShCVD6flJ04Y5U5j_N1FQyvafPixwkZgkbumZB-U5LmRLqZnenI6uvl_utLZUTceGkvS5likZtNojO3A",
    },
    {
      tag: "Strategy Labs",
      category: "Strategy Labs",
      title: "Executive Strategy Room & Live Audits",
      desc: "In-person trade dissection, order flow review sessions, and daily risk compliance checks.",
      badge: "Liquidity Lab",
      level: "Classroom 01",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAu0prW8rdazS0IKDsf6kDc_gctgqH6xrDR3gAtkIutLBhiLLC2E38fPt7dZMyduLLbbe8Oi8uvHnWMh5jyYnRlzXlaVmby8CTITj3Bl5qMfbRLC89GcU9dx9NPN96cYUzRtBWKyA8lJ53547iJ0rCv5hKctsd5B5JQIJdHoTDRw8OnNCPlA2bSPFWPSjLTtgzQ-fBDY-IfSPyKqYoqZkGVRuRDdLpIYkcEJObuYXS8n6kmQBcBt9-Z9YkYbjZU5oYhIg",
    },
    {
      tag: "Accreditation",
      category: "Funded Traders",
      title: "Certified Student Graduations",
      desc: "Recognized course completion, funded account certifications, and proprietary desk allocations.",
      badge: "Certified",
      level: "Batch Honors",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC41RNE5l5fetWUGxbtdp24-qxsJRpKb-ZLpmDMPWwlWInW-Y_4XXnCFwMFsXXgxNOzSQUywfEfybJ1SXix1WizMCo9qkkNCkzTlKsy4Cc0LRA9FmHWoNeGmV8gzdtDXkJgbsRNPD5G0XFRlPdK6LVk0kekq9iJyYGcU9EaNhUxWUiLqAguShz0NRmFCfX8jH5duaSbHGCRmT0Zc9Lut5VO3j5hwticO3ErSkZmR_RsrDvjqQP6BJy9kwRbl1BIkt5OYw",
    },
    {
      tag: "Every Sunday",
      category: "Weekly Community",
      title: "Free Weekly In-Person Seminars",
      desc: "Every Sunday 6:00 PM at Gul Arcade Plaza, PWD Road Islamabad. Open to all aspiring traders.",
      badge: "Open Seminar",
      level: "Sunday 6:00 PM",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBsM0IwLfB_8lYKJBoPnjS4cS2LokVg8eAlagCXsVsVRs8-lUHbkHiZgvNIsePxqRUlOynriQb3WOf_NwnydG-Ha-TrwiPYpPtwQvZ-f1B9diHeNPoxCJ8sYHwo9S19BbtYwFToUPMucdePYAFPb_D9cYiDjg5tMu88NIFCMYBtmMgmdHOMYAy4PfC8RJrf3V5B7XlWbYs6kU5ldDxJYv8VSzEs8yrgPn2XEStCHqUvWN26tmQE0oPpggdyo3qbcTfz_A",
    },
  ];

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
          {campusCards.map((card, idx) => (
            <div
              key={idx}
              className="group rounded-2xl overflow-hidden bg-[#121722] border border-white/[0.08] hover:border-emerald-400/50 shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-black relative">
                <img
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={card.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121722] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-emerald-400/40 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                  {card.tag}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold tracking-wider block mb-1">
                    {card.category}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {card.badge}
                  </span>
                  <span className="text-slate-400">{card.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
