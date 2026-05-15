import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pricingTiers } from "@/lib/constants";

// ── FAQs ─────────────────────────────────────────────────────────────────────

const faqs = [
  ["Can I track yearly subscriptions?", "Yes. AevixTrack shows both monthly and yearly totals — original billing cycles are preserved alongside a monthly equivalent for easy comparison."],
  ["How do email reminders work?", "Set reminder timing per subscription — 1, 3, or 7 days before renewal. Global defaults can be configured in Settings and apply automatically to new subscriptions."],
  ["Is my data secure?", "Yes. All routes require an active session. Your subscriptions and settings are private to your account and never shared."],
  ["Is there a free plan?", "Yes. The Starter tier is free with no credit card required. It covers personal subscription tracking with all core features."]
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen px-3 py-4 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1536px] rounded-[34px] bg-black p-2 shadow-soft md:rounded-[44px] md:p-6">
        <MarketingNav />

        {/* Hero */}
        <section className="hero-mist noise relative mx-auto min-h-[720px] overflow-hidden rounded-[28px] border border-white/10 md:rounded-[36px]">
          <div className="relative z-10 flex min-h-[720px] flex-col items-center justify-center px-6 py-24 text-center">
            <Badge className="mb-8 gap-2 bg-black/[0.34]">
              <Sparkles className="size-3.5" />
              Unlock your subscription clarity
              <ArrowRight className="size-3.5" />
            </Badge>
            <h1 className="max-w-5xl text-balance text-5xl font-semibold tracking-[-0.065em] text-white sm:text-6xl md:text-8xl">
              One-click for Subscription Defense
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/[0.62] md:text-xl">
              Forgotten subscriptions quietly waste money. AevixTrack keeps paid tools, free trials, renewal reminders, and spend forecasts in one calm dashboard.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <LinkButton href="/dashboard" variant="secondary">
                Open App
                <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton href="/register">Start Free</LinkButton>
            </div>
          </div>
          <div className="absolute bottom-12 right-12 hidden md:block">
            <p className="text-sm text-fog/80">Budget horizons</p>
            <div className="mt-3 flex gap-2">
              <span className="h-1.5 w-8 rounded-full bg-white" />
              <span className="h-1.5 w-8 rounded-full bg-white/10" />
              <span className="h-1.5 w-8 rounded-full bg-white/10" />
              <span className="h-1.5 w-8 rounded-full bg-white/10" />
            </div>
          </div>
        </section>
      </div>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-2 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <Badge>Pricing</Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Plans that scale quietly</h2>
          </div>
          <Link href="/pricing" className="hidden text-sm text-white/[0.58] hover:text-white md:block">
            View pricing
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={tier.highlighted ? "bg-white text-black" : ""}>
              <p className={tier.highlighted ? "text-black/60" : "text-white/[0.56]"}>{tier.name}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-[-0.05em]">{tier.price}</span>
                <span className={tier.highlighted ? "mb-2 text-black/[0.46]" : "mb-2 text-white/[0.42]"}>/mo</span>
              </div>
              <p className={tier.highlighted ? "mt-4 text-sm text-black/[0.58]" : "mt-4 text-sm text-white/[0.56]"}>{tier.description}</p>
              <div className="mt-8 grid gap-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="size-4" />
                    {feature}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-2 py-16">
        <Badge>FAQ</Badge>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">The useful details</h2>
        <div className="mt-8 grid gap-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
              <summary className="cursor-pointer font-medium">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-white/[0.56]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mb-10 max-w-7xl rounded-[34px] border border-white/10 bg-white p-8 text-center text-black md:p-14">
        <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Stop paying for forgotten subscriptions.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-black/[0.58]">
          Build a clean renewal habit with a dashboard that feels as sharp as the tools it tracks.
        </p>
        <LinkButton href="/register" className="mt-8 bg-black text-white hover:bg-black/80">
          Create free account
        </LinkButton>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-2 pb-10 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
        <p>Copyright 2026 AevixTrack. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/pricing">Pricing</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </footer>
    </main>
  );
}
