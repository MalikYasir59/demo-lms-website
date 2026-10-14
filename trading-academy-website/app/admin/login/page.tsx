"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldAlert, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter administrator credentials.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        deviceId: "admin_console",
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        toast.error("Authentication rejected", { description: res.error });
        setLoading(false);
        return;
      }

      toast.success("Administrator Verified", { description: "Launching LMS Console..." });
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected authentication error occurred.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f17]/95 border border-[#1e293b] rounded-2xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black">
      <div className="flex justify-center mb-5">
        <div className="w-12 h-12 rounded-xl bg-[#121824] border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b] shadow-lg shadow-[#f59e0b]/10">
          <ShieldAlert className="w-6 h-6" />
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
        <p className="text-xs text-[#94a3b8] mt-1 font-mono uppercase tracking-wider">
          Institute of Trading Tricks &bull; Restricted Area
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
            Admin Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="admin@tradingtricks.institute"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider mb-2 font-mono">
            Master Password
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
              className="w-full bg-[#121824] border border-[#1e293b] rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-[#475569] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all font-mono"
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
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-[#6366f1]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authorizing console...</span>
              </>
            ) : (
              <>
                <span>Enter Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-[#1e293b]/70 text-center">
        <p className="text-[11px] text-[#64748b]">
          Administrative sessions are strictly audited and geo-monitored.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-[#e0e2eb] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-ambient-glow opacity-60" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-[#6366f1]/20 to-[#f59e0b]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Suspense
          fallback={
            <div className="w-full p-8 text-center bg-[#0b0f17]/95 border border-[#1e293b] rounded-2xl text-[#94a3b8]">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#6366f1]" />
              <p className="mt-3 text-xs">Loading admin console interface...</p>
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
