import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark" | "alpha" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, variant = "primary", size = "md", children, className, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold tracking-tight transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3.5 text-base",
    }[size];

    const variantStyles = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
      secondary:
        "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
      outline:
        "bg-transparent text-foreground border border-border hover:bg-muted",
      ghost:
        "text-muted-foreground hover:text-foreground hover:bg-muted",
      dark:
        "bg-card border border-border text-foreground hover:bg-muted",
      alpha:
        "bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#1D4ED8] text-white border border-blue-300/30 shadow-md hover:shadow-lg hover:-translate-y-0.5",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
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
