import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await requireAppUser();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 50);

  const notifications = await prisma.notification.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { subscription: { select: { serviceName: true } } }
  });

  return NextResponse.json(notifications);
}

export async function PATCH() {
  const auth = await requireAppUser();
  if ("error" in auth) return auth.error;

  await prisma.notification.updateMany({
    where: { userId: auth.user.id, read: false },
    data: { read: true }
  });

  return NextResponse.json({ ok: true });
}
