import Link from "next/link";
import { ArrowLeft, Mail, Bell, CreditCard, ShieldCheck, HelpCircle } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    icon: Bell,
    q: "Why am I not receiving reminder emails?",
    a: "Check that email reminders are enabled in Settings. Reminders are sent 1, 3, or 7 days before renewal — make sure at least one offset is selected. Also check your spam folder, as emails come from onboarding@resend.dev."
  },
  {
    icon: CreditCard,
    q: "How do I cancel or change my plan?",
    a: "Go to the Subscriptions page inside the app. You can upgrade to Pro or Business from there, or use the billing portal to manage or cancel your current paid plan at any time."
  },
  {
    icon: ShieldCheck,
    q: "Is my subscription data private?",
    a: "Yes. Your data is private to your account, stored securely via Supabase, and never shared with third parties. See our Privacy Policy for full details."
  },
  {
    icon: HelpCircle,
    q: "How do free trial reminders work?",
    a: "When you add a subscription and mark it as a free trial, AevixTrack tracks the trial end date. You will receive an email and in-app notification before it expires so you can cancel before being charged."
  },
  {
    icon: HelpCircle,
    q: "Can I track yearly subscriptions?",
    a: "Yes. Set the billing cycle to Yearly when adding a subscription. AevixTrack shows both the original cost and a monthly equivalent so you can compare across billing cycles."
  },
  {
    icon: HelpCircle,
    q: "What happens if I reach the free plan limit?",
    a: "The free Starter plan supports up to 10 subscriptions. Once you reach the limit you will be prompted to upgrade to Pro or Business for unlimited tracking."
  }
];

export default function SupportPage() {
  return (
    <main className="min-h-screen px-3 py-4 text-white sm:px-6 lg:px-10">
      <MarketingNav />

      <div className="mx-auto max-w-4xl px-2 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-green-400/60 hover:text-green-400 transition-colors">
          <ArrowLeft className="size-4" />
          Back home
        </Link>

        <div className="mt-12">
          <Badge>Support</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            How can we help?
          </h1>
          <p className="mt-4 text-base leading-7 text-white/55">
            Find answers to the most common questions below. If you need more help, email us directly.
          </p>
        </div>

        <div className="mt-12 grid gap-4">
          {faqs.map(({ icon: Icon, q, a }) => (
            <div key={q} className="rounded-[24px] border border-white/10 p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-green-500/20">
                  <Icon className="size-4 text-green-400" />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{q}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[28px] border border-green-500/20 p-8 text-center">
          <Mail className="mx-auto size-8 text-green-400" />
          <h2 className="mt-4 text-xl font-semibold">Still need help?</h2>
          <p className="mt-2 text-sm text-white/55">
            Send us an email and we will get back to you as soon as possible.
          </p>
          <a
            href="mailto:support@aevixtrack.com"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-green-400"
          >
            <Mail className="size-4" />
            support@aevixtrack.com
          </a>
        </div>
      </div>

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
