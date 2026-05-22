import { NextResponse } from "next/server";
import { requireAppUser, serializeSubscription } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { subscriptionSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireAppUser();
  if ("error" in auth) return auth.error;

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: auth.user.id },
    include: { reminders: true },
    orderBy: { renewalDate: "asc" }
  });

  return NextResponse.json(subscriptions.map(serializeSubscription));
}

const STARTER_LIMIT = 10;

export async function POST(request: Request) {
  const auth = await requireAppUser();
  if ("error" in auth) return auth.error;

  if (auth.user.planTier === "STARTER") {
    const count = await prisma.subscription.count({ where: { userId: auth.user.id } });
    if (count >= STARTER_LIMIT) {
      return NextResponse.json(
        { error: "plan_limit", message: "You've reached the 10 subscription limit on the free plan. Upgrade to Business for unlimited tracking." },
        { status: 403 }
      );
    }
  }

  const parsed = subscriptionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { reminders, ...input } = parsed.data;
  const subscription = await prisma.subscription.create({
    data: {
      ...input,
      userId: auth.user.id,
      renewalDate: new Date(input.renewalDate),
      trialEndsAt: input.trialEndsAt ? new Date(input.trialEndsAt) : null,
      reminders: {
        create: reminders.map((offset) => ({
          offset,
          userId: auth.user.id
        }))
      }
    },
    include: { reminders: true }
  });

  return NextResponse.json(serializeSubscription(subscription), { status: 201 });
}
