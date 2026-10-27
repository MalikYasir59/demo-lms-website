import React from "react";
import Link from "next/link";
import { PUBLIC_ASSETS } from "@/data/public-assets";

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
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <a
                href="https://www.youtube.com/results?search_query=Institute+of+Trading+Tricks+Islamabad"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4C385] transition"
              >
                YouTube
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4C385] transition"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/Instituteoftradingtricks/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4C385] transition"
              >
                Facebook
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4C385] transition"
              >
                TikTok
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
