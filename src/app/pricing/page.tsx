import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { UpgradeButton } from "@/components/marketing/upgrade-button";
import { Badge } from "@/components/ui/badge";
import { pricingTiers } from "@/lib/constants";

export default function PricingPage() {
  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-green-400/60 hover:text-green-400 transition-colors">
          <ArrowLeft className="size-4" />
          Back home
        </Link>

        <div className="mt-16 max-w-3xl">
          <Badge className="mb-6">Pricing</Badge>
          <h1 className="text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
            Premium tracking without premium clutter.
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/60">
            Start free, upgrade when your subscription stack needs deeper reminders, unlimited records, and team-level controls.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.highlighted
                  ? "rounded-[28px] border border-green-400/70 p-6 shadow-[0_0_32px_rgba(74,222,128,0.15)]"
                  : "rounded-[28px] border border-green-500/25 p-6"
              }
            >
              <p className="text-sm font-medium text-green-400/70">{tier.name}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className={
                  tier.highlighted
                    ? "text-7xl font-bold tracking-[-0.05em] text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]"
                    : "text-5xl font-semibold tracking-[-0.05em] text-green-300"
                }>
                  {tier.price}
                </span>
                <span className="mb-2 text-white/40">/mo</span>
              </div>
              <p className="mt-4 text-sm text-white/55">{tier.description}</p>
              <div className="mt-8 grid gap-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="size-4 text-green-400" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                {tier.name === "Starter" ? (
                  <LinkButton href="/register" className="w-full" variant="secondary">
                    Get started free
                  </LinkButton>
                ) : tier.name === "Pro" ? (
                  <UpgradeButton plan="PRO" className="w-full" variant="primary" />
                ) : (
                  <UpgradeButton plan="BUSINESS" className="w-full" variant="secondary" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
