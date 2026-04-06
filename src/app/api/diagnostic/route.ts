import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
  const results: any = {
    db: "unknown",
    resend: "unknown",
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "missing",
      HAS_RESEND_KEY: !!process.env.RESEND_API_KEY,
      HAS_DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV
    }
  };

  // 1. Test Database
  try {
    const userCount = await prisma.user.count();
    results.db = `Connected. User count: ${userCount}`;
  } catch (err: any) {
    results.db = `Error: ${err.message}`;
  }

  // 2. Test Resend (just list domains or send test if query param present)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.domains.list();
    if (error) {
       results.resend = `API Error: ${error.message}`;
    } else {
       results.resend = `Success. Domains: ${data?.data?.map(d => d.name).join(", ") || "none"}`;
    }
  } catch (err: any) {
    results.resend = `Library Error: ${err.message}`;
  }

  return NextResponse.json(results);
}
