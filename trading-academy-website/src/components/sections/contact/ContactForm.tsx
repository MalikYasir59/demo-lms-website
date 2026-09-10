"use client";

import React, { useState } from "react";
import { Send, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { ContactFormData } from "@/types";

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    courseTrack: "Quantitative Masterclass Enrollment",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setResponseMsg(data.message);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          courseTrack: "Quantitative Masterclass Enrollment",
          message: "",
        });
      } else {
        setStatus("error");
        setResponseMsg(data.message || "Failed to transmit message. Please try again.");
      }
    } catch {
      setStatus("error");
      setResponseMsg("Network communication error. Please try again or call the desk directly.");
    }
  };

  return (
    <div className="bg-brand-navy-card border border-slate-700/80 p-6 sm:p-8 lg:p-10 rounded-2xl flex flex-col gap-8 shadow-2xl relative">
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>ADMISSIONS INTAKE</span>
        </div>
        <h2 className="font-extrabold text-white text-2xl tracking-tight">
          Send an Inquiry
        </h2>
        <p className="text-sm text-slate-400">
          Fill out your profile and specific focus areas below.
        </p>
      </div>

      {status === "success" ? (
        <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col items-center text-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-12 h-12 text-brand-emerald" />
          <h3 className="text-lg font-bold text-white">Transmission Confirmed</h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md">{responseMsg}</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-2 text-xs font-mono text-emerald-400 underline hover:text-emerald-300"
          >
            Submit another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {status === "error" && (
            <div className="p-4 rounded-lg bg-rose-950/50 border border-rose-800 flex items-center gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{responseMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase font-bold text-slate-300">
              Full Name
            </label>
            <input
              className="bg-brand-navy-surface border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all shadow-sm"
              placeholder="Alexander Vance"
              required
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase font-bold text-slate-300">
                Work / Personal Email
              </label>
              <input
                className="bg-brand-navy-surface border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all shadow-sm"
                placeholder="vance@capital.com"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase font-bold text-slate-300">
                Phone Number
              </label>
              <input
                className="bg-brand-navy-surface border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all shadow-sm"
                placeholder="+1 (555) 019-2834"
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase font-bold text-slate-300">
              Select Course / Track
            </label>
            <select
              className="bg-brand-navy-surface border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all shadow-sm"
              value={formData.courseTrack}
              onChange={(e) => setFormData({ ...formData, courseTrack: e.target.value })}
            >
              <option value="Quantitative Masterclass Enrollment">
                Quantitative Masterclass Enrollment
              </option>
              <option value="Institutional Terminal Feed">
                Institutional Terminal Feed
              </option>
              <option value="Private Desk Mentorship">
                Private Desk Mentorship
              </option>
              <option value="Algorithmic Trading Systems">
                Algorithmic Trading Systems
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase font-bold text-slate-300">
              Message
            </label>
            <textarea
              className="bg-brand-navy-surface border border-slate-700 rounded-lg p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all resize-none shadow-sm"
              placeholder="Describe your trading experience and goals..."
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button
            className="w-full py-4 rounded-lg bg-brand-emerald text-white font-bold text-sm uppercase tracking-wider hover:bg-brand-emerald-hover transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group disabled:opacity-50"
            type="submit"
            disabled={status === "loading"}
          >
            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span>{status === "loading" ? "Transmitting..." : "Send Message"}</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Your information is 100% confidential</span>
          </div>
        </form>
      )}
    </div>
  );
}

