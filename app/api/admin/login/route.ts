import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const admin = await prisma.waitlistEntry.findUnique({
    where: { email },
  });
  if (admin && admin.isAdmin) {
    // Set a cookie or session here if needed
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
} 