import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername, getUserTweets } from "@/lib/twitter";
import { extractUserSkills, extractFromManualInput } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { handle, manual, skills, areas, displayName } = body;

    if (manual) {
      // Manual input path
      if (!skills || !displayName) {
        return NextResponse.json(
          { error: "Skills and name are required" },
          { status: 400 }
        );
      }
      const analysis = await extractFromManualInput({
        skills,
        areas: areas || "",
        displayName,
      });
      return NextResponse.json({
        ...analysis,
        twitterHandle: handle || displayName.toLowerCase().replace(/\s+/g, ""),
        displayName,
        avatarUrl: null,
      });
    }

    // X API path
    if (!handle) {
      return NextResponse.json({ error: "Handle is required" }, { status: 400 });
    }

    const cleanHandle = handle.replace("@", "").trim();
    const user = await getUserByUsername(cleanHandle);

    if (!user) {
      return NextResponse.json(
        { error: `Could not find X user @${cleanHandle}` },
        { status: 404 }
      );
    }

    const tweets = await getUserTweets(user.id, 100);
    const tweetTexts = tweets.map((t) => t.text);

    const analysis = await extractUserSkills(
      tweetTexts,
      user.description || "",
      user.name
    );

    return NextResponse.json({
      ...analysis,
      twitterHandle: cleanHandle,
      displayName: user.name,
      avatarUrl: user.profile_image_url?.replace("_normal", "_400x400"),
    });
  } catch (err) {
    console.error("/api/analyze-user error:", err);
    return NextResponse.json(
      { error: "Failed to analyze user. Please try manual input." },
      { status: 500 }
    );
  }
}
