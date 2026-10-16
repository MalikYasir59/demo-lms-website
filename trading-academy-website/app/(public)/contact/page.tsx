"use client";

import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Clock,
  Lock,
  DoorOpen,
  Calendar,
  Phone,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    experience: "",
    targetGoal: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        experience: "",
        targetGoal: "",
        message: "",
      });
    }, 600);
  };

  return (
    <div className="w-full bg-[#0b0e14] text-[#e0e2eb] min-h-screen">
      <div className="w-full bg-[#0b0e14]">
        <div className="flex flex-col w-full">
          <section className="relative w-full overflow-hidden pt-36 sm:pt-40 lg:pt-44 pb-12 lg:pb-16">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent_70%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/60 via-[#0b0e14] to-[#0b0e14]" />
            </div>
            <div className="absolute -top-32 right-1/4 w-[28rem] h-[28rem] bg-[#10b981]/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-1/3 -left-20 w-96 h-96 bg-[#8083ff]/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Header Title */}
              <div className="mb-8 max-w-3xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-3 tracking-tight">
                  Contact Our{" "}
                  <span className="text-[#10b981] drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                    Trading Desk
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                  Connect directly with our institutional desk mentors and physical Islamabad campus team.
                </p>
              </div>

              {/* 1. Direct Channels & Campus Map Section (Channels on Left, Campus Map & Directions on Right) */}
              <div className="mb-10 w-full bg-[#131722]/90 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-[#1e2330] shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                  {/* Left Side: Direct Channels Grid */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 h-full">
                      {/* WhatsApp */}
                      <a
                        href="https://wa.me/923077330777"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0d111a] border border-[#1b202c] hover:border-[#25D366]/50 hover:bg-[#25D366]/5 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">WhatsApp Desk</span>
                          <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#25D366] transition-colors font-mono">
                            +92 307 7330777
                          </span>
                        </div>
                      </a>

                      {/* Phone */}
                      <a
                        href="tel:03077330777"
                        className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0d111a] border border-[#1b202c] hover:border-[#10b981]/50 hover:bg-[#10b981]/5 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0 text-[#10b981]">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Hotline Phone</span>
                          <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#10b981] transition-colors font-mono">
                            0307 7330777
                          </span>
                        </div>
                      </a>

                      {/* Email */}
                      <a
                        href="mailto:support@tradingtricks.institute"
                        className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0d111a] border border-[#1b202c] hover:border-[#10b981]/50 hover:bg-[#10b981]/5 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0 text-[#10b981]">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Official Email</span>
                          <span className="text-[15px]! sm:text-base font-semibold text-white group-hover:text-[#10b981] transition-colors truncate block">
                            support@tradingtricks.institute
                          </span>
                        </div>
                      </a>

                      {/* Timings */}
                      <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0d111a] border border-[#1b202c]">
                        <div className="w-10 h-10 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0 text-[#10b981]">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Operating Timings</span>
                          <span className="text-sm sm:text-base font-semibold text-white">
                            Monday to Saturday:<br /> 11:00 AM – 8:00 PM
                          </span>
                        </div>
                      </div>

                      {/* Address with simple map pin */}
                      <a
                        href="https://maps.google.com/?q=Gul+Arcade+Plaza,+Main+PWD+Road,+Islamabad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0d111a] border border-[#1b202c] hover:border-[#10b981]/50 hover:bg-[#10b981]/5 transition-all group sm:col-span-2"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shrink-0 text-[#10b981]">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Campus Address</span>
                          <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#10b981] transition-colors leading-snug">
                            Institute of Trading Tricks, 3rd Floor Gul Arcade Plaza, Opposite London Bakery, Main PWD Road, Islamabad
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Right Side: Campus Map & Directions */}
                  <div className="lg:col-span-5 flex flex-col h-full rounded-xl bg-[#0d111a] border border-[#1b202c] overflow-hidden hover:border-[#10b981]/40 transition-all shadow-lg">
                    {/* Map Header */}
                    <div className="p-3.5 sm:p-4 border-b border-[#1b202c] flex items-center justify-between bg-[#10141f]">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981]">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white leading-tight">
                            Campus Map &amp; Directions
                          </h3>
                          <p className="text-[11px] font-mono text-slate-400">
                            Gul Arcade Plaza, PWD Road, Islamabad
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Google Map Embed */}
                    <div className="flex-1 min-h-[190px] p-2 bg-[#0d111a]">
                      <div className="relative w-full h-full min-h-[180px] rounded-lg overflow-hidden border border-[#1b202c]">
                        <iframe
                          title="Institute of Trading Tricks Islamabad Campus Map"
                          src="https://maps.google.com/maps?q=Gul%20Arcade%20Plaza%2C%20Main%20PWD%20Road%2C%20Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                          className="w-full h-full min-h-[180px] border-0 filter contrast-[1.05]"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>

                    {/* Map Footer */}
                    <div className="p-3 sm:p-3.5 border-t border-[#1b202c] flex items-center justify-between gap-3 bg-[#10141f]">
                      <a
                        href="https://maps.google.com/?q=Gul+Arcade+Plaza,+Main+PWD+Road,+Islamabad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10b981] hover:text-[#4edea3] transition-colors shrink-0"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Main Two-Column Row:
                  Left: Next Free In-Person Seminar
                  Right: Contact Us Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Column: Free Seminar */}
                <div className="lg:col-span-5 flex flex-col h-full">
                  {/* Next Free In-Person Seminar Card */}
                  <div className="bg-[#191c22]/95 backdrop-blur-md rounded-xl overflow-hidden border border-[#1d2026] shadow-2xl relative hover:border-[#10b981]/40 transition-all h-full flex flex-col justify-between">
                    <div className="relative overflow-hidden group">
                      <img
                        alt="Free Seminar Forex Trading Announcement"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD05Wh0GM1naKMfGIqSeRdDZGLbW2ZwBgHh5NfZ__zAvbsmwdO-W78g_XjJMpCvsoRlrVJxk4aHEr7FvmARXEgRM_498LU5aipILHgcJSeEU9gpgvzTBy3J2WyQuw6tyyEt2wlL8LrCgLduC3KjynjZ_02AqGnrl0Lze_V-r80dMPB0Gvzk6uN8JE9HPvw0a9avx6Gz-ZGlLvcB5IJXZU1WoPu1CMQqeSL-MgrreOn3VQBKRG1W1w1ERGpnwxo_xPEWkQ"
                      />
                      <div className="absolute top-3 left-3 bg-[#10131a]/90 border border-[#10b981]/40 backdrop-blur-md px-2.5 py-1 rounded text-[#4edea3] font-mono text-[10px] flex items-center gap-1.5 font-bold shadow-lg">
                        <Calendar className="w-3.5 h-3.5" /> FREE SEMINAR
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                          <span className="font-mono text-xs text-[#4edea3] font-bold uppercase tracking-wider">
                            Sunday 6:00 PM
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                          Attend Our Next Free In-Person Seminar
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Every Sunday 6:00 PM at Gul Arcade Plaza, PWD Road Islamabad. Open to all aspiring traders looking for institutional price action edge and prop firm funding.
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/[0.06] mt-4">
                        <div className="text-xs text-slate-300 font-mono">
                          <span className="text-[#10b981] font-bold">Hotline:</span> 0307 7330777
                        </div>
                        <a
                          className="inline-flex items-center justify-center font-mono text-xs font-bold bg-[#0d6938] hover:bg-[#10b981] text-white px-4 py-2 rounded transition-all shadow-[0_0_15px_rgba(13,105,56,0.35)]"
                          href="tel:03077330777"
                        >
                          Register Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Contact Us Form */}
                <div className="lg:col-span-7 flex flex-col h-full">
                  <div className="bg-[#191c22]/95 backdrop-blur-xl rounded-xl p-6 sm:p-8 shadow-2xl border border-[#1d2026] hover:border-[#10b981]/40 transition-all relative h-full flex flex-col justify-between">
                    <div className="absolute -top-10 -right-10 w-56 h-56 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1d2026]">
                      <div>
                        <span className="font-mono text-[10px] text-[#4edea3] uppercase font-bold tracking-wider">
                          INQUIRY DISPATCH
                        </span>
                        <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                          Send a Message
                        </h2>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10131a] border border-[#1d2026] text-slate-300 font-mono text-[10px] font-semibold">
                        <Lock className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>SECURE SSL</span>
                      </div>
                    </div>

                    <form className="relative z-10 flex-1 flex flex-col justify-between" onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            className="form-field-label mb-1.5"
                            htmlFor="fullName"
                          >
                            Full Name <span className="text-[#10b981]">*</span>
                          </label>
                          <input
                            className="form-field-control w-full bg-[#10131a] text-white rounded-lg px-4 py-3 focus:outline-none focus:bg-[#191c22] focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] shadow-inner border border-[#1d2026] transition-all"
                            id="fullName"
                            placeholder="Alexander Vance"
                            required
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>

                        <div>
                          <label
                            className="form-field-label mb-1.5"
                            htmlFor="email"
                          >
                            Email Address <span className="text-[#10b981]">*</span>
                          </label>
                          <input
                            className="form-field-control w-full bg-[#10131a] text-white rounded-lg px-4 py-3 focus:outline-none focus:bg-[#191c22] focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] shadow-inner border border-[#1d2026] transition-all"
                            id="email"
                            placeholder="alex@trader.com"
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>

                        <div>
                          <label
                            className="form-field-label mb-1.5"
                            htmlFor="experience"
                          >
                            Trading Experience <span className="text-[#10b981]">*</span>
                          </label>
                          <select
                            className="form-field-control w-full bg-[#10131a] text-white rounded-lg px-4 py-3 focus:outline-none focus:bg-[#191c22] focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] shadow-inner border border-[#1d2026] transition-all"
                            id="experience"
                            required
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          >
                            <option value="" disabled>
                              Select experience
                            </option>
                            <option value="beginner">Beginner (0-6 months)</option>
                            <option value="retail">Retail Trader (1-2 years)</option>
                            <option value="funded">Funded Trader ($50K+)</option>
                            <option value="institutional">Institutional / Desk Operator</option>
                          </select>
                        </div>

                        <div>
                          <label
                            className="form-field-label mb-1.5"
                            htmlFor="targetGoal"
                          >
                            Target Goal <span className="text-[#10b981]">*</span>
                          </label>
                          <select
                            className="form-field-control w-full bg-[#10131a] text-white rounded-lg px-4 py-3 focus:outline-none focus:bg-[#191c22] focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] shadow-inner border border-[#1d2026] transition-all"
                            id="targetGoal"
                            required
                            value={formData.targetGoal}
                            onChange={(e) => setFormData({ ...formData, targetGoal: e.target.value })}
                          >
                            <option value="" disabled>
                              Select your target goal
                            </option>
                            <option value="prop-firm">Passing Prop Firm Evaluations</option>
                            <option value="full-time">Transitioning to Full-Time Independence</option>
                            <option value="edge">Order Flow &amp; Systematic Edge</option>
                            <option value="campus-visit">Physical Campus Visit &amp; In-Person Batch</option>
                          </select>
                        </div>

                        <div>
                          <label
                            className="form-field-label mb-1.5"
                            htmlFor="message"
                          >
                            Message <span className="text-[#10b981]">*</span>
                          </label>
                          <textarea
                            className="form-field-control w-full bg-[#10131a] text-white rounded-lg px-4 py-3 focus:outline-none focus:bg-[#191c22] focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] shadow-inner border border-[#1d2026] resize-none transition-all"
                            id="message"
                            placeholder="How can our desk help you?"
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="pt-4 mt-auto">
                        <button
                          className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold bg-[#0d6938] hover:bg-[#10b981] text-white px-6 py-3.5 rounded-lg transition-all shadow-[0_0_24px_rgba(13,105,56,0.45)] border border-emerald-400/40 cursor-pointer disabled:opacity-50"
                          type="submit"
                          disabled={loading}
                        >
                          <span>{loading ? "Transmitting..." : "Send Message"}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                      {submitted && (
                        <div className="p-4 bg-[#0d2e18]/90 border border-[#10b981]/50 rounded-lg flex items-start gap-3 animate-in fade-in duration-300 mt-4">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-bold text-[#4edea3]">Message Transmitted</h4>
                            <p className="text-xs text-slate-200 mt-0.5">
                              Your inquiry has reached our trading desk. A senior operator will follow up within 2 hours.
                            </p>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>

              {/* Bottom 3 SLA metric boxes */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#191c22]/95 backdrop-blur-md border border-[#1d2026] p-6 rounded-xl text-center shadow-xl hover:border-[#10b981]/40 transition-all">
                  <p className="text-xs font-medium text-slate-400 tracking-wide">
                    Desk Response SLA
                  </p>
                  <p className="text-2xl font-semibold text-[#10b981] mt-2">
                    2h Avg SLA
                  </p>
                </div>
                <div className="bg-[#191c22]/95 backdrop-blur-md border border-[#1d2026] p-6 rounded-xl text-center shadow-xl hover:border-[#10b981]/40 transition-all">
                  <p className="text-xs font-medium text-slate-400 tracking-wide">
                    Verified Track Record
                  </p>
                  <p className="text-2xl font-semibold text-[#10b981] mt-2">
                    1,840+ Funded Students
                  </p>
                </div>
                <div className="bg-[#191c22]/95 backdrop-blur-md border border-[#1d2026] p-6 rounded-xl text-center shadow-xl hover:border-[#10b981]/50 transition-all">
                  <p className="text-xs font-medium text-slate-400 tracking-wide">
                    Current Cohort Allocation
                  </p>
                  <p className="text-2xl font-semibold text-[#4edea3] mt-2">
                    Batch 12: 8 Seats Left
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
