"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/dashboard#subscriptions", icon: CreditCard, label: "Subscriptions" },
  { href: "/settings", icon: Settings, label: "Settings" }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 grid grid-cols-3 rounded-full border border-green-500/25 bg-black/25 p-2 shadow-soft backdrop-blur-xl lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = !item.href.includes("#") && pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
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
