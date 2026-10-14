import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080b11] text-[#e0e2eb] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-ambient-glow opacity-50" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#6366f1]/15 to-[#10b981]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header with Brand */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-[#121824] border border-[#1e293b] flex items-center justify-center text-[#10b981] group-hover:border-[#10b981]/50 transition-colors">
            <span className="font-mono font-bold text-lg">ITT</span>
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide text-white">INSTITUTE OF TRADING TRICKS</div>
            <div className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">Learning Management System</div>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121824]/80 border border-[#1e293b] text-xs text-[#94a3b8]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Encrypted Session</span>
        </div>
      </header>

      {/* Main card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-[#64748b]">
        <p>&copy; {new Date().getFullYear()} Institute of Trading Tricks. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-[#475569]">
          Unauthorized access attempts are logged with forensic client telemetry.
        </p>
      </footer>
    </div>
  );
}
