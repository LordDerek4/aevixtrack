import { addDays, startOfDay } from "date-fns";
import { NextResponse } from "next/server";
import { hasDatabaseConfig } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const offsetDays = {
  ONE_DAY: 1,
  THREE_DAYS: 3,
  SEVEN_DAYS: 7
} as const;

export async function POST(request: Request) {
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  }

  const secret = request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
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
    include: {
      user: true,
      subscription: true
    }
  });

  const due = reminders.filter((reminder) => {
    const targetDate = startOfDay(addDays(today, offsetDays[reminder.offset]));
    const renewalDate = startOfDay(reminder.subscription.renewalDate);
    const trialDate = reminder.subscription.trialEndsAt ? startOfDay(reminder.subscription.trialEndsAt) : null;
    return renewalDate.getTime() === targetDate.getTime() || trialDate?.getTime() === targetDate.getTime();
  });

  // Integrate Resend, Postmark, or Supabase Edge Functions here before marking sent.
  await prisma.reminder.updateMany({
    where: { id: { in: due.map((reminder) => reminder.id) } },
    data: { sentAt: new Date() }
  });

  return NextResponse.json({
    queued: due.length,
    reminders: due.map((reminder) => ({
      email: reminder.user.email,
      serviceName: reminder.subscription.serviceName,
      offset: reminder.offset
    }))
  });
}
