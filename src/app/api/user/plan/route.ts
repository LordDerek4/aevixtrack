import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasDatabaseConfig } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !hasDatabaseConfig()) {
    return NextResponse.json({ planTier: null });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { planTier: true }
  });

  return NextResponse.json({ planTier: dbUser?.planTier ?? "STARTER" });
}
