"use client";

import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/[0.66]">
          <ShieldCheck className="size-3.5" />
          {badge}
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/[0.56] md:text-base">
          {description}
        </p>
      </div>
      {onCreate ? (
        <Button onClick={onCreate} className="self-start">
          <Plus className="size-4" />
          Add subscription
        </Button>
      ) : null}
    </div>
  );
}
