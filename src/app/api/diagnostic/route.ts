import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testEmail = searchParams.get("testEmail");

  const results: any = {
    db: "unknown",
    tokenTest: "skipped",
    resend: "unknown",
    emailTest: "skipped",
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "missing",
      HAS_RESEND_KEY: !!process.env.RESEND_API_KEY,
      HAS_DATABASE_URL: !!process.env.DATABASE_URL,
    }
  };

  // 1. Test Database
  try {
    const userCount = await prisma.user.count();
    results.db = `Connected. User count: ${userCount}`;
    
    // 1b. Test Writing (VerificationToken)
    const testToken = await prisma.verificationToken.create({
      data: {
        identifier: "test@example.com",
        token: `test-${Date.now()}`,
        expires: new Date(Date.now() + 1000 * 60)
      }
    });
    results.tokenTest = `Success. Created token ID: ${testToken.token}`;
    await prisma.verificationToken.delete({ where: { token: testToken.token } });
  } catch (err: any) {
    results.db = `Error: ${err.message}`;
    results.tokenTest = `Error: ${err.message}`;
  }

  // 2. Test Resend
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.domains.list();
    if (error) {
       results.resend = `API Error: ${error.message}`;
    } else {
       results.resend = `Success. Domains: ${data?.data?.map(d => d.name).join(", ") || "none"}`;
    }
  } catch (err: any) {
    results.resend = `Library Error: ${err.message}`;
  }

  // 3. Optional Email Test
  if (testEmail && process.env.RESEND_API_KEY) {
    try {
      const { data, error } = await resend.emails.send({
        from: "onboarding@cvbuilder.creatorops.site",
        to: testEmail,
        subject: "Diagnostic Test Email",
        html: "<p>If you see this, Resend is working correctly!</p>"
      });
      results.emailTest = error ? `Error: ${error.message}` : `Success. ID: ${data?.id}`;
    } catch (err: any) {
      results.emailTest = `Catch Error: ${err.message}`;
    }
  }

  return NextResponse.json(results);
}
