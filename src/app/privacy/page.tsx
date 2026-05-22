import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "Information we collect",
    body: `When you create an account we collect your email address and, if you sign in with Google, your name. When you use AevixTrack we store the subscription records you create — including service names, costs, renewal dates, billing cycles, and notes. We also store your reminder preferences and notification history.`
  },
  {
    title: "How we use your information",
    body: `Your data is used solely to operate AevixTrack. This includes displaying your subscriptions on the dashboard, sending renewal and free trial reminder emails at the intervals you choose, and calculating your spending summaries. We do not use your data for advertising or sell it to third parties.`
  },
  {
    title: "Third-party services",
    body: `AevixTrack is built on the following third-party services:\n\n• Supabase — authentication and database hosting\n• Stripe — payment processing for paid plans\n• Resend — transactional email delivery for reminders\n• Vercel — application hosting and scheduled jobs\n\nEach of these services processes your data only as necessary to provide their function and under their own privacy policies.`
  },
  {
    title: "Email reminders",
    body: `If email reminders are enabled in your settings, AevixTrack sends automated emails from onboarding@resend.dev before subscription renewals and free trial expirations. You can disable email reminders at any time from the Settings page.`
  },
  {
    title: "Data retention",
    body: `Your data is retained for as long as your account is active. If you delete your account, all associated data — including subscriptions, reminders, and notifications — is permanently deleted within 30 days.`
  },
  {
    title: "Security",
    body: `All data is stored securely via Supabase using row-level security policies that ensure your data is only accessible by your account. Connections are encrypted in transit via HTTPS.`
  },
  {
    title: "Your rights",
    body: `You have the right to access, correct, or delete the personal data we hold about you. To make a request, contact us at the email address below. We will respond within 30 days.`
  },
  {
    title: "Changes to this policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on the app or sending an email to your registered address.`
  }
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-3 py-4 text-white sm:px-6 lg:px-10">
      <MarketingNav />

      <div className="mx-auto max-w-4xl px-2 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-green-400/60 hover:text-green-400 transition-colors">
          <ArrowLeft className="size-4" />
          Back home
        </Link>

        <div className="mt-12">
          <Badge>Legal</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-white/40">Last updated: May 2026</p>
          <p className="mt-4 text-base leading-7 text-white/55">
            AevixTrack is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.
          </p>
        </div>

        <div className="mt-12 grid gap-8">
          {sections.map(({ title, body }) => (
            <div key={title} className="border-t border-white/10 pt-8">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/55">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[24px] border border-white/10 p-6">
          <h3 className="font-semibold">Contact</h3>
          <p className="mt-2 text-sm text-white/55">
            For privacy-related questions or data requests, email us at{" "}
            <a href="mailto:AevixTrack@Hotmail.com" className="text-green-400 hover:underline">
              AevixTrack@Hotmail.com
            </a>
          </p>
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
