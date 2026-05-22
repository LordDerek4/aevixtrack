"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, CreditCard, LogOut, Search, Settings, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3, scroll: null },
  { label: "Subscriptions", href: "/subscriptions", icon: CreditCard, scroll: null },
  { label: "Settings", href: "/settings", icon: Settings, scroll: null }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const displayName = user?.user_metadata?.username ?? user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "User";
  const userInitials = displayName.slice(0, 2).toUpperCase();

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

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/");
  }

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-green-500/10 px-5 py-6 lg:flex lg:flex-col">
      <Logo />

      <div className="mt-8 p-3">
        <div className="flex items-center gap-3 rounded-2xl border border-green-500/20 px-3 py-2 text-sm text-white/50">
          <Search className="size-4" />
          Quick search
        </div>
      </div>

      <nav className="mt-6 grid gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href && !item.scroll;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/60 transition hover:text-white",
                active && "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-5">
        <Sparkles className="size-5 text-green-400" />
        <p className="mt-4 text-sm font-medium text-white drop-shadow">Trial watch is active</p>
        <p className="mt-1 text-xs leading-5 text-white/50">
          AevixTrack keeps upcoming renewals and trial endings surfaced.
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3 px-4 py-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-green-500/30 text-xs font-semibold text-green-400">
          {userInitials}
        </span>
        <span className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-white/80">{displayName}</p>
          <p className="text-[10px] text-white/40">Signed in</p>
        </span>
      </div>

      <button
        onClick={handleSignOut}
        className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/50 transition hover:text-white"
      >
        <LogOut className="size-4" />
        Sign out
      </button>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 px-4 pb-2">
        {[
          { label: "Support", href: "/support" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ].map(({ label, href }) => (
          <Link key={href} href={href} className="text-[11px] text-white/25 hover:text-white/60 transition-colors">
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
