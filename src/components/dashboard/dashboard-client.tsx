"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CircleDollarSign,
  CreditCard,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  WifiOff,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/app/topbar";
import { SubscriptionForm } from "@/components/dashboard/subscription-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { categories } from "@/lib/constants";
import { type SubscriptionRecord } from "@/lib/validations";
import { cn, daysUntil, formatCurrency, serviceInitials } from "@/lib/utils";
import type { SubscriptionInput } from "@/lib/validations";

type SortKey = "renewalDate" | "cost" | "serviceName";
type StatusFilter = "All" | "ACTIVE" | "CANCELLED" | "ARCHIVED";

function isActive(sub: SubscriptionRecord) {
  return sub.status === "ACTIVE";
}

function monthlyValue(sub: SubscriptionRecord) {
  return sub.billingCycle === "YEARLY" ? Number(sub.cost) / 12 : Number(sub.cost);
}

function urgencyClass(days: number) {
  if (days <= 2) return "bg-red-500/15 text-red-300 border-red-500/20";
  if (days <= 7) return "bg-amber-500/15 text-amber-300 border-amber-500/20";
  return "bg-emerald-500/10 text-emerald-400 border-emerald-500/15";
}

function urgencyDot(days: number) {
  if (days <= 2) return "bg-red-400";
  if (days <= 7) return "bg-amber-400";
  return "bg-emerald-400";
}

function LogoBadge({ name }: { name: string }) {
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-white to-fog text-sm font-bold text-black shadow-glow">
      {serviceInitials(name)}
    </span>
  );
}

function TrialProgress({ subscription }: { subscription: SubscriptionRecord }) {
  if (!subscription.isFreeTrial || !subscription.trialEndsAt) return null;
  const remaining = Math.max(0, daysUntil(subscription.trialEndsAt));
  const elapsed = subscription.createdAt ? Math.max(0, -daysUntil(subscription.createdAt)) : 0;
  const total = elapsed + remaining;
  const progress = total > 0 ? Math.round((elapsed / total) * 100) : 100;

  return (
    <div className="mt-4">
      <div className="mb-2 flex justify-between text-xs text-white/[0.48]">
        <span>Trial progress</span>
        <span>{remaining} days left</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.08]">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            remaining <= 2 ? "bg-red-400" : remaining <= 7 ? "bg-amber-400" : "bg-fog"
          )}
          style={{ width: `${Math.max(4, progress)}%` }}
        />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mt-8 flex min-h-[480px] flex-col items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.02] p-12 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-white/[0.06]">
        <WifiOff className="size-7 text-white/30" />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Unable to load subscriptions</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-white/50">
        Could not reach the database. Make sure your{" "}
        <code className="rounded bg-white/10 px-1 py-0.5 text-xs">DATABASE_URL</code>{" "}
        is set in your environment variables and try again.
      </p>
      <Button onClick={onRetry} variant="secondary" className="mt-6">
        <RefreshCw className="size-4" />
        Retry
      </Button>
    </div>
  );
}

export function DashboardClient() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sort, setSort] = useState<SortKey>("renewalDate");
  const [editing, setEditing] = useState<SubscriptionRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function retry() {
    setHasError(false);
    setLoading(true);
    load();
  }

  async function load() {
    try {
      const [subsRes, settingsRes] = await Promise.all([
        fetch("/api/subscriptions"),
        fetch("/api/settings")
      ]);
      if (!subsRes.ok) throw new Error("Failed to load subscriptions");
      const data = (await subsRes.json()) as SubscriptionRecord[];
      setSubscriptions(data);
      setHasError(false);
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        if (settings.currency) setCurrency(settings.currency);
      }
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const [subsRes, settingsRes] = await Promise.all([
          fetch("/api/subscriptions"),
          fetch("/api/settings")
        ]);
        if (!subsRes.ok) throw new Error("Failed to load");
        const data = (await subsRes.json()) as SubscriptionRecord[];
        if (mounted) { setSubscriptions(data); setHasError(false); }
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          if (mounted && settings.currency) setCurrency(settings.currency);
        }
      } catch {
        if (mounted) setHasError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => {
    const active = subscriptions.filter(isActive);
    const monthly = active.reduce((sum, s) => sum + monthlyValue(s), 0);
    const yearly = monthly * 12;
    const upcoming = active.filter((s) => {
      const d = daysUntil(s.renewalDate);
      return d >= 0 && d <= 14;
    }).sort((a, b) => daysUntil(a.renewalDate) - daysUntil(b.renewalDate));
    const upcomingWeek = upcoming.filter((s) => daysUntil(s.renewalDate) <= 7);
    const trials = active.filter((s) => {
      if (!s.isFreeTrial || !s.trialEndsAt) return false;
      const d = daysUntil(s.trialEndsAt);
      return d >= 0 && d <= 7;
    });
    const cancelled = subscriptions.filter((s) => s.status === "CANCELLED").length;
    return { monthly, yearly, upcoming, upcomingWeek, trials, active: active.length, cancelled };
  }, [subscriptions]);

  const fc = (v: number) => formatCurrency(v, currency);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions
      .filter((s) => {
        const matchesQuery = s.serviceName.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === "All" || s.category === category;
        const matchesStatus = status === "All" || s.status === status;
        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sort === "cost") return monthlyValue(b) - monthlyValue(a);
        if (sort === "serviceName") return a.serviceName.localeCompare(b.serviceName);
        return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
      });
  }, [category, query, sort, status, subscriptions]);

  async function saveSubscription(values: SubscriptionInput) {
    const target = editing;
    setEditing(null);
    setIsFormOpen(false);

    if (target) {
      const previous = [...subscriptions];
      setSubscriptions((prev) =>
        prev.map((s) => s.id === target.id ? { ...s, ...values, updatedAt: new Date().toISOString() } : s)
      );
      try {
        const res = await fetch(`/api/subscriptions/${target.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });
        if (!res.ok) throw new Error();
        const saved = (await res.json()) as SubscriptionRecord;
        setSubscriptions((prev) => prev.map((s) => s.id === target.id ? saved : s));
        toast.success("Subscription updated");
      } catch {
        setSubscriptions(previous);
        toast.error("Failed to update — please try again");
      }
    } else {
      const tempId = `pending-${crypto.randomUUID()}`;
      const tempRecord: SubscriptionRecord = {
        ...values,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSubscriptions((prev) => [tempRecord, ...prev]);
      try {
        const res = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });
        if (!res.ok) throw new Error();
        const saved = (await res.json()) as SubscriptionRecord;
        setSubscriptions((prev) => prev.map((s) => s.id === tempId ? saved : s));
        toast.success("Subscription added");
      } catch {
        setSubscriptions((prev) => prev.filter((s) => s.id !== tempId));
        toast.error("Failed to save — please try again");
      }
    }
  }

  async function confirmDelete(id: string) {
    const previous = [...subscriptions];
    setPendingDeleteId(null);
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    try {
      const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Subscription deleted");
    } catch {
      setSubscriptions(previous);
      toast.error("Failed to delete — please try again");
    }
  }

  function openCreate() {
    setEditing(null);
    setIsFormOpen(true);
  }

  return (
    <>
      <Topbar onCreate={hasError ? undefined : openCreate} />

      {loading ? (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-36" />)}
          </section>
          <section className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_.9fr]">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </section>
          <section className="mt-5">
            <Skeleton className="h-96" />
          </section>
        </>
      ) : hasError ? (
        <ErrorState onRetry={retry} />
      ) : (
        <>
          {/* Stats */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { label: "Monthly spend", value: fc(stats.monthly), icon: CircleDollarSign, sub: "all active subscriptions" },
              { label: "Yearly projection", value: fc(stats.yearly), icon: CalendarClock, sub: "estimated annual cost" },
              { label: "Active", value: String(stats.active), icon: CreditCard, sub: `${stats.cancelled} cancelled` },
              { label: "Trials ending soon", value: String(stats.trials.length), icon: Sparkles, sub: "expiring within 7 days", warn: stats.trials.length > 0 },
              { label: "Renewals this week", value: String(stats.upcomingWeek.length), icon: AlertTriangle, sub: "due in 7 days", warn: stats.upcomingWeek.length > 0 }
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label} className={metric.warn ? "border-amber-500/20" : ""}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/50">{metric.label}</p>
                    <span className={cn(
                      "grid size-10 place-items-center rounded-2xl",
                      metric.warn ? "bg-amber-500/15" : "bg-white/[0.08]"
                    )}>
                      <Icon className={cn("size-5", metric.warn ? "text-amber-400" : "text-fog")} />
                    </span>
                  </div>
                  <p className="mt-6 text-3xl font-semibold tracking-[-0.04em]">{metric.value}</p>
                  <p className="mt-1 text-xs text-white/30">{metric.sub}</p>
                </Card>
              );
            })}
          </section>

          {/* Spending flow + Upcoming renewals */}
          <section className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_.9fr]">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Spending flow</CardTitle>
                  <p className="mt-1 text-sm text-white/[0.46]">Monthly equivalent by category</p>
                </div>
                <Badge>Live</Badge>
              </CardHeader>
              <div className="grid gap-4">
                {categories.map((cat) => {
                  const total = subscriptions
                    .filter((s) => s.category === cat && isActive(s))
                    .reduce((sum, s) => sum + monthlyValue(s), 0);
                  if (total === 0) return null;
                  const width = Math.max(6, Math.min(100, (total / Math.max(stats.monthly, 1)) * 100));
                  return (
                    <div key={cat} className="grid gap-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">{cat}</span>
                        <span className="text-white/[0.42]">{fc(total)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.08]">
                        <div className="h-full rounded-full bg-gradient-to-r from-white to-fog transition-all" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
                {stats.monthly === 0 && (
                  <p className="rounded-2xl bg-white/[0.04] p-5 text-sm text-white/[0.46]">
                    No active subscriptions yet.
                  </p>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Upcoming renewals</CardTitle>
                  <p className="mt-1 text-sm text-white/[0.46]">Next 14 days</p>
                </div>
              </CardHeader>
              <div className="grid gap-3">
                {stats.upcoming.length ? (
                  stats.upcoming.map((s) => {
                    const days = daysUntil(s.renewalDate);
                    return (
                      <div key={s.id} className={cn(
                        "flex items-center justify-between rounded-2xl border p-3 transition",
                        urgencyClass(days)
                      )}>
                        <div className="flex items-center gap-3">
                          <span className={cn("size-2 shrink-0 rounded-full", urgencyDot(days))} />
                          <div>
                            <p className="text-sm font-medium text-white">{s.serviceName}</p>
                            <p className="text-xs opacity-60">
                              {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-white">{fc(Number(s.cost))}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="rounded-2xl bg-white/[0.04] p-5 text-sm text-white/[0.46]">
                    No renewals in the next 14 days.
                  </p>
                )}
              </div>
            </Card>
          </section>

          {/* Free trials section */}
          {stats.trials.length > 0 && (
            <section className="mt-5">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Free trials ending soon</CardTitle>
                    <p className="mt-1 text-sm text-white/[0.46]">Expiring within 7 days — act before you're charged</p>
                  </div>
                  <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-300">
                    {stats.trials.length} expiring
                  </Badge>
                </CardHeader>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {stats.trials.map((s) => {
                    const days = daysUntil(s.trialEndsAt!);
                    return (
                      <div key={s.id} className={cn("rounded-2xl border p-4", urgencyClass(days))}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <LogoBadge name={s.serviceName} />
                            <div>
                              <p className="text-sm font-semibold text-white">{s.serviceName}</p>
                              <p className="text-xs text-white/50">{s.category}</p>
                            </div>
                          </div>
                          <span className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-medium",
                            days <= 2 ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"
                          )}>
                            {days === 0 ? "Ends today" : days === 1 ? "Ends tomorrow" : `${days}d left`}
                          </span>
                        </div>
                        <TrialProgress subscription={s} />
                      </div>
                    );
                  })}
                </div>
              </Card>
            </section>
          )}

          {/* Subscriptions list */}
          <section id="subscriptions" className="mt-5">
            <Card>
              <CardHeader className="flex-col md:flex-row">
                <div>
                  <CardTitle>Subscriptions</CardTitle>
                  <p className="mt-1 text-sm text-white/[0.46]">
                    Search, filter, edit, and manage all tracked services.
                    {stats.cancelled > 0 ? ` ${stats.cancelled} cancelled — excluded from spend.` : ""}
                  </p>
                </div>
                <Button onClick={openCreate} variant="secondary">
                  <Plus className="size-4" />
                  Add
                </Button>
              </CardHeader>

              <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/[0.34]" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search services"
                    className="pl-11"
                  />
                </div>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="All">All categories</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
                <Select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
                  <option value="All">All status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="ARCHIVED">Archived</option>
                </Select>
                <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="renewalDate">Sort: Renewal date</option>
                  <option value="cost">Sort: Cost</option>
                  <option value="serviceName">Sort: Name</option>
                </Select>
              </div>

              {filteredSubscriptions.length ? (
                <div className="grid gap-3">
                  {filteredSubscriptions.map((s) => {
                    const days = daysUntil(s.renewalDate);
                    const isUrgent = isActive(s) && days >= 0 && days <= 7;
                    return (
                      <article
                        key={s.id}
                        className={cn(
                          "rounded-[24px] border p-4 transition hover:bg-white/[0.06]",
                          isUrgent ? "border-amber-500/20 bg-amber-500/[0.04]" : "border-white/10 bg-white/[0.035]"
                        )}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex min-w-0 items-center gap-4">
                            <LogoBadge name={s.serviceName} />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-base font-semibold">{s.serviceName}</h3>
                                <Badge>{s.category}</Badge>
                                {s.isFreeTrial && <Badge className="text-fog">Free trial</Badge>}
                                {s.status !== "ACTIVE" && <Badge>{s.status.toLowerCase()}</Badge>}
                                {isUrgent && (
                                  <span className={cn(
                                    "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                                    urgencyClass(days)
                                  )}>
                                    {days === 0 ? "Renews today" : days === 1 ? "Renews tomorrow" : `Renews in ${days}d`}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-white/[0.46]">
                                Renews {new Date(s.renewalDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {s.billingCycle.toLowerCase()}
                              </p>
                              {s.notes && <p className="mt-2 line-clamp-1 text-sm text-white/[0.42]">{s.notes}</p>}
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-3 md:justify-end">
                            <div className="text-right">
                              <p className="font-semibold">{fc(Number(s.cost))}</p>
                              <p className="text-xs text-white/[0.42]">
                                {isActive(s) ? `${fc(monthlyValue(s))}/mo equiv.` : "Excluded from spend"}
                              </p>
                            </div>
                            <button
                              onClick={() => { setEditing(s); setIsFormOpen(true); }}
                              className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-white/70 transition hover:bg-white/[0.14] hover:text-white"
                              title="Edit"
                            >
                              <Edit3 className="size-4" />
                            </button>
                            {pendingDeleteId === s.id ? (
                              <>
                                <button
                                  onClick={() => confirmDelete(s.id)}
                                  className="h-10 rounded-full bg-red-500/20 px-4 text-xs font-medium text-red-200 transition hover:bg-red-500/30"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setPendingDeleteId(null)}
                                  className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-white/70 transition hover:bg-white/[0.14] hover:text-white"
                                >
                                  <X className="size-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setPendingDeleteId(s.id)}
                                className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-white/70 transition hover:bg-red-500/[0.18] hover:text-red-100"
                                title="Delete"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <TrialProgress subscription={s} />
                      </article>
                    );
                  })}
                </div>
              ) : (
                <EmptyState onCreate={openCreate} />
              )}
            </Card>
          </section>
        </>
      )}

      {isFormOpen && (
        <SubscriptionForm
          subscription={editing}
          onClose={() => { setEditing(null); setIsFormOpen(false); }}
          onSubmit={saveSubscription}
        />
      )}
    </>
  );
}
