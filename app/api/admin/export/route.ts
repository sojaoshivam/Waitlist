import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const entries = await prisma.waitlistEntry.findMany({
      orderBy: { createdAt: "asc" },
    });
    const csvHeader = "Email,Joined Date\n";
    const csvData = entries
      .map((entry: { email: string; createdAt: Date | string }) => {
        const date = new Date(entry.createdAt).toLocaleDateString("en-US");
        return `"${entry.email}","${date}"`;
      })
      .join("\n");

    const csvContent = csvHeader + csvData;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}