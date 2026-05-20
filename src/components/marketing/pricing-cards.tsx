"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { UpgradeButton } from "@/components/marketing/upgrade-button";
import { pricingTiers } from "@/lib/constants";

type PlanTier = "STARTER" | "PRO" | "BUSINESS" | null;

const TIER_MAP: Record<string, PlanTier> = {
  Starter: "STARTER",
  Pro: "PRO",
  Business: "BUSINESS"
};

export function PricingCards() {
  const [currentPlan, setCurrentPlan] = useState<PlanTier>(null);

  useEffect(() => {
    fetch("/api/user/plan")
      .then((r) => r.json())
      .then((d: { planTier: PlanTier }) => setCurrentPlan(d.planTier))
      .catch(() => {});
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {pricingTiers.map((tier) => {
        const isActive = currentPlan !== null && currentPlan === TIER_MAP[tier.name];
        const glows = tier.highlighted || isActive;

        return (
          <div
            key={tier.name}
            className={
              glows
                ? "rounded-[28px] border border-green-400/70 p-6 shadow-[0_0_40px_rgba(74,222,128,0.18)] transition-all duration-300"
                : "rounded-[28px] border border-green-500/25 p-6 transition-all duration-300"
            }
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-green-400/70">{tier.name}</p>
              {isActive && (
                <span className="rounded-full border border-green-400/40 bg-green-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-green-400">
                  Active
                </span>
              )}
            </div>

            <div className="mt-4 flex items-end gap-2">
              <span
                className={
                  glows
                    ? "text-5xl font-bold tracking-[-0.05em] text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)] md:text-7xl"
                    : "text-4xl font-semibold tracking-[-0.05em] text-green-300 md:text-5xl"
                }
              >
                {tier.price}
              </span>
              <span className="mb-1.5 text-white/40">/mo</span>
            </div>

            <p className="mt-3 text-sm text-white/55">{tier.description}</p>

            <div className="mt-5 grid gap-2">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="size-4 shrink-0 text-green-400" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-6">
              {tier.name === "Starter" ? (
                <LinkButton href="/auth" className="w-full" variant="secondary">
                  {currentPlan === "STARTER" ? "Current plan" : "Get started free"}
                </LinkButton>
              ) : tier.name === "Pro" ? (
                <UpgradeButton plan="PRO" className="w-full" variant="primary" selected={isActive} />
              ) : (
                <UpgradeButton plan="BUSINESS" className="w-full" variant="secondary" selected={isActive} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
