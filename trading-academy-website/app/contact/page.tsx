import type { Metadata } from "next";
import ContactHero from "@/components/sections/contact/ContactHero";
import ContactDeskInfo from "@/components/sections/contact/ContactDeskInfo";
import ContactForm from "@/components/sections/contact/ContactForm";
import ContactFAQ from "@/components/sections/contact/ContactFAQ";

export const metadata: Metadata = {
  title: "Contact & Institutional Desk | Institute of Trading Tricks",
  description:
    "Speak directly with our institutional trading desk analysts and admissions department for course enrollment, terminal access, and private mentorship.",
};

export default function ContactPage() {
  return (
    <div className="w-full bg-brand-navy">
      {/* Hero & Contact Form Area (Deep Dark Navy) */}
      <section className="relative w-full bg-brand-navy text-white pt-16 pb-24 terminal-grid border-b border-slate-800 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-16">
          <ContactHero />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Contact Desk Info */}
            <div className="lg:col-span-5">
              <ContactDeskInfo />
            </div>

            {/* Right: Intake Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Live Chat Banner */}
      <ContactFAQ />
    </div>
  );
}

