import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/api";
import { getStripe, PRICE_IDS } from "@/lib/stripe";

export async function POST(request: Request) {
  const auth = await requireAppUser();
  if ("error" in auth) return auth.error;

  const { plan } = (await request.json()) as { plan: "PRO" | "BUSINESS" };
  const priceId = PRICE_IDS[plan];

  if (!priceId) {
    return NextResponse.json({ error: "Stripe price not configured" }, { status: 503 });
  }

  if (auth.user.stripeSubscriptionId) {
    return NextResponse.json({ error: "Already subscribed — use billing portal to change plans" }, { status: 400 });
  }

  const appUrl = process.env.APP_URL ?? "https://aevixtracker.com";

  const session = await getStripe().checkout.sessions.create({
    customer: auth.user.stripeCustomerId ?? undefined,
    customer_email: auth.user.stripeCustomerId ? undefined : auth.user.email,
    client_reference_id: auth.user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing`,
    metadata: { userId: auth.user.id, plan }
  });

  return NextResponse.json({ url: session.url });
}
