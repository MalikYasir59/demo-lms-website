import type { Metadata } from "next";
import TestimonialsVideoSlider from "@/components/sections/testimonials/TestimonialsVideoSlider";

export const metadata: Metadata = {
  title: "Client & Testimonials | Institute of Trading Tricks",
  description:
    "Verified student feedback, trading floor proof, and certification reviews from the Institute of Trading Tricks community.",
};

const videoRow = [
  "/videos/ITT Reviews for ITT Delivery 1.mp4",
  "/videos/ITT Reviews for ITT Delivery 2.mp4",
  "/videos/2 (1).mp4",
  "/videos/6 (1).mp4",
  "/videos/ITT Reviews for ITT Delivery 3.mp4",
  "/videos/ITT Reviews for ITT Delivery 4.mp4",
  "/videos/ITT Reviews for ITT Delivery 5.mp4",
  "/videos/ITT Reviews for ITT Delivery 6.mp4",
];

const certificationRowOne = [
  "/images/Final (38).JPG",
  "/images/Final (41).JPG",
  "/images/Final (44).JPG",
  "/images/Final (45).JPG",
  "/images/Final (46).JPG",
  "/images/Final (47).JPG",
  "/images/Final (48).JPG",
  "/images/Final (49).JPG",
  "/images/Final (50).JPG",
  "/images/Final (51).JPG",
  "/images/Final (52).JPG",
  "/images/Final (53).JPG",
  "/images/Final (54).JPG",
  "/images/Final (55).JPG",
  "/images/Final (56).JPG",
  "/images/Final (57).JPG",
  "/images/Final (58).JPG",
  "/images/Final (59).JPG",
  "/images/Final (60).JPG",
  "/images/Final (61).JPG",
  "/images/Final (62).JPG",
  "/images/Final (63).JPG",
  "/images/Final (64).JPG",
  "/images/Final (65).JPG",
  "/images/Final (66).JPG",
  "/images/Final (67).JPG",
  "/images/Final (68).JPG",
  "/images/Final (69).JPG",
  "/images/Final (70).JPG",
  "/images/Final (71).JPG",
  "/images/Final (72).JPG",
  "/images/Final (74).JPG",
];

const certificationRowTwo = [
  "/images/Final (45).JPG",
  "/images/Final (46).JPG",
  "/images/Final (48).JPG",
  "/images/Final (49).JPG",
  "/images/Final (50).JPG",
  "/images/Final (51).JPG",
  "/images/Final (52).JPG",
  "/images/Final (53).JPG",
  "/images/Final (54).JPG",
  "/images/Final (55).JPG",
  "/images/Final (56).JPG",
  "/images/Final (57).JPG",
  "/images/Final (58).JPG",
  "/images/Final (59).JPG",
  "/images/Final (60).JPG",
  "/images/Final (61).JPG",
  "/images/Final (63).JPG",
  "/images/Final (64).JPG",
  "/images/Final (65).JPG",
  "/images/Final (66).JPG",
  "/images/Final (68).JPG",
  "/images/Final (69).JPG",
  "/images/Final (70).JPG",
];

const repeatedCertificationRowOne = [...certificationRowOne, ...certificationRowOne];
const repeatedCertificationRowTwo = [...certificationRowTwo, ...certificationRowTwo];

export default function TestimonialsPage() {
  return (
    <main className="w-full bg-[#070d15] text-slate-100">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-[0.28em] text-emerald-400">
              Student proof
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Client Testimonials
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live reviews
          </div>
        </div>

        <TestimonialsVideoSlider videos={videoRow} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8 lg:px-10">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-[0.28em] text-emerald-400">
              Certification proof
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Verified Certifications
            </h2>
          </div>
        </div>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a1320] p-4 sm:p-5">
            <div className="marquee-left flex w-max min-w-full gap-4">
              {repeatedCertificationRowOne.map((src, index) => (
                <div
                  key={`${src}-top-${index}`}
                  className="w-[220px] shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1420] shadow-[0_0_30px_rgba(0,0,0,0.24)] sm:w-[240px]"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#0e1a2a] p-1.5">
                    <img
                      src={src}
                      alt={`Certification review ${index % certificationRowOne.length + 1}`}
                      loading="lazy"
                      className="h-full w-full rounded-xl object-contain bg-[#0d1724]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a1320] p-4 sm:p-5">
            <div className="marquee-right flex w-max min-w-full gap-4">
              {repeatedCertificationRowTwo.map((src, index) => (
                <div
                  key={`${src}-bottom-${index}`}
                  className="w-[220px] shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1420] shadow-[0_0_30px_rgba(0,0,0,0.24)] sm:w-[240px]"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#0e1a2a] p-1.5">
                    <img
                      src={src}
                      alt={`Certification review ${index % certificationRowTwo.length + 1}`}
                      loading="lazy"
                      className="h-full w-full rounded-xl object-contain bg-[#0d1724]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
