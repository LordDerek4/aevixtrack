import { NextResponse } from "next/server";
import { requireAppUser, serializeSubscription } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { subscriptionSchema } from "@/lib/validations";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAppUser();
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  const parsed = subscriptionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { reminders, ...input } = parsed.data;
  const existing = await prisma.subscription.findFirst({
    where: { id, userId: auth.user.id }
  });

  if (!existing) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  const subscription = await prisma.subscription.update({
    where: { id },
    data: {
      ...input,
      renewalDate: new Date(input.renewalDate),
      trialEndsAt: input.trialEndsAt ? new Date(input.trialEndsAt) : null,
      reminders: {
        deleteMany: {},
        create: reminders.map((offset) => ({
          offset,
          userId: auth.user.id
        }))
      }
    },
    include: { reminders: true }
  });

  return NextResponse.json(serializeSubscription(subscription));
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAppUser();
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  const existing = await prisma.subscription.findFirst({
    where: { id, userId: auth.user.id }
  });

  if (!existing) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  await prisma.subscription.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
