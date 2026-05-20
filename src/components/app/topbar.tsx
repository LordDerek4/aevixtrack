"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ApiNotification {
  id: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
  subscription?: { serviceName: string } | null;
}

interface TopbarProps {
  onCreate?: () => void;
  title?: string;
  description?: string;
  badge?: string;
}

export function Topbar({
  onCreate,
  title = "Subscription command center",
  description = "Track renewals, free trials, and monthly spend before they quietly turn into budget fog.",
  badge = "Protected dashboard"
}: TopbarProps) {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    fetch("/api/notifications?limit=15")
      .then((r) => (r.ok ? r.json() : []))
      .then(setNotifications)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function openBell() {
    setOpen((v) => !v);
    if (unread > 0) {
      fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }

  function relativeTime(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 px-3 py-1 text-xs font-medium text-white/70">
          <ShieldCheck className="size-3.5" />
          {badge}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-white/[0.56] sm:block md:text-base">
          {description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 self-start">
        {/* Notification bell */}
        <div ref={ref} className="relative">
          <button
            onClick={openBell}
            className="relative grid size-11 place-items-center rounded-2xl border border-green-500/20 text-white/60 transition hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {unread > 0 && (
              <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-fog text-[9px] font-bold text-black">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-14 z-50 w-80 rounded-[20px] border border-green-500/20 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                {unread === 0 && notifications.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-white/40">
                    <Check className="size-3" /> All read
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-white/40">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "border-b border-white/[0.05] px-4 py-3 last:border-0",
                        !n.read && "bg-white/[0.03]"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && (
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-fog" />
                        )}
                        <div className={cn("min-w-0", !n.read ? "" : "pl-3.5")}>
                          <p className="text-xs leading-5 text-white/80">{n.message}</p>
                          <p className="mt-0.5 text-[10px] text-white/30">
                            {relativeTime(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {onCreate && (
          <Button onClick={onCreate} className="self-start">
            <Plus className="size-4" />
            Add subscription
          </Button>
        )}
      </div>
    </div>
  );
}
