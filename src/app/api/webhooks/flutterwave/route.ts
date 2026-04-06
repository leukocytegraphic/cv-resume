import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");

  const baseUrl = process.env.NEXTAUTH_URL || "https://cvbuilder.creatorops.site";

  if (status === "successful" && tx_ref && transaction_id) {
    try {
      // 1. Verify the transaction with Flutterwave
      const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });
      
      const verifyData = await verifyRes.json();
      
      if (verifyData.status === "success" && verifyData.data.status === "successful") {
        // 2. Double check the tx_ref and structure
        const parts = tx_ref.split("_");
        if (parts.length >= 4 && parts[0] === "CVC") {
          const userId = parts[2];
          const amountBought = parseInt(parts[3], 10);
          
          // Verify amount matches what is in tx_ref (optional but safer)
          // const expectedAmount = (amountBought * 0.05).toFixed(2);
          // if (verifyData.data.amount.toString() !== expectedAmount) throw new Error("Amount mismatch");

          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user) {
            await prisma.user.update({
              where: { id: userId },
              data: { credits: user.credits + amountBought }
            });
            console.log(`Successfully added ${amountBought} credits to user ${userId}`);
          }
        }
      } else {
        console.warn("Flutterwave verification failed or status not successful:", verifyData);
      }
    } catch (e) {
      console.error("Failed to verify transaction or add credits:", e);
    }
  }

  // Redirect back to the result page
  return NextResponse.redirect(`${baseUrl}/result?payment=completed`);
}
