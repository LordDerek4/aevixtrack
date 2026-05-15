import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-white text-black hover:bg-fog",
  secondary: "bg-white/10 text-white hover:bg-white/15",
  ghost: "bg-transparent text-white/70 hover:bg-white/10 hover:text-white",
  danger: "bg-red-500/15 text-red-100 hover:bg-red-500/25"
};

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-fog/40 disabled:pointer-events-none disabled:opacity-50";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  children: ReactNode;
};

export function LinkButton({ className, variant = "primary", ...props }: LinkButtonProps) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
