import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hasDatabaseConfig } from "@/lib/env";

// Map your App Store Connect product IDs → plan tiers.
// Update these to match the product IDs you create in App Store Connect.
const PRODUCT_TIER: Record<string, "BUSINESS"> = {
  "com.aevixtrack.business.monthly": "BUSINESS",
  "com.aevixtrack.business.yearly":  "BUSINESS",
};

export async function POST(request: Request) {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  // RevenueCat sends the webhook secret as a plain Authorization header value
  const authHeader = request.headers.get("authorization");
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (secret && authHeader !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { event?: Record<string, unknown> };
  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event;
  if (!event) return NextResponse.json({ ok: true });

  const userId   = event.app_user_id as string | undefined;
  const productId = event.product_id  as string | undefined;
  const eventType = event.type        as string | undefined;

  // Ignore anonymous / unidentified events
  if (!userId) return NextResponse.json({ ok: true });

  switch (eventType) {
    // User subscribed or renewed — activate their plan
    case "INITIAL_PURCHASE":
    case "RENEWAL":
    case "UNCANCELLATION": {
      const tier = productId ? PRODUCT_TIER[productId] : undefined;
      if (tier) {
        await prisma.user.updateMany({
          where: { id: userId },
          data: { planTier: tier }
        });
      }
      break;
    }

    // Subscription ended — revert to free tier
    case "CANCELLATION":
    case "EXPIRATION":
    case "BILLING_ISSUE": {
      await prisma.user.updateMany({
        where: { id: userId },
        data: { planTier: "STARTER" }
      });
      break;
    }

    // All other event types (PRODUCT_CHANGE, TRANSFER, etc.) — no action needed
    default:
      break;
  }

  return NextResponse.json({ ok: true });
}
