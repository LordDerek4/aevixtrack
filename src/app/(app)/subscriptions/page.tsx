import { PricingCards } from "@/components/marketing/pricing-cards";
import { ManageBillingButton } from "@/components/marketing/upgrade-button";
import { Topbar } from "@/components/app/topbar";

export default function SubscriptionsPage() {
  return (
    <>
      <Topbar
        title="Plans"
        description="View your current plan and upgrade at any time."
        badge="Billing"
      />

      <div className="mt-8">
        <PricingCards />
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-[24px] border border-green-500/15 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-sm font-medium text-white">Billing portal</p>
          <p className="mt-1 text-xs text-white/50">Manage invoices, payment methods, and your active subscription through Stripe.</p>
        </div>
        <ManageBillingButton className="shrink-0" />
      </div>
    </>
  );
}
