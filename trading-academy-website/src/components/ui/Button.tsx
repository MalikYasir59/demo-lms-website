import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, variant = "primary", size = "md", children, className, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3.5 text-base",
    }[size];

    const variantStyles = {
      primary:
        "bg-brand-emerald hover:bg-brand-emerald-hover text-white shadow-lg shadow-emerald-500/20",
      secondary:
        "bg-brand-royal hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
      outline:
        "border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white bg-slate-900/50 hover:bg-slate-800/80",
      ghost:
        "text-slate-300 hover:text-white hover:bg-slate-800/50",
      dark:
        "bg-[#0c1220] border border-slate-700 hover:border-slate-500 text-white hover:bg-slate-900",
    }[variant];

    const combinedClassName = cn(baseStyles, sizeStyles, variantStyles, className);

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

