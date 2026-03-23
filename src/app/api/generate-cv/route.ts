import { NextRequest, NextResponse } from "next/server";
import { generateCVData } from "@/lib/groq";
import { UserAnalysis, CompanyAnalysis } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userAnalysis,
      companyAnalysis,
      selectedRole,
    }: {
      userAnalysis: UserAnalysis;
      companyAnalysis: CompanyAnalysis;
      selectedRole: string;
    } = body;

    if (!userAnalysis || !companyAnalysis || !selectedRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const cvData = await generateCVData({
      userAnalysis: {
        ...userAnalysis,
        displayName: userAnalysis.displayName,
        twitterHandle: userAnalysis.twitterHandle,
        avatarUrl: userAnalysis.avatarUrl,
      },
      companyAnalysis: {
        companyName: companyAnalysis.companyName,
        requirements: companyAnalysis.requirements,
        culture: companyAnalysis.culture,
        techStack: companyAnalysis.techStack,
        keywords: companyAnalysis.keywords,
      },
      selectedRole,
    });

    return NextResponse.json(cvData);
  } catch (err) {
    console.error("/api/generate-cv error:", err);
    return NextResponse.json(
      { error: "Failed to generate CV. Please try again." },
      { status: 500 }
    );
  }
}
