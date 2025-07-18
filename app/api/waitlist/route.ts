import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";
import { z } from "zod";
import * as React from 'react';
import { render } from '@react-email/render';
import { TarsWelcomeEmail } from '../../../emails/welcomeMail';
export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

const waitlistSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }).refine((val: string) => val.endsWith("@gmail.com"), {
    message: "Only @gmail.com emails are allowed",
  }),
  name: z.string()
    .min(1, "Name is required")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ'’\- ]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
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
    const userFirstname = validatedData.name;

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
        name: userFirstname, // Store the entered name
      },
    });

    // Find the user's position in the waitlist
    const position = await prisma.waitlistEntry.count({
      where: {
        createdAt: {
          lte: newEntry.createdAt,
        },
      },
    });

    // Send confirmation email using Resend
   if (process.env.RESEND_API_KEY) {
    try {
      // Use full branded HTML template for the email
      const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to TARS AI</title>
  </head>
  <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;">
    <div style="margin:0 auto;padding:20px 0 48px;">
      <img src="https://tarsai.live/static/tars-logo.png" width="170" height="50" alt="TARS AI" style="margin:0 auto;" />
      <p style="font-size:16px;line-height:26px;">Hi ${userFirstname},</p>
      <p style="font-size:16px;line-height:26px;">
        Welcome to <b>TARS AI</b>, the document intelligence platform that transforms complex archives into accessible, actionable knowledge—empowering you to search, discover, and gain insights effortlessly.
      </p>
      <div style="text-align:center;">
        <a href="https://tarsai.live" style="background-color:#393BB2;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:block;padding:12px;">Get Started with TARS AI</a>
      </div>
      <p style="font-size:16px;line-height:26px;">
        We're excited to have you on board!<br />
        The TARS AI Team
      </p>
      <hr style="border-color:#cccccc;margin:20px 0;" />
      <p style="color:#8898aa;font-size:12px;">
        TARS AI, Udaipur, Rajasthan, India<br />
        You're receiving this email because you joined the TARS AI waitlist.
      </p>
    </div>
  </body>
</html>
`;
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Your App <teammurph@tarsai.live>', // Use your verified sender
          to: newEntry.email,
          subject: 'Welcome to the Waitlist!',
          html: emailHtml,
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
      id: newEntry.id,
      position, // 1-based position in line
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