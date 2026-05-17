import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/api";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const auth = await requireAppUser();
  if ("error" in auth) return auth.error;

  if (!auth.user.stripeCustomerId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  const appUrl = process.env.APP_URL ?? "https://aevixtrack.netlify.app";

  const session = await getStripe().billingPortal.sessions.create({
    customer: auth.user.stripeCustomerId,
    return_url: `${appUrl}/dashboard`
  });

  return NextResponse.json({ url: session.url });
}
