"use client";

import React, { useState } from "react";
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
      {/* 2. CONTACT FORM & INFO COLUMNS                                      */}
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

          {/* Right Column: Direct Contact Details, Hours, Brochure & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-[#D4C385]">📞</span>
                <a href="tel:+923340505473" className="hover:text-[#E5D7A3] transition">
                  +92 334 0505473
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#D4C385]">📞</span>
                <a href="tel:+923340505474" className="hover:text-[#E5D7A3] transition">
                  +92 334 0505474
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#D4C385]">📞</span>
                <a href="tel:+923077330777" className="hover:text-[#E5D7A3] transition">
                  +92 307 7330777
                </a>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[#D4C385]">💬</span>
                <a
                  href="https://wa.me/923077330777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E5D7A3] transition text-[#D4C385]"
                >
                  Chat on WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[#D4C385]">✉</span>
                <a
                  href="mailto:instituteoftradingtricks@gmail.com"
                  className="hover:text-[#E5D7A3] transition"
                >
                  instituteoftradingtricks@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3 pt-1">
                <span className="text-[#D4C385] mt-0.5">📍</span>
                <span className="leading-relaxed text-slate-300">
                  3rd Floor, Gul Arcade Plaza, Opposite London Bakery, Main PWD Road, PWD Housing Society, Islamabad 44000
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Classes also run in Wah Cantt and Attock · ask us for the next dates there.
            </p>

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
