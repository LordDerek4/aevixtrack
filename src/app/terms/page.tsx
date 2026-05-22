import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "Acceptance of terms",
    body: `By creating an account or using AevixTrack you agree to these Terms of Service. If you do not agree, do not use the service.`
  },
  {
    title: "Description of service",
    body: `AevixTrack is a subscription and free trial tracking tool. It allows you to log recurring services, set renewal reminders, monitor spending, and receive email notifications before charges occur.`
  },
  {
    title: "Account responsibility",
    body: `You are responsible for maintaining the security of your account credentials. You must not share your account or use AevixTrack to store data belonging to others without their consent. You are responsible for all activity that occurs under your account.`
  },
  {
    title: "Plans and limits",
    body: `The Starter plan is free and supports up to 10 subscriptions. Pro and Business plans offer unlimited subscriptions and additional features as described on the Pricing page. Plan limits are enforced automatically.`
  },
  {
    title: "Payments and billing",
    body: `Paid plans are billed monthly through Stripe. All charges are shown before you confirm a purchase. You may cancel your paid plan at any time from the billing portal — your access continues until the end of the current billing period. We do not offer refunds for partial months.`
  },
  {
    title: "Acceptable use",
    body: `You agree not to misuse AevixTrack. This includes attempting to access other users' data, reverse engineering the service, using the service for any unlawful purpose, or using automated tools to send excessive requests to our servers.`
  },
  {
    title: "Service availability",
    body: `We aim to keep AevixTrack available at all times but do not guarantee uninterrupted access. We may perform maintenance, release updates, or temporarily suspend the service with or without notice.`
  },
  {
    title: "Termination",
    body: `You may delete your account at any time. We reserve the right to suspend or terminate accounts that violate these terms. Upon termination all your data will be permanently deleted within 30 days.`
  },
  {
    title: "Limitation of liability",
    body: `AevixTrack is provided as-is. We are not liable for any missed reminders, unexpected charges from third-party services you track, or data loss. Use the service as a helpful tool — not as a substitute for your own due diligence on your finances.`
  },
  {
    title: "Changes to these terms",
    body: `We may update these Terms of Service from time to time. Continued use of AevixTrack after changes are posted constitutes acceptance of the updated terms. We will notify you of material changes by email.`
  }
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-white/40">Last updated: May 2026</p>
          <p className="mt-4 text-base leading-7 text-white/55">
            Please read these terms carefully before using AevixTrack.
          </p>
        </div>

        <div className="mt-12 grid gap-8">
          {sections.map(({ title, body }) => (
            <div key={title} className="border-t border-white/10 pt-8">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/55">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[24px] border border-white/10 p-6">
          <h3 className="font-semibold">Contact</h3>
          <p className="mt-2 text-sm text-white/55">
            For questions about these terms, email us at{" "}
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
