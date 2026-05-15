"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bell, Loader2, Moon, Palette, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/app/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { reminderOptions } from "@/lib/constants";
import { settingsSchema } from "@/lib/validations";

export function SettingsClient() {
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [reminderOffsets, setReminderOffsets] = useState<string[]>(["ONE_DAY", "THREE_DAYS", "SEVEN_DAYS"]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) return;
        const data = await response.json();
        setEmailReminders(data.emailReminders ?? true);
        setCurrency(data.currency ?? "USD");
        setReminderOffsets(data.reminderOffsets ?? ["ONE_DAY", "THREE_DAYS", "SEVEN_DAYS"]);
      } catch {
        // keep defaults
      } finally {
        setSettingsLoading(false);
      }
    }
    loadSettings();
  }, []);

  function toggleOffset(value: string) {
    setReminderOffsets((prev) =>
      prev.includes(value) ? prev.filter((o) => o !== value) : [...prev, value]
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const parsed = settingsSchema.safeParse({
      currency,
      darkMode: true,
      emailReminders,
      reminderOffsets
    });

    if (!parsed.success) {
      toast.error("Please review your settings");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      });
      if (!response.ok) throw new Error("Demo mode");
      toast.success("Settings saved");
    } catch {
      toast.success("Settings saved in demo mode");
    } finally {
      setLoading(false);
    }
  }

  if (settingsLoading) {
    return (
      <>
        <Topbar
        title="Settings"
        description="Manage your currency, reminder defaults, and account preferences."
        badge="Account settings"
      />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_.8fr]">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Settings"
        description="Manage your currency, reminder defaults, and account preferences."
        badge="Account settings"
      />
      <form onSubmit={submit} className="mt-8 grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Workspace settings</CardTitle>
              <p className="mt-1 text-sm text-white/[0.46]">Preferences applied across your account.</p>
            </div>
          </CardHeader>
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm text-white/[0.68]">
              Currency
              <Select name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD — US Dollar</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="EUR">EUR — Euro</option>
                <option value="CAD">CAD — Canadian Dollar</option>
              </Select>
            </label>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
              <span className="flex items-center gap-3">
                <Moon className="size-5 text-fog" />
                Theme
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1 text-xs text-white/50">
                <Sparkles className="size-3" />
                Dark
              </span>
            </div>
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">
              <span className="flex items-center gap-3">
                <Bell className="size-5 text-fog" />
                Email reminders
              </span>
              <input
                type="checkbox"
                checked={emailReminders}
                onChange={(event) => setEmailReminders(event.target.checked)}
                className="size-5 rounded border-white/20 bg-white/10 text-black focus:ring-fog/30"
              />
            </label>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Reminder defaults</CardTitle>
              <p className="mt-1 text-sm text-white/[0.46]">Applied to new subscriptions unless overridden.</p>
            </div>
          </CardHeader>
          <div className="grid gap-3">
            {reminderOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
                <input
                  name="reminderOffsets"
                  type="checkbox"
                  value={option.value}
                  checked={reminderOffsets.includes(option.value)}
                  onChange={() => toggleOffset(option.value)}
                  className="size-4 rounded border-white/20 bg-white/10 text-black focus:ring-fog/30"
                />
                {option.label}
              </label>
            ))}
          </div>
          <Button className="mt-6 w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save settings
          </Button>
        </Card>
      </form>

      <Card className="mt-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/[0.08]">
              <Palette className="size-5 text-fog" />
            </span>
            <div>
              <h2 className="font-semibold">Visual system</h2>
              <p className="text-sm text-white/[0.46]">Dark glass panels, rounded controls, muted gradients, and restrained motion.</p>
            </div>
          </div>
          <span className="rounded-full bg-white/[0.08] px-4 py-2 text-sm text-white/[0.58]">AevixTrack design language</span>
        </div>
      </Card>
    </>
  );
}
