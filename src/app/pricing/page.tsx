import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { UpgradeButton } from "@/components/marketing/upgrade-button";
import { pricingTiers } from "@/lib/constants";

export default function PricingPage() {
  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/[0.56] hover:text-white">
          <ArrowLeft className="size-4" />
          Back home
        </Link>
        <div className="mt-16 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-fog/70">Pricing</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
            Premium tracking without premium clutter.
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/[0.58]">
            Start free, upgrade when your subscription stack needs deeper reminders, unlimited records, and team-level controls.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={tier.highlighted ? "bg-white text-black" : ""}>
              <p className={tier.highlighted ? "text-black/60" : "text-white/[0.56]"}>{tier.name}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className={tier.highlighted ? "text-7xl font-bold tracking-[-0.05em]" : "text-5xl font-semibold tracking-[-0.05em]"}>
                  {tier.price}
                </span>
                <span className={tier.highlighted ? "mb-3 text-black/[0.46]" : "mb-2 text-white/[0.42]"}>/mo</span>
              </div>
              <p className={tier.highlighted ? "mt-4 text-sm text-black/[0.58]" : "mt-4 text-sm text-white/[0.56]"}>
                {tier.description}
              </p>
              <div className="mt-8 grid gap-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="size-4" />
                    {feature}
                  </div>
                ))}
              </div>

              {tier.name === "Starter" ? (
                <LinkButton
                  href="/register"
                  className="mt-8 w-full"
                  variant="secondary"
                >
                  Get started free
                </LinkButton>
              ) : tier.name === "Pro" ? (
                <UpgradeButton
                  plan="PRO"
                  className="mt-8 w-full bg-black text-white hover:bg-black/80"
                  variant="primary"
                />
              ) : (
                <UpgradeButton
                  plan="BUSINESS"
                  className="mt-8 w-full"
                  variant="secondary"
                />
              )}
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
