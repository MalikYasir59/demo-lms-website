"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { PUBLIC_ASSETS } from "@/data/public-assets";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneWhatsapp: "",
    email: "",
    course: "Not sure yet",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email || "not-provided@itt.com.pk",
          phone: formData.phoneWhatsapp,
          courseInterest: formData.course,
          message: `Phone/WhatsApp: ${formData.phoneWhatsapp} | Selected Course: ${formData.course} | Message: ${formData.message}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: "Thank you! Your seat reservation request has been received. Our team will contact you shortly during opening hours.",
        });
        setFormData({
          fullName: "",
          phoneWhatsapp: "",
          email: "",
          course: "Not sure yet",
          message: "",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || "Failed to submit request. Please call or WhatsApp us directly at 0307 7330777.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "An error occurred while submitting your request. Please contact us on WhatsApp at 0307 7330777.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* =================================================================== */}
      {/* 1. PAGE HERO                                                        */}
      {/* =================================================================== */}
      <section className="hero-glow border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-[#D4C385] mb-4">
            <span className="w-5 h-px bg-[#D4C385]" />
            <span>CONTACT</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">
            Reserve your seat
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Send an enquiry and our team will get back to you during opening hours.
          </p>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. LETS CONNECT SECTION                                             */}
      {/* =================================================================== */}
      <section className="border-b border-white/10 bg-[#050919]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-6">
            Lets Connect
          </h2>

          <div className="w-full card-surface p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Row 1, Col 1: Phone Line 1 */}
              <div className="p-4 rounded bg-[#040714]/60 border border-white/5 hover:border-[#D4C385]/30 transition group flex items-center gap-3.5">
                <div className="w-9 h-9 rounded bg-[#0A1026] border border-white/10 flex items-center justify-center shrink-0 text-[#D4C385] group-hover:border-[#D4C385]/50 group-hover:text-[#E5D7A3] transition">
                  <Phone className="w-4 h-4" />
                </div>
                <a
                  href="tel:+923340505473"
                  className="text-xs sm:text-sm text-slate-200 hover:text-[#E5D7A3] transition font-medium tracking-wide"
                >
                  +92 334 0505473
                </a>
              </div>

              {/* Row 1, Col 2: Phone Line 2 */}
              <div className="p-4 rounded bg-[#040714]/60 border border-white/5 hover:border-[#D4C385]/30 transition group flex items-center gap-3.5">
                <div className="w-9 h-9 rounded bg-[#0A1026] border border-white/10 flex items-center justify-center shrink-0 text-[#D4C385] group-hover:border-[#D4C385]/50 group-hover:text-[#E5D7A3] transition">
                  <Phone className="w-4 h-4" />
                </div>
                <a
                  href="tel:+923340505474"
                  className="text-xs sm:text-sm text-slate-200 hover:text-[#E5D7A3] transition font-medium tracking-wide"
                >
                  +92 334 0505474
                </a>
              </div>

              {/* Row 2, Col 1: Mobile Line */}
              <div className="p-4 rounded bg-[#040714]/60 border border-white/5 hover:border-[#D4C385]/30 transition group flex items-center gap-3.5">
                <div className="w-9 h-9 rounded bg-[#0A1026] border border-white/10 flex items-center justify-center shrink-0 text-[#D4C385] group-hover:border-[#D4C385]/50 group-hover:text-[#E5D7A3] transition">
                  <Phone className="w-4 h-4" />
                </div>
                <a
                  href="tel:+923077330777"
                  className="text-xs sm:text-sm text-slate-200 hover:text-[#E5D7A3] transition font-medium tracking-wide"
                >
                  +92 307 7330777
                </a>
              </div>

              {/* Row 2, Col 2: WhatsApp Chat */}
              <div className="p-4 rounded bg-[#040714]/60 border border-white/5 hover:border-[#25D366]/40 transition group flex items-center gap-3.5">
                <div className="w-9 h-9 rounded bg-[#0A1026] border border-white/10 flex items-center justify-center shrink-0 text-[#25D366] group-hover:border-[#25D366]/50 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.82 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.83-.11-.42-.13-.97-.31-1.67-.61-2.94-1.27-4.86-4.25-5.01-4.45-.15-.2-1.2-1.59-1.2-3.04 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.82 2.01.89 2.16.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.47.12.65-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.08.12.08.72-.16 1.4z" />
                  </svg>
                </div>
                <a
                  href="https://wa.me/923077330777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-[#D4C385] hover:text-[#E5D7A3] transition font-medium flex items-center gap-1.5"
                >
                  <span>Chat on WhatsApp</span>
                  <span className="text-[11px] text-slate-400 group-hover:translate-x-0.5 transition-transform">↗</span>
                </a>
              </div>

              {/* Row 3, Col 1: Email */}
              <div className="p-4 rounded bg-[#040714]/60 border border-white/5 hover:border-[#D4C385]/30 transition group flex items-center gap-3.5">
                <div className="w-9 h-9 rounded bg-[#0A1026] border border-white/10 flex items-center justify-center shrink-0 text-[#D4C385] group-hover:border-[#D4C385]/50 group-hover:text-[#E5D7A3] transition">
                  <Mail className="w-4 h-4" />
                </div>
                <a
                  href="mailto:instituteoftradingtricks@gmail.com"
                  className="text-xs sm:text-sm text-slate-200 hover:text-[#E5D7A3] transition font-medium break-all"
                >
                  instituteoftradingtricks@gmail.com
                </a>
              </div>

              {/* Row 3, Col 2: Campus Address */}
              <div className="p-4 rounded bg-[#040714]/60 border border-white/5 hover:border-[#D4C385]/30 transition group flex items-start gap-3.5">
                <div className="w-9 h-9 rounded bg-[#0A1026] border border-white/10 flex items-center justify-center shrink-0 text-[#D4C385] group-hover:border-[#D4C385]/50 group-hover:text-[#E5D7A3] transition mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm leading-relaxed text-slate-300">
                  3rd Floor, Gul Arcade Plaza, Opposite London Bakery, Main PWD Road, PWD Housing Society, Islamabad 44000
                </span>
              </div>
            </div>

            {/* Wah Cantt & Attock branch note */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4C385] shrink-0" />
              <span>Classes also run in Wah Cantt and Attock · ask us for the next dates there.</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. CONTACT FORM & INFO COLUMNS                                      */}
      {/* =================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Enrollment Form Card */}
          <div className="lg:col-span-7 card-surface p-6 sm:p-8">
            {statusMessage && (
              <div
                className={`mb-6 p-4 rounded text-xs leading-relaxed ${
                  statusMessage.type === "success"
                    ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300"
                    : "bg-rose-950/80 border border-rose-500/50 text-rose-300"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-[11px] text-slate-300 mb-1.5">
                    Full name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Muhammad Ali"
                    className="w-full bg-[#040714] border border-white/10 focus:border-[#D4C385] text-xs text-white px-3.5 py-2.5 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="phoneWhatsapp" className="block text-[11px] text-slate-300 mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="phoneWhatsapp"
                    name="phoneWhatsapp"
                    type="tel"
                    required
                    value={formData.phoneWhatsapp}
                    onChange={handleChange}
                    placeholder="0307 7330777"
                    className="w-full bg-[#040714] border border-white/10 focus:border-[#D4C385] text-xs text-white px-3.5 py-2.5 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-[11px] text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#040714] border border-white/10 focus:border-[#D4C385] text-xs text-white px-3.5 py-2.5 focus:outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="course" className="block text-[11px] text-slate-300 mb-1.5">
                  Course
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full bg-[#040714] border border-white/10 focus:border-[#D4C385] text-xs text-white px-3.5 py-2.5 focus:outline-none transition"
                >
                  <option value="Not sure yet">Not sure yet</option>
                  <option value="Basic (Beginner)">Basic (Beginner)</option>
                  <option value="Advance (Intermediate)">Advance (Intermediate)</option>
                  <option value="Pro Trading Course (Advanced)">Pro Trading Course (Advanced)</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Website Development">Website Development</option>
                  <option value="E-Commerce">E-Commerce</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-[11px] text-slate-300 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your trading experience or questions..."
                  className="w-full bg-[#040714] border border-white/10 focus:border-[#D4C385] text-xs text-white px-3.5 py-2.5 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4C385] hover:bg-[#E5D7A3] text-[#040714] font-semibold text-[10px] tracking-[0.2em] uppercase py-3.5 transition disabled:opacity-60"
              >
                {loading ? "TRANSMITTING ENQUIRY..." : "SEND ENROLLMENT REQUEST"}
              </button>
            </form>
          </div>

          {/* Right Column: Opening Hours, Brochure & Map */}
          <div className="lg:col-span-5 space-y-6">

            {/* Opening Hours Box */}
            <div className="card-surface p-5">
              <div className="text-xs font-medium text-white mb-3">Opening hours</div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Monday</span>
                  <span className="text-slate-300">10:00 am – 8:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tuesday</span>
                  <span className="text-slate-300">10:00 am – 8:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wednesday</span>
                  <span className="text-slate-300">11:00 am – 8:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thursday</span>
                  <span className="text-slate-300">11:00 am – 9:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Friday</span>
                  <span className="text-slate-300">11:00 am – 9:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Saturday</span>
                  <span className="text-slate-300">11:00 am – 9:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sunday</span>
                  <span className="text-rose-400 font-medium">Closed</span>
                </div>
              </div>
            </div>

            {/* Download Brochure Link */}
            <div>
              <a
                href="mailto:instituteoftradingtricks@gmail.com?subject=Request%20Course%20Brochure"
                className="flex items-center gap-2.5 text-xs text-slate-200 hover:text-[#D4C385] transition"
              >
                <span className="text-[#D4C385]">↓</span>
                <span>Download the course brochure</span>
              </a>
            </div>

            {/* Map Card */}
            <div className="border border-white/10 bg-[#040714] overflow-hidden">
              <div className="p-3 pb-4 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Islamabad Campus</span>
                <a
                  href="https://www.google.com/maps/search/Gul+Arcade+Plaza+PWD+Road+Islamabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-white text-[#1D4ED8] text-[10px] font-medium px-2.5 py-1 rounded-sm shadow hover:bg-slate-100 transition"
                >
                  <span>Open in Maps</span>
                  <span>↗</span>
                </a>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PUBLIC_ASSETS.contactMap}
                alt="PWD Housing Society Islamabad Map"
                className="w-full h-32 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
