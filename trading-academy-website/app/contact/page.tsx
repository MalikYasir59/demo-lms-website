"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  MessageSquare,
  MapPin,
  Clock,
  Lock,
  DoorOpen,
  Calendar,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
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
      <main className="w-full pt-8 sm:pt-12 bg-[#0b0e14]">
        <div className="flex flex-col w-full">
          <section className="relative w-full overflow-hidden py-12 lg:py-16">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent_70%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/60 via-[#0b0e14] to-[#0b0e14]" />
            </div>
            <div className="absolute -top-32 right-1/4 w-[28rem] h-[28rem] bg-[#10b981]/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-1/3 -left-20 w-96 h-96 bg-[#8083ff]/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="mb-12 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191c22] border border-[#10b981]/30 shadow-sm mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#4edea3] font-bold">
                    ACTIVE DESK • MON-FRI SESSIONS
                  </span>
                </div>
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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Direct Channels & Facilities */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* Channels Card */}
                  <div className="bg-[#191c22]/95 backdrop-blur-md rounded-xl p-6 shadow-2xl relative overflow-hidden border border-[#1d2026] hover:border-[#10b981]/40 transition-all">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0d6938] via-[#10b981] to-[#8083ff]" />
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1d2026]">
                      <span className="font-mono text-[10px] text-slate-300 uppercase font-bold tracking-wider">
                        DIRECT CHANNELS
                      </span>
                      <span className="font-mono text-[10px] text-[#4edea3] flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        RESPONSE SLA &lt; 2H
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#10b981]/10 transition-colors">
                        <div className="p-2 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] text-[#4edea3] uppercase tracking-wider font-semibold">
                            Email
                          </p>
                          <a
                            className="text-sm text-white hover:text-[#10b981] truncate block transition-colors font-medium"
                            href="mailto:support@tradingtricks.institute"
                          >
                            support@tradingtricks.institute
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#10b981]/10 transition-colors">
                        <div className="p-2 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] flex items-center justify-center flex-shrink-0">
                          <Send className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] text-[#4edea3] uppercase tracking-wider font-semibold">
                            Telegram
                          </p>
                          <p className="text-sm text-white font-medium">@TradingTricksInstitutional</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#10b981]/10 transition-colors">
                        <div className="p-2 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] text-[#4edea3] uppercase tracking-wider font-semibold">
                            Discord
                          </p>
                          <p className="text-sm text-white font-medium">discord.gg/trading-tricks-desk</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#10b981]/10 transition-colors">
                        <div className="p-2 rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] text-[#4edea3] uppercase tracking-wider font-semibold">
                            Physical Campus
                          </p>
                          <p className="text-sm text-white font-medium leading-relaxed">
                            Institute of Trading Tricks Campus, 3rd Floor Gul Arcade Plaza, Opposite London Bakery Main PWD Road, Islamabad
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Operational Desk Hours */}
                    <div className="mt-4 pt-4 border-t border-[#1d2026]">
                      <h3 className="font-mono text-[10px] text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                        Operational Desk Hours
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#10131a] border border-[#1d2026] p-3 rounded-lg">
                          <p className="font-mono text-[10px] text-[#4edea3] uppercase font-bold">London</p>
                          <p className="font-mono text-base text-white mt-0.5 font-bold">07:00 – 16:00</p>
                          <span className="text-[11px] text-slate-400">UTC</span>
                        </div>
                        <div className="bg-[#10131a] border border-[#1d2026] p-3 rounded-lg">
                          <p className="font-mono text-[10px] text-[#4edea3] uppercase font-bold">New York</p>
                          <p className="font-mono text-base text-white mt-0.5 font-bold">12:00 – 21:00</p>
                          <span className="text-[11px] text-slate-400">UTC</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campus Visit Card */}
                  <div className="bg-[#191c22]/95 backdrop-blur-md rounded-xl overflow-hidden border border-[#1d2026] shadow-2xl group hover:border-[#10b981]/40 transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        alt="Institute of Trading Tricks Campus &amp; Trading Floor"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBjwqrm8tGEgWmBn8-2_2effzOa0sVMaGR-LqXW_2JCDImO2chnNZvUMc0Ys46-r4oeplN9qGnrmNhrhpiMsICfiOA6k5w7wHD59Mtnhewx4CWCuJC15rAEt_xRpMZPFU-L8oSkqpUHnTbzZsxPHuwCUcEeXKLqG3qHVkiBWeAQL9QoPTbZ464PAkYWFOrJlSN4KNjGHuOdZZT_CMO-ht7woB-sN9B29VOn2ZuGZE-sfbez_OuHum1XqofXKbuoiWsFA"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#191c22] via-[#191c22]/40 to-transparent" />
                      <span className="absolute top-2 right-2 bg-[#10131a]/90 border border-[#10b981]/40 backdrop-blur-md px-2 py-1 rounded text-[#4edea3] font-mono text-[10px] flex items-center gap-1 font-bold">
                        <DoorOpen className="w-3 h-3" /> ON-SITE ACCESS
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold text-white mb-1">
                        Visit Our Trading Floor &amp; Campus
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Scheduled physical tours and terminal walkthroughs available at Gul Arcade Plaza, Islamabad.
                      </p>
                    </div>
                  </div>

                  {/* Free Seminar Announcement Card */}
                  <div className="bg-[#191c22]/95 backdrop-blur-md rounded-xl overflow-hidden border border-[#1d2026] shadow-2xl relative">
                    <div className="relative overflow-hidden">
                      <img
                        alt="Free Seminar Forex Trading Announcement"
                        className="w-full h-auto object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD05Wh0GM1naKMfGIqSeRdDZGLbW2ZwBgHh5NfZ__zAvbsmwdO-W78g_XjJMpCvsoRlrVJxk4aHEr7FvmARXEgRM_498LU5aipILHgcJSeEU9gpgvzTBy3J2WyQuw6tyyEt2wlL8LrCgLduC3KjynjZ_02AqGnrl0Lze_V-r80dMPB0Gvzk6uN8JE9HPvw0a9avx6Gz-ZGlLvcB5IJXZU1WoPu1CMQqeSL-MgrreOn3VQBKRG1W1w1ERGpnwxo_xPEWkQ"
                      />
                      <div className="absolute top-2 left-2 bg-[#10131a]/90 border border-[#10b981]/40 backdrop-blur-md px-2 py-1 rounded text-[#4edea3] font-mono text-[10px] flex items-center gap-1 font-bold">
                        <Calendar className="w-3 h-3" /> FREE SEMINAR
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                        <span className="font-mono text-[10px] text-[#4edea3] font-bold uppercase">
                          Sunday 6:00 PM
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">
                        Attend Our Next Free In-Person Seminar
                      </h3>
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
                        <div className="text-xs text-slate-300 font-mono">
                          <span className="text-[#10b981] font-bold">Hotline:</span> 0307 7330777
                        </div>
                        <a
                          className="inline-flex items-center justify-center font-mono text-xs font-bold bg-[#0d6938] hover:bg-[#10b981] text-white px-3 py-1 rounded transition-all shadow"
                          href="tel:03077330777"
                        >
                          Register Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Inquiry Dispatch Form */}
                <div className="lg:col-span-7">
                  <div className="bg-[#191c22]/95 backdrop-blur-xl rounded-xl p-6 sm:p-8 shadow-2xl border border-[#1d2026] hover:border-[#10b981]/40 transition-all relative">
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

                    <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
                      <div>
                        <label
                          className="block font-mono text-[11px] text-slate-300 uppercase mb-1.5 tracking-wider font-semibold"
                          htmlFor="fullName"
                        >
                          Full Name <span className="text-[#10b981]">*</span>
                        </label>
                        <input
                          className="w-full bg-[#10131a] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:bg-[#191c22] focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] shadow-inner border border-[#1d2026] transition-all"
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
                          className="block font-mono text-[11px] text-slate-300 uppercase mb-1.5 tracking-wider font-semibold"
                          htmlFor="email"
                        >
                          Email Address <span className="text-[#10b981]">*</span>
                        </label>
                        <input
                          className="w-full bg-[#10131a] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:bg-[#191c22] focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] shadow-inner border border-[#1d2026] transition-all"
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
                          className="block font-mono text-[11px] text-slate-300 uppercase mb-1.5 tracking-wider font-semibold"
                          htmlFor="experience"
                        >
                          Trading Experience <span className="text-[#10b981]">*</span>
                        </label>
                        <select
                          className="w-full bg-[#10131a] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:bg-[#191c22] focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] shadow-inner border border-[#1d2026] transition-all"
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
                          className="block font-mono text-[11px] text-slate-300 uppercase mb-1.5 tracking-wider font-semibold"
                          htmlFor="targetGoal"
                        >
                          Target Goal <span className="text-[#10b981]">*</span>
                        </label>
                        <select
                          className="w-full bg-[#10131a] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:bg-[#191c22] focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] shadow-inner border border-[#1d2026] transition-all"
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
                          className="block font-mono text-[11px] text-slate-300 uppercase mb-1.5 tracking-wider font-semibold"
                          htmlFor="message"
                        >
                          Message <span className="text-[#10b981]">*</span>
                        </label>
                        <textarea
                          className="w-full bg-[#10131a] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:bg-[#191c22] focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] shadow-inner border border-[#1d2026] resize-none transition-all"
                          id="message"
                          placeholder="How can our desk help you?"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <div className="pt-2">
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
                        <div className="p-4 bg-[#0d2e18]/90 border border-[#10b981]/50 rounded-lg flex items-start gap-3 animate-in fade-in duration-300">
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
                  <p className="font-mono text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    Desk Response SLA
                  </p>
                  <p className="text-3xl font-extrabold text-[#10b981] mt-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    2h Avg SLA
                  </p>
                </div>
                <div className="bg-[#191c22]/95 backdrop-blur-md border border-[#1d2026] p-6 rounded-xl text-center shadow-xl hover:border-[#10b981]/40 transition-all">
                  <p className="font-mono text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    Verified Track Record
                  </p>
                  <p className="text-3xl font-extrabold text-[#10b981] mt-2 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    1,840+ Funded Students
                  </p>
                </div>
                <div className="bg-[#191c22]/95 backdrop-blur-md border border-[#1d2026] p-6 rounded-xl text-center shadow-xl hover:border-[#10b981]/50 transition-all">
                  <p className="font-mono text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    Current Cohort Allocation
                  </p>
                  <p className="text-3xl font-extrabold text-[#4edea3] mt-2 drop-shadow-[0_0_12px_rgba(78,222,163,0.3)]">
                    Batch 12: 8 Seats Left
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
