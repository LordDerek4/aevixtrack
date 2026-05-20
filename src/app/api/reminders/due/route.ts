import { addDays, startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const offsetDays = {
  ONE_DAY: 1,
  THREE_DAYS: 3,
  SEVEN_DAYS: 7
} as const;

const offsetLabel = {
  ONE_DAY: "tomorrow",
  THREE_DAYS: "in 3 days",
  SEVEN_DAYS: "in 7 days"
} as const;

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) return true;
  // Manual POST trigger uses x-cron-secret
  const manualHeader = request.headers.get("x-cron-secret");
  return manualHeader === cronSecret;
}

// GET — called by Vercel Cron at 08:00 UTC daily (vercel.json)
export async function GET(request: Request) {
  return runReminders(request);
}

// POST — manual trigger for testing
export async function POST(request: Request) {
  return runReminders(request);
}

async function runReminders(request: Request) {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = startOfDay(new Date());
  const reminders = await prisma.reminder.findMany({
    where: {
      emailEnabled: true,
      sentAt: null,
      subscription: { status: "ACTIVE" },
      user: { settings: { emailReminders: true } }
    },
    include: { user: true, subscription: true }
  });

  const due = reminders.filter((reminder) => {
    const targetDate = startOfDay(addDays(today, offsetDays[reminder.offset]));
    const renewalDate = startOfDay(reminder.subscription.renewalDate);
    const trialDate = reminder.subscription.trialEndsAt
      ? startOfDay(reminder.subscription.trialEndsAt)
      : null;
    return (
      renewalDate.getTime() === targetDate.getTime() ||
      trialDate?.getTime() === targetDate.getTime()
    );
  });

  if (due.length === 0) {
    return NextResponse.json({ queued: 0, reminders: [] });
  }

  // Create in-app notifications for each due reminder
  await prisma.notification.createMany({
    data: due.map((reminder) => {
      const isTrial =
        reminder.subscription.isFreeTrial &&
        reminder.subscription.trialEndsAt !== null &&
        startOfDay(addDays(today, offsetDays[reminder.offset])).getTime() ===
          startOfDay(reminder.subscription.trialEndsAt!).getTime();

      const label = offsetLabel[reminder.offset];
      const message = isTrial
        ? `Your free trial of ${reminder.subscription.serviceName} ends ${label}.`
        : `${reminder.subscription.serviceName} renews ${label} — £${Number(reminder.subscription.cost).toFixed(2)}.`;

      return {
        userId: reminder.userId,
        subscriptionId: reminder.subscriptionId,
        type: isTrial ? ("TRIAL_ENDING" as const) : ("RENEWAL_REMINDER" as const),
        message
      };
    }),
    skipDuplicates: true
  });

  // Send emails if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const appUrl = process.env.APP_URL ?? "https://aevixtrack.netlify.app";

    await Promise.allSettled(
      due.map((reminder) => {
        const isTrial =
          reminder.subscription.isFreeTrial &&
          reminder.subscription.trialEndsAt !== null &&
          startOfDay(addDays(today, offsetDays[reminder.offset])).getTime() ===
            startOfDay(reminder.subscription.trialEndsAt!).getTime();

        const label = offsetLabel[reminder.offset];
        const subject = isTrial
          ? `Your ${reminder.subscription.serviceName} free trial ends ${label}`
          : `${reminder.subscription.serviceName} renews ${label}`;

        const renewalDate = (
          isTrial ? reminder.subscription.trialEndsAt! : reminder.subscription.renewalDate
        ).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

        return resend.emails.send({
          from: `AevixTrack <reminders@${process.env.RESEND_DOMAIN ?? "aevixtrack.com"}>`,
          to: reminder.user.email,
          subject,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0d0d0d;color:#fff;border-radius:16px">
              <h1 style="font-size:20px;font-weight:600;margin:0 0 8px">${subject}</h1>
              <p style="color:rgba(255,255,255,0.6);margin:0 0 24px;font-size:14px">
                ${isTrial
                  ? `Your free trial of <strong>${reminder.subscription.serviceName}</strong> ends ${label}.`
                  : `Your <strong>${reminder.subscription.serviceName}</strong> subscription will renew ${label} for <strong>£${Number(reminder.subscription.cost).toFixed(2)}</strong>.`}
              </p>
              <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
                <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:13px">${isTrial ? "Trial ends" : "Renewal date"}</td><td style="padding:8px 0;font-size:13px;text-align:right">${renewalDate}</td></tr>
                ${!isTrial ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:13px">Amount</td><td style="padding:8px 0;font-size:13px;text-align:right">£${Number(reminder.subscription.cost).toFixed(2)}</td></tr>` : ""}
              </table>
              <a href="${appUrl}/dashboard" style="display:inline-block;background:#fff;color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">Manage subscriptions</a>
            </div>
          `
        });
      })
    );
  }

  await prisma.reminder.updateMany({
    where: { id: { in: due.map((r) => r.id) } },
    data: { sentAt: new Date() }
  });

  return NextResponse.json({
    queued: due.length,
    reminders: due.map((r) => ({
      email: r.user.email,
      serviceName: r.subscription.serviceName,
      offset: r.offset
    }))
  });
}
