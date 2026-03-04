"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";


export const uiColors = {
  bgBase: "#0D0F14",
  bgElevated: "#151922",
  bgHover: "#1B2130",
  borderSubtle: "rgba(255,255,255,0.06)",
  accentPrimary: "#A6E22E",
  accentSecondary: "#66D9EF",
  warning: "#FD971F",
  error: "#F92672",
  textStrong: "#F5F7FF",
  textMuted: "rgba(255,255,255,0.6)",
} as const;

export const motionTokens = {
  pageTransition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  hoverScale: 1.02,
  hoverDuration: 0.18,
} as const;


export function AppCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[${uiColors.borderSubtle}] bg-[#151922] shadow-[0_18px_45px_rgba(0,0,0,0.6)] ${className}`}
    >
      {children}
    </div>
  );
}



type ButtonVariant = "primary" | "secondary" | "ghost";

interface AppButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function AppButton({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  ...props
}: AppButtonProps) {
  const base =
    "cursor-pointer inline-flex items-center justify-center rounded-xl text-md font-medium transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0F14]";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[#A6E22E] text-[#0D0F14] hover:brightness-105 active:scale-95 disabled:opacity-60 disabled:hover:brightness-100",
    secondary:
      "border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.8)] hover:bg-[#1B2130] disabled:opacity-60",
    ghost:
      "text-[rgba(255,255,255,0.8)] hover:bg-[#1B2130]/70 disabled:opacity-60",
  };

  return (
    <motion.button
      whileHover={!props.disabled ? { scale: motionTokens.hoverScale } : undefined}
      whileTap={!props.disabled ? { scale: 0.97 } : undefined}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}


export function AppBadge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[rgba(255,255,255,0.08)] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[rgba(255,255,255,0.7)] ${className}`}
    >
      {children}
    </span>
  );
}


interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export function AppInput({
  label,
  helperText,
  className = "",
  ...props
}: AppInputProps) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="block text-[13px] font-medium text-[rgba(255,255,255,0.85)]">
          {label}
        </label>
      ) : null}

      <input
        className={`h-12 w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0F131B] px-3 text-md text-[${uiColors.textStrong}] placeholder:text-[rgba(255,255,255,0.35)] outline-none transition focus:border-[#66D9EF] focus:ring-1 focus:ring-[#66D9EF] ${className}`}
        {...props}
      />

      {helperText ? (
        <p className="text-xs leading-relaxed text-[rgba(255,255,255,0.65)]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}


export function AppCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="inline-flex items-center gap-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#151922] px-3 py-2 text-[13px] text-[rgba(255,255,255,0.88)] transition hover:bg-[#1B2130]"
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-[6px] border ${
          checked
            ? "border-[#A6E22E] bg-[#A6E22E]"
            : "border-[rgba(255,255,255,0.35)] bg-transparent"
        }`}
      >
        {checked && (
          <span className="h-2 w-2 rounded-[3px] bg-[#0D0F14]" />
        )}
      </span>

      <span>{label}</span>
    </button>
  );
}



export function AppSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gradient-to-r from-[#151922] via-[#1B2130] to-[#151922] bg-[length:200%_100%] ${className}`}
    />
  );
}