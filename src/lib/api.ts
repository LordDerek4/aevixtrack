import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { hasDatabaseConfig } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function requireAppUser() {
  if (!hasDatabaseConfig()) {
    return { error: NextResponse.json({ error: "Database is not configured" }, { status: 503 }) };
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    return { error: NextResponse.json({ error: "No email address on account" }, { status: 401 }) };
  }

  const user = await prisma.user.upsert({
    where: { id: clerkUser.id },
    update: {
      email,
      fullName: clerkUser.fullName ?? null
    },
    create: {
      id: clerkUser.id,
      email,
      fullName: clerkUser.fullName ?? null,
      settings: {
        create: {}
      }
    }
  });

  return { user };
}

export function serializeSubscription(subscription: {
  id: string;
  serviceName: string;
  category: string;
  cost: unknown;
  billingCycle: "MONTHLY" | "YEARLY";
  renewalDate: Date;
  notes: string | null;
  subscriptionType: "PAID" | "FREE_TRIAL" | "FREEMIUM";
  status: "ACTIVE" | "CANCELLED" | "ARCHIVED";
  isFreeTrial: boolean;
  trialEndsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  reminders?: { offset: "ONE_DAY" | "THREE_DAYS" | "SEVEN_DAYS" }[];
}) {
  return {
    id: subscription.id,
    serviceName: subscription.serviceName,
    category: subscription.category,
    cost: Number(subscription.cost),
    billingCycle: subscription.billingCycle,
    renewalDate: subscription.renewalDate.toISOString().slice(0, 10),
    notes: subscription.notes ?? "",
    subscriptionType: subscription.subscriptionType,
    status: subscription.status,
    isFreeTrial: subscription.isFreeTrial,
    trialEndsAt: subscription.trialEndsAt?.toISOString().slice(0, 10) ?? "",
    reminders: subscription.reminders?.map((reminder) => reminder.offset) ?? [],
    createdAt: subscription.createdAt.toISOString(),
    updatedAt: subscription.updatedAt.toISOString()
  };
}
