import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PricingCards } from "@/components/marketing/pricing-cards";

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

        <div className="mt-12">
          <PricingCards />
        </div>
      </div>
    </main>
  );
}
