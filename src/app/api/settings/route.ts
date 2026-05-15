import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireAppUser();
  if ("error" in auth) return auth.error;

  const settings = await prisma.settings.upsert({
    where: { userId: auth.user.id },
    update: {},
    create: { userId: auth.user.id }
  });

  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const auth = await requireAppUser();
  if ("error" in auth) return auth.error;

  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const settings = await prisma.settings.upsert({
    where: { userId: auth.user.id },
    update: parsed.data,
    create: {
      ...parsed.data,
      userId: auth.user.id
    }
  });

  return NextResponse.json(settings);
}
