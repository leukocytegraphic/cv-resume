import { NextRequest, NextResponse } from "next/server";
import { getCompanyProfile } from "@/lib/twitter";
import { extractCompanyNeeds, extractFromManualJobDescription } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { handle, manual, description, companyName } = body;

    if (manual) {
      if (!description) {
        return NextResponse.json(
          { error: "Job description is required" },
          { status: 400 }
        );
      }
      const analysis = await extractFromManualJobDescription(
        description,
        companyName || "the company"
      );
      return NextResponse.json({
        ...analysis,
        companyName: companyName || "Target Company",
      });
    }

    // X API path
    if (!handle) {
      return NextResponse.json({ error: "Handle is required" }, { status: 400 });
    }

    const cleanHandle = handle.replace("@", "").trim();
    const { user, tweets } = await getCompanyProfile(cleanHandle);

    if (!user) {
      return NextResponse.json(
        { error: `Could not find X account @${cleanHandle}` },
        { status: 404 }
      );
    }

    const tweetTexts = tweets.map((t) => t.text);
    const analysis = await extractCompanyNeeds(
      tweetTexts,
      user.description || "",
      user.name
    );

    return NextResponse.json({
      ...analysis,
      companyName: user.name,
    });
  } catch (err: any) {
    console.error("/api/analyze-company error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze company. Check your API keys and try again." },
      { status: 500 }
    );
  }
}
