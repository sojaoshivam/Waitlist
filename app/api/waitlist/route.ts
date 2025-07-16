import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";
import { z } from "zod";
export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

const waitlistSchema = z.object({
  email: z.string().email().refine((val: string) => val.endsWith("@gmail.com"), {
    message: "Only @gmail.com emails are allowed",
  }),
});

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  // Remove timestamps older than 1 minute
  const recent = timestamps.filter(ts => now - ts < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    rateLimitMap.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

export async function POST(request: NextRequest) {
  // Rate limit check
  const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const validatedData = waitlistSchema.parse(body);

    // Check if email already exists
    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEntry) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // Create new entry
    const newEntry = await prisma.waitlistEntry.create({
      data: {
        email: validatedData.email,
      },
    });

    // Send confirmation email using Resend
   // Send confirmation email using Resend
   if (process.env.RESEND_API_KEY) {
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Your App <teammurph@tars.live>', // Use your verified sender
          to: newEntry.email,
          subject: 'Welcome to the Waitlist!',
          html: '<p>Thank you for joining the waitlist!</p>',
        }),
      });
      const emailData = await emailRes.json();
      console.log('Resend response:', emailData);
      if (!emailRes.ok) {
        console.error('Resend error:', emailData);
      }
    } catch (err) {
      console.error('Resend API call failed:', err);
    }
  }


    return NextResponse.json({
      message: "Successfully joined waitlist",
      email: newEntry.email,
      createdAt: newEntry.createdAt,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    if ((error as any)?.name === 'ZodError') {
      return NextResponse.json(
        { message: "Invalid input data", errors: (error as any).issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const entries = await prisma.waitlistEntry.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({
      total: entries.length,
      entries,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}