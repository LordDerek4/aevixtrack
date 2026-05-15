"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { BarChart3, CreditCard, LogOut, Search, Settings, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Subscriptions", href: "/dashboard#subscriptions", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const userEmail = user?.emailAddresses[0]?.emailAddress ?? null;
  const userInitials = user?.firstName
    ? (user.firstName[0] + (user.lastName?.[0] ?? "")).toUpperCase()
    : userEmail?.[0]?.toUpperCase() ?? "?";

  async function handleSignOut() {
    await signOut({ redirectUrl: "/" });
    toast.success("Signed out");
  }

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-black/[0.36] px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <Logo />

      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-3">
        <div className="flex items-center gap-3 rounded-2xl bg-black/30 px-3 py-2 text-sm text-white/[0.46]">
          <Search className="size-4" />
          Quick search
        </div>
      </div>

      <nav className="mt-6 grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = !item.href.includes("#") && pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/[0.58] transition hover:bg-white/[0.08] hover:text-white",
                active && "bg-white/10 text-white"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[28px] border border-white/10 bg-gradient-to-br from-white/12 to-white/[0.03] p-5">
        <Sparkles className="size-5 text-fog" />
        <p className="mt-4 text-sm font-medium text-white">Trial watch is active</p>
        <p className="mt-1 text-xs leading-5 text-white/50">
          AevixTrack keeps upcoming renewals and trial endings surfaced.
        </p>
      </div>

      {userEmail && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-fog/20 text-xs font-semibold text-fog">
            {userInitials}
          </span>
          <span className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white/80">{userEmail}</p>
            <p className="text-[10px] text-white/40">Signed in</p>
          </span>
        </div>
      )}

      <button
        onClick={handleSignOut}
        className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/[0.58] transition hover:bg-white/[0.08] hover:text-white"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </aside>
  );
}
