import Link from "next/link";
import { ArrowUpRight, UserRound } from "lucide-react";
import { Logo } from "@/components/logo";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" }
];

export function MarketingNav() {
  return (
    <header className="mx-auto flex w-full max-w-[1510px] items-center justify-between gap-4 px-5 py-6 md:px-10">
      <Logo />
      <nav className="glass hidden items-center gap-1 rounded-full p-1 md:flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-4 py-2 text-sm font-medium text-white/76 transition hover:bg-white/10 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
        >
          Open App
          <ArrowUpRight className="size-3.5" />
        </Link>
      </nav>
      <Link
        href="/register"
        className="inline-flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-white/[0.86] transition hover:bg-white/10 md:px-4"
      >
        <UserRound className="size-5" />
        <span className="hidden sm:inline">Create Account</span>
      </Link>
    </header>
  );
}
