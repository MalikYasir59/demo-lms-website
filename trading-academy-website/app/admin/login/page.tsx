"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  Users,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

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
    <div className="min-h-screen grid lg:grid-cols-2 relative bg-background">
      {/* Top right floating theme toggle */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle variant="dropdown" />
      </div>

      {/* ====================================================================
          LEFT BRANDED PANEL (Desktop only)
          ==================================================================== */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-primary/15 via-muted/50 to-background border-r border-border relative overflow-hidden select-none">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid-pattern-admin" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-admin)" />
          </svg>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Logo */}
        <div className="relative z-10">
          <BrandLogo size="lg" variant="full" subtitle="Master Authority Console" href="/" />
        </div>

        {/* Value Proposition & Security Highlights */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent-foreground text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-foreground" />
              <span>Restricted Staff Operations</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Institute Governance & LMS Operations
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Complete administrative authority over students, curriculum architecture, real-time security enforcement, and business intelligence telemetries.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-card/80 border border-border backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Anti-Tamper & Security Monitoring</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Real-time detection of devtools, screen recorders, concurrent sessions, and anomalous IP geolocations.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-card/80 border border-border backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Student Roster & Enrollments</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Lifecycle management, access provisioning, ticket generation, and individual completion audits.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-card/80 border border-border backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent-foreground flex items-center justify-center shrink-0 mt-0.5">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Curriculum Orchestration</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  YouTube video ID verification, drip scheduling, module reordering, and publishing controls.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground pt-6 border-t border-border/70">
          <span>&copy; {new Date().getFullYear()} Institute of Trading Tricks</span>
          <span className="font-mono text-[10px]">AUTHORIZED PERSONNEL ONLY</span>
        </div>
      </div>

      {/* ====================================================================
          RIGHT LOGIN FORM (All screen sizes)
          ==================================================================== */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between pb-6 mb-4 border-b border-border">
          <BrandLogo size="md" variant="full" subtitle="Staff Console" href="/" />
        </div>

        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          {/* Form Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/20 text-accent-foreground border border-accent/40 text-[11px] font-semibold tracking-wide uppercase font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Staff Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Admin Console Access
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Enter your master administrator credentials to access the management terminal.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 flex items-start gap-3 text-destructive text-xs leading-relaxed animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-foreground tracking-wide font-mono uppercase"
              >
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@tradingtricks.institute"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-card border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-foreground tracking-wide font-mono uppercase"
              >
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-card border border-input rounded-xl pl-10 pr-11 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-primary transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition-all shadow-md shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
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

          {/* Security Audit Notice */}
          <div className="pt-4 border-t border-border space-y-2 text-center">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Security Audit:</span> Administrative sessions are strictly audited, rate-limited, and forensic IP telemetry is logged on each attempt.
            </p>
          </div>
        </div>

        {/* Mobile footer */}
        <div className="pt-6 text-center text-xs text-muted-foreground lg:hidden">
          &copy; {new Date().getFullYear()} Institute of Trading Tricks
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
