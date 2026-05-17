import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe, PRICE_IDS } from "@/lib/stripe";

function planFromPriceId(priceId: string): "STARTER" | "PRO" | "BUSINESS" {
  if (priceId === PRICE_IDS.PRO) return "PRO";
  if (priceId === PRICE_IDS.BUSINESS) return "BUSINESS";
  return "STARTER";
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id ?? session.metadata?.userId;
      if (!userId) break;

      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      const plan = (session.metadata?.plan ?? "STARTER") as "STARTER" | "PRO" | "BUSINESS";

      let stripePriceId: string | undefined;
      if (subscriptionId) {
        const sub = await getStripe().subscriptions.retrieve(subscriptionId);
        stripePriceId = sub.items.data[0]?.price.id;
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customerId ?? undefined,
          stripeSubscriptionId: subscriptionId ?? undefined,
          stripePriceId: stripePriceId ?? undefined,
          planTier: plan
        }
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
      const priceId = sub.items.data[0]?.price.id;
      const planTier = planFromPriceId(priceId ?? "");

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { stripePriceId: priceId ?? undefined, planTier }
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          planTier: "STARTER"
        }
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
