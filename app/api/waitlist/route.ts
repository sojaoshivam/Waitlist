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

  <body style="margin:0;padding:0;background:#ffffff;
               font-family:-apple-system,BlinkMacSystemFont,
               'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,
               'Helvetica Neue',sans-serif;color:#1a1a1a;">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      
      <!-- Logo -->
      <div style="text-align:center;margin-bottom:28px;">
        <img src="https://tarsai.live/static/tars-logo.png"
             width="170" height="50" alt="TARS AI" />
      </div>

      <!-- Greeting -->
      <p style="font-size:18px;line-height:28px;margin:0 0 16px;">
        Hi&nbsp;${userFirstname},
      </p>

      <!-- Opening copy -->
      <p style="font-size:16px;line-height:26px;margin:0 0 14px;">
        Thank you for hopping on the TARS AI early-access wait-list!  
        We’re thrilled to have curious minds like yours on board.
      </p>

      <!-- Value prop -->
      <p style="font-size:16px;line-height:26px;margin:0 0 14px;">
        TARS AI turns scattered, complex document archives into 
        instantly searchable knowledge—so you can discover insights 
        <em>exactly</em> when you need them.
      </p>

      <!-- What happens next -->
      <p style="font-size:16px;line-height:26px;margin:0 0 24px;">
        We’re rolling out invitations in small waves to be sure every
        new user has a smooth experience. When your turn comes up,
        you’ll receive an e-mail with your personal access link.
      </p>

      <!-- CTA button -->
      <div style="text-align:center;margin:32px 0;">
        <a href="https://tarsai.live"
           style="background:#393BB2;border-radius:4px;
                  color:#ffffff;text-decoration:none;
                  font-size:16px;display:inline-block;
                  padding:12px 24px;">
          Sneak a Peek at TARS AI
        </a>
      </div>

      <!-- Closing -->
      <p style="font-size:16px;line-height:26px;margin:0 0 18px;">
        We can’t wait to show you what we’re building.
        If you have any questions, ideas or use-cases you’d like to
        share, simply reply to this e-mail—we’d love to hear from you!
      </p>

      <p style="font-size:16px;line-height:26px;margin:0 0 40px;">
        Talk soon,<br/>
        <strong>The TARS AI Team</strong> 🚀
      </p>

      <!-- Divider -->
      <hr style="border:0;border-top:1px solid #e2e2e2;margin:0 0 24px;"/>

      <!-- Footer -->
      <p style="color:#8898aa;font-size:12px;line-height:18px;margin:0;">
        TARS AI · Udaipur, Rajasthan, India<br/>
        You’re receiving this e-mail because you joined the TARS AI wait-list.
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
          from: 'Team TARS AI <teammurph@tarsai.live>',
          to: newEntry.email,
          subject: 'Welcome aboard',
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