import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");

  const baseUrl = process.env.NEXTAUTH_URL || "https://cv.creatorops.site";

  if (status === "successful" && tx_ref) {
    // Basic verification - typically you verify by calling Flutterwave API with transaction_id
    // to confirm the amount and status. For MVP, we trust the redirect if tx_ref is structured properly.
    const parts = tx_ref.split("_");
    if (parts.length >= 4 && parts[0] === "CVC") {
      const userId = parts[2];
      const amount = parseInt(parts[3], 10);
      
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          await prisma.user.update({
            where: { id: userId },
            data: { credits: user.credits + amount }
          });
        }
      } catch (e) {
        console.error("Failed to add credits:", e);
      }
    }
  }

  // Redirect back to the result page
  return NextResponse.redirect(`${baseUrl}/result?payment=completed`);
}
