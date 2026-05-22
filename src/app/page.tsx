import Link from "next/link";
import { ArrowRight, Bell, BarChart3, CreditCard, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const faqs = [
  ["Can I track yearly subscriptions?", "Yes. AevixTrack shows both monthly and yearly totals — original billing cycles are preserved alongside a monthly equivalent for easy comparison."],
  ["How do email reminders work?", "Set reminder timing per subscription — 1, 3, or 7 days before renewal. Global defaults can be configured in Settings and apply automatically to new subscriptions."],
  ["Is my data secure?", "Yes. All routes require an active session. Your subscriptions and settings are private to your account and never shared."],
  ["Is there a free plan?", "Yes. The Starter tier is free with no credit card required. It covers personal subscription tracking with all core features."]
];

const features = [
  {
    icon: CreditCard,
    title: "Subscription Tracking",
    description: "Log every paid tool, free trial, and freemium service in one place. Never lose track of what you're paying for or when it renews."
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Get email alerts 1, 3, or 7 days before any renewal or trial expiry. Set custom defaults globally and override per subscription."
  },
  {
    icon: BarChart3,
    title: "Spend Analytics",
    description: "See your monthly and yearly spend across every category. Spending flow charts surface where your budget is quietly leaking."
  },
  {
    icon: Sparkles,
    title: "Trial Watchdog",
    description: "Free trials convert to paid charges silently. AevixTrack tracks progress bars and days remaining so you cancel before you're billed."
  },
  {
    icon: ShieldCheck,
    title: "Secure by Default",
    description: "Every route is protected by authenticated sessions. Your data is private to your account and never shared with third parties."
  },
  {
    icon: Zap,
    title: "Instant Dashboard",
    description: "A calm, fast dashboard that loads your full picture in seconds. Filter by category, status, or cost — sort any way you need."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen px-3 py-4 text-white sm:px-6 lg:px-10">
      <MarketingNav />

      {/* About */}
      <section className="mx-auto max-w-7xl px-2 py-20">
        <div className="mb-16 max-w-3xl">
          <Badge className="mb-6">About AevixTrack</Badge>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl md:text-5xl lg:text-6xl">
            Stop losing money to subscriptions you forgot about.
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/60">
            The average person wastes over £300 a year on forgotten subscriptions and auto-renewing free trials.
            AevixTrack is a clean, focused dashboard that puts every service you pay for — or plan to cancel — in one place,
            with reminders that arrive before it costs you.
          </p>
          <p className="mt-4 text-lg leading-8 text-white/60">
            Built for individuals and small teams who want full visibility into their software spend without spreadsheets,
            calendar hacks, or digging through bank statements. Track renewals, monitor trial countdowns, analyse spending
            by category, and get ahead of every charge before it hits.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/register">Get started free</LinkButton>
            <LinkButton href="/dashboard" variant="secondary">
              Open dashboard
              <ArrowRight className="size-4" />
            </LinkButton>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="flex flex-col gap-4 border-t border-green-500/20 pt-6">
                <Icon className="size-6 text-green-400" />
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-6 text-white/55">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-2 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <Badge>Pricing</Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl md:text-4xl">Plans that scale quietly</h2>
          </div>
          <Link href="/pricing" className="hidden text-sm text-white/60 hover:text-white md:block">
            View pricing
          </Link>
        </div>
        <PricingCards />
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-2 py-16">
        <Badge>FAQ</Badge>
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-4xl">The useful details</h2>
        <div className="mt-8 grid gap-3">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-[24px] border border-white/10 p-5">
              <summary className="cursor-pointer font-medium">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-white/55">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mb-10 max-w-7xl rounded-[34px] border border-green-500/20 p-8 text-center md:p-14">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-4xl md:text-6xl">Stop paying for forgotten subscriptions.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-white/55">
          Build a clean renewal habit with a dashboard that feels as sharp as the tools it tracks.
        </p>
        <LinkButton href="/register" className="mt-8">
          Create free account
        </LinkButton>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-2 pb-10 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
        <p>Copyright 2026 AevixTrack. All rights reserved.</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/support" className="hover:text-white transition-colors">Support</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/auth" className="hover:text-white transition-colors">Sign in</Link>
        </div>
      </footer>
    </main>
  );
}
