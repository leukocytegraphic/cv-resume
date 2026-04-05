import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();
    if (!amount || typeof amount !== "number") {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const price = (amount * 0.05).toFixed(2);
    // tx_ref contains user ID and amount bought
    const txRef = `CVC_${Date.now()}_${(session.user as any).id}_${amount}`;
    const baseUrl = process.env.NEXTAUTH_URL || "https://cv.creatorops.site";

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: price,
        currency: "USD",
        redirect_url: `${baseUrl}/api/webhooks/flutterwave`,
        customer: {
          email: session.user?.email || "user@example.com",
          name: session.user?.name || "CV Builder User",
        },
        customizations: {
          title: "CreatorOps CV",
          description: `Buy ${amount} Credits`,
        },
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
       return NextResponse.json({ payment_url: data.data.link });
    } else {
       console.error("Flutterwave API Error:", data);
       // Mock success for development fallback if keys are missing
       if (!process.env.FLUTTERWAVE_SECRET_KEY) {
         return NextResponse.json({ fallback: true, mockUrl: `${baseUrl}/api/webhooks/flutterwave?status=successful&tx_ref=${txRef}` });
       }
       return NextResponse.json({ error: "Could not initialize payment" }, { status: 500 });
    }

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
