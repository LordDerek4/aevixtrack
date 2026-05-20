"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: BarChart3, label: "Dashboard", scroll: null },
  { href: "/subscriptions", icon: CreditCard, label: "Subscriptions", scroll: null },
  { href: "/settings", icon: Settings, label: "Settings", scroll: null }
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  function handleNavClick(e: React.MouseEvent, item: typeof navItems[number]) {
    if (!item.scroll) return;
    e.preventDefault();
    const el = document.getElementById(item.scroll);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/dashboard#${item.scroll}`);
    }
  }

  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 grid grid-cols-3 rounded-full border border-green-500/20 bg-transparent p-2 backdrop-blur-sm lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href && !item.scroll;
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            onClick={(e) => handleNavClick(e, item)}
            className={cn(
              "grid place-items-center rounded-full py-2 transition",
              active ? "bg-white text-black" : "text-white/70 hover:text-white"
            )}
          >
            <Icon className="size-5" />
          </Link>
        );
      })}
    </nav>
  );
}
