import React from "react";
import Link from "next/link";
import { PUBLIC_ASSETS } from "@/data/public-assets";
import { SOCIAL_LINKS } from "@/data/nav-links";

export default function Footer() {
  return (
    <footer className="bg-[#040714] border-t border-white/10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & Socials */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PUBLIC_ASSETS.logo}
                alt="Institute of Trading Tricks"
                className="w-8 h-8 rounded-full object-cover border border-[#D4C385]/40"
              />
              <span className="font-display text-lg text-white">
                Institute of Trading Tricks
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-5">
              Institute of Trading Tricks — practical forex education for Pakistan.
            </p>
              <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400">
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Institute of Trading Tricks on YouTube"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/5 hover:border-[#D4C385]/40 hover:text-[#D4C385] hover:bg-white/10 transition group"
                >
                  <svg
                    className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>YouTube</span>
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Institute of Trading Tricks on Instagram"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/5 hover:border-[#D4C385]/40 hover:text-[#D4C385] hover:bg-white/10 transition group"
                >
                  <svg
                    className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                  <span>Instagram</span>
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Institute of Trading Tricks on Facebook"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/5 hover:border-[#D4C385]/40 hover:text-[#D4C385] hover:bg-white/10 transition group"
                >
                  <svg
                    className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Institute of Trading Tricks on TikTok"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/5 hover:border-[#D4C385]/40 hover:text-[#D4C385] hover:bg-white/10 transition group"
                >
                  <svg
                    className="w-3.5 h-3.5 text-cyan-300 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.76 1.09-.03 2.11-.64 2.66-1.59.39-.62.59-1.35.6-2.08.08-3.96.04-7.92.05-11.88z" />
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="md:col-span-3 space-y-2 text-xs text-slate-400">
              <div>
                <Link href="/courses" className="hover:text-[#D4C385] transition">
                  Courses
                </Link>
              </div>
              <div>
                <Link href="/videos" className="hover:text-[#D4C385] transition">
                  Videos
                </Link>
              </div>
              <div>
                <Link href="/about-us" className="hover:text-[#D4C385] transition">
                  About
                </Link>
              </div>
              <div>
                <Link href="/reviews" className="hover:text-[#D4C385] transition">
                  Reviews
                </Link>
              </div>
              <div>
                <Link href="/contact" className="hover:text-[#D4C385] transition">
                  Contact
                </Link>
              </div>
              <div>
                <Link href="/login" className="hover:text-[#D4C385] transition">
                  Student Login
                </Link>
              </div>
              <div>
                <Link href="/privacy-policy" className="hover:text-[#D4C385] transition text-[11px] text-slate-500">
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link href="/terms-conditions" className="hover:text-[#D4C385] transition text-[11px] text-slate-500">
                  Terms &amp; Conditions
                </Link>
              </div>
            </div>

            {/* Col 3: Contact Info */}
            <div className="md:col-span-4 space-y-2 text-xs text-slate-400">
              <div>
                <a href="tel:+923077330777" className="hover:text-[#D4C385] transition font-medium text-slate-300">
                  +92 307 7330777
                </a>
              </div>
              <div>
                <a
                  href="mailto:instituteoftradingtricks@gmail.com"
                  className="hover:text-[#D4C385] transition"
                >
                  instituteoftradingtricks@gmail.com
                </a>
              </div>
              <p className="leading-relaxed pt-1 text-slate-400">
                3rd Floor, Gul Arcade Plaza, Opposite London Bakery, Main PWD Road, PWD Housing Society, Islamabad 44000
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Campus branches: Islamabad · Wah Cantt · Attock
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 py-4 text-center text-[10px] text-slate-500 px-4">
          © 2026 itt.com.pk · Trading involves risk. Past performance does not guarantee future returns.
        </div>
    </footer>
  );
}
