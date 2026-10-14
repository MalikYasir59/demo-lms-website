"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

function StudentLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/student/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // Generate or retrieve persistent local deviceId
      let deviceId = "";
      if (typeof window !== "undefined") {
        deviceId = localStorage.getItem("itt_device_id") || "";
        if (!deviceId) {
          deviceId = "dev_" + Math.random().toString(36).substring(2, 15);
          localStorage.setItem("itt_device_id", deviceId);
        }
      }

      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        deviceId,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        toast.error("Sign in failed", { description: res.error });
        setLoading(false);
        return;
      }

      toast.success("Welcome back!", { description: "Session authenticated successfully." });
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f17]/90 border border-[#1e293b] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Student Portal Sign In</h1>
        <p className="text-sm text-[#94a3b8] mt-1.5">
          Access your quantitative price action lectures & telemetries
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs leading-relaxed animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-2 font-mono">
            Institutional Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-2 font-mono">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#cbd5e1] transition-colors p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] text-black font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-[#10b981]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-[#1e293b]/70 text-center">
        <p className="text-[11px] text-[#64748b] leading-relaxed">
          <span className="font-semibold text-[#94a3b8]">Single-Device Policy:</span> Signing in on this device will automatically replace any existing active streaming sessions.
        </p>
      </div>
    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full p-8 text-center bg-[#0b0f17]/90 border border-[#1e293b] rounded-2xl text-[#94a3b8]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#10b981]" />
          <p className="mt-3 text-xs">Loading authentication interface...</p>
        </div>
      }
    >
      <StudentLoginForm />
    </Suspense>
  );
}
