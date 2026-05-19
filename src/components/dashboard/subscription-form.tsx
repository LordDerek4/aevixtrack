"use client";

import { FormEvent, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/input";
import { categories, reminderOptions } from "@/lib/constants";
import { type SubscriptionRecord } from "@/lib/validations";
import { subscriptionSchema, type SubscriptionInput } from "@/lib/validations";

const emptySubscription: SubscriptionInput = {
  serviceName: "",
  category: "Productivity",
  cost: 0,
  billingCycle: "MONTHLY",
  renewalDate: "",
  notes: "",
  subscriptionType: "PAID",
  status: "ACTIVE",
  isFreeTrial: false,
  trialEndsAt: "",
  reminders: ["THREE_DAYS"]
};

export function SubscriptionForm({
  subscription,
  onClose,
  onSubmit
}: {
  subscription?: SubscriptionRecord | null;
  onClose: () => void;
  onSubmit: (values: SubscriptionInput) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFreeTrial, setIsFreeTrial] = useState(Boolean(subscription?.isFreeTrial));
  const values = subscription ?? emptySubscription;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(event.currentTarget);
    const parsed = subscriptionSchema.safeParse({
      serviceName: form.get("serviceName"),
      category: form.get("category"),
      cost: form.get("cost"),
      billingCycle: form.get("billingCycle"),
      renewalDate: form.get("renewalDate"),
      notes: form.get("notes"),
      subscriptionType: form.get("subscriptionType"),
      status: form.get("status"),
      isFreeTrial,
      trialEndsAt: form.get("trialEndsAt") || "",
      reminders: form.getAll("reminders")
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    await onSubmit({
      ...parsed.data,
      subscriptionType: isFreeTrial ? "FREE_TRIAL" : parsed.data.subscriptionType,
      trialEndsAt: isFreeTrial ? parsed.data.trialEndsAt : ""
    });
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/[0.72] px-4 py-8 backdrop-blur-md">
      <form onSubmit={submit} className="glass max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[32px] p-5 md:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">
              {subscription ? "Edit subscription" : "Add subscription"}
            </h2>
            <p className="mt-1 text-sm text-white/50">Track costs, renewal dates, notes, trials, and reminders.</p>
          </div>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-white/[0.08] text-white/70">
            <X className="size-5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldLabel label="Service name" error={errors.serviceName}>
            <Input name="serviceName" defaultValue={values.serviceName} placeholder="Vercel Pro" />
          </FieldLabel>
          <FieldLabel label="Category" error={errors.category}>
            <Select name="category" defaultValue={values.category}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FieldLabel>
          <FieldLabel label="Cost" error={errors.cost}>
            <Input name="cost" type="number" min="0" step="0.01" defaultValue={values.cost} />
          </FieldLabel>
          <FieldLabel label="Billing cycle">
            <Select name="billingCycle" defaultValue={values.billingCycle}>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </Select>
          </FieldLabel>
          <FieldLabel label="Renewal date" error={errors.renewalDate}>
            <Input name="renewalDate" type="date" defaultValue={values.renewalDate?.slice(0, 10)} />
          </FieldLabel>
          <FieldLabel label="Subscription type">
            <Select name="subscriptionType" defaultValue={values.subscriptionType}>
              <option value="PAID">Paid</option>
              <option value="FREEMIUM">Freemium</option>
              <option value="FREE_TRIAL">Free trial</option>
            </Select>
          </FieldLabel>
          <FieldLabel label="Status">
            <Select name="status" defaultValue={values.status}>
              <option value="ACTIVE">Active</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </FieldLabel>
        </div>

        <label className="mt-5 flex items-center justify-between rounded-2xl border border-green-500/20 p-4 text-sm text-white/70">
          Free trial
          <input
            type="checkbox"
            checked={isFreeTrial}
            onChange={(event) => setIsFreeTrial(event.target.checked)}
            className="size-5 rounded border-white/20 bg-white/10 text-black focus:ring-fog/30"
          />
        </label>

        {isFreeTrial ? (
          <div className="mt-4">
            <FieldLabel label="Trial ends at" error={errors.trialEndsAt}>
              <Input name="trialEndsAt" type="date" defaultValue={values.trialEndsAt?.slice(0, 10)} />
            </FieldLabel>
          </div>
        ) : null}

        <div className="mt-5">
          <FieldLabel label="Notes">
            <Textarea name="notes" defaultValue={values.notes} placeholder="Plan owner, cancellation notes, contract details..." />
          </FieldLabel>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm text-white/[0.68]">Reminder options</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {reminderOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-3 rounded-2xl border border-green-500/20 px-4 py-3 text-sm text-white/70">
                <input
                  name="reminders"
                  type="checkbox"
                  value={option.value}
                  defaultChecked={values.reminders.includes(option.value)}
                  className="size-4 rounded border-white/20 bg-white/10 text-black focus:ring-fog/30"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Save subscription
          </Button>
        </div>
      </form>
    </div>
  );
}
