import Groq from "groq-sdk";

// Use a dummy key during Vercel build phase if env var isn't set yet
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build" });

const MODEL = "llama-3.3-70b-versatile";

export async function extractUserSkills(
  tweets: string[],
  bio: string,
  displayName: string
): Promise<{
  skills: string[];
  domains: string[];
  summary: string;
  strengths: string[];
  experienceLevel: "junior" | "mid" | "senior" | "lead";
}> {
  const tweetSample = tweets.slice(0, 80).join("\n---\n");

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are an expert talent analyzer. Analyze X/Twitter posts and bio to extract professional skills and profile. Always respond with valid JSON only.`,
      },
      {
        role: "user",
        content: `Analyze this person's X (Twitter) profile and posts to extract their professional profile.

Name: ${displayName}
Bio: ${bio || "No bio provided"}

Recent posts:
${tweetSample}

Return a JSON object with exactly these fields:
{
  "skills": ["array of specific technical and soft skills, max 12"],
  "domains": ["array of professional domains/industries, max 5"],
  "summary": "2-3 sentence professional summary based on their content",
  "strengths": ["3-5 key strengths observable from their posts"],
  "experienceLevel": "junior|mid|senior|lead based on content depth"
}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const content = completion.choices[0].message.content || "{}";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
}

export async function extractCompanyNeeds(
  tweets: string[],
  bio: string,
  companyName: string
): Promise<{
  roles: string[];
  requirements: string[];
  culture: string;
  techStack: string[];
  keywords: string[];
}> {
  const tweetSample = tweets.slice(0, 60).join("\n---\n");

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are an expert at analyzing company profiles to understand their hiring needs and culture. Always respond with valid JSON only.`,
      },
      {
        role: "user",
        content: `Analyze this company's X (Twitter) profile and posts to understand what kind of people they hire.

Company: ${companyName}
Bio: ${bio || "No bio provided"}

Recent posts:
${tweetSample}

Return a JSON object with exactly these fields:
{
  "roles": ["array of likely roles they would hire for based on content, max 6"],
  "requirements": ["array of skills/traits they seem to value, max 8"],
  "culture": "1-2 sentence description of their culture and values",
  "techStack": ["tech or tools mentioned or implied in posts, max 8"],
  "keywords": ["important buzzwords and terms they use frequently, max 10"]
}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 900,
  });

  const content = completion.choices[0].message.content || "{}";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
}

export async function generateCVData(params: {
  userAnalysis: {
    skills: string[];
    domains: string[];
    summary: string;
    strengths: string[];
    experienceLevel: string;
    displayName: string;
    twitterHandle: string;
    avatarUrl?: string;
  };
  companyAnalysis: {
    companyName: string;
    requirements: string[];
    culture: string;
    techStack: string[];
    keywords: string[];
  };
  selectedRole: string;
  reviewData?: {
    name: string;
    title: string;
    summary: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    education: { degree: string; school: string; year: string }[];
  };
}): Promise<object> {
  const { userAnalysis, companyAnalysis, selectedRole, reviewData } = params;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are a senior professional CV/resume writer and ATS specialist.
Your job is to write polished, REALISTIC CV content that passes Applicant Tracking Systems.
STRICT RULES:
1. You MUST generate 2-3 professional work experiences by logically inferring from the candidate's X (Twitter) profile data. Analyze the companies, projects, or protocols they mention (e.g., LayerEdge, OpenLedger, etc.) and create a smart, professional experience entry for each.
2. Formulate realistic job titles based on their skills (e.g., "Web3 Developer", "Developer Advocate", "Growth Strategist"). Do NOT just invent randomly; ground it in their domains and X profile context.
3. DO write powerful, ATS-optimized bullets under each experience using the CAR format: Context → Action → Result.
4. Use strong action verbs: Architected, Delivered, Optimized, Developed, Scaled, Built, Led.
5. Quantify results logically where possible to simulate a real CV (e.g. "improved metrics by X%", "managed scope of Y").
6. Leave education[] as an empty array [] unless provided in the prompt.
7. Always respond with valid JSON only.`,
      },
      {
        role: "user",
        content: `Write ATS-optimized CV content for this candidate.

CANDIDATE:
Name: ${reviewData?.name || userAnalysis.displayName}
Target Role: ${selectedRole} at ${companyAnalysis.companyName}
Experience Level: ${userAnalysis.experienceLevel}
Skills: ${userAnalysis.skills.join(", ")}
Domains: ${userAnalysis.domains.join(", ")}
Strengths: ${userAnalysis.strengths.join(", ")}
Background Summary: ${reviewData?.summary || userAnalysis.summary}

TARGET COMPANY:
Company: ${companyAnalysis.companyName}
Requirements: ${companyAnalysis.requirements.join(", ")}
Tech Stack: ${companyAnalysis.techStack.join(", ")}
Culture: ${companyAnalysis.culture}
ATS Keywords: ${companyAnalysis.keywords.join(", ")}

Return a JSON object with EXACTLY these fields:
{
  "personalInfo": {
    "name": "${reviewData?.name || userAnalysis.displayName}",
    "title": "${selectedRole}",
    "twitterHandle": "${userAnalysis.twitterHandle}",
    "summary": "3-4 sentence ATS-optimized professional summary. Open with experience level and domain. Use 2-3 keywords from the job. Close with value proposition for this specific company."
  },
  "skills": ["top 10 most relevant skills ordered by relevance to the job — exact skill names, no generic fluff"],
  "highlights": [
    {
      "title": "Achievement title using a strong action verb",
      "description": "One powerful sentence: Context + Action + measurable Result. Reference a realistic project or freelance scenario."
    }
  ],
  "experience": [
    {
      "title": "Professional Job Title (e.g. Senior Frontend Engineer)",
      "company": "Company Inferred from X (e.g., LayerEdge)",
      "period": "2023 - Present",
      "bullets": [
        "Spearheaded development of X using Y...",
        "..."
      ]
    }
  ],
  "education": [],
  "keywords": ["10-15 ATS keywords and phrases that an automated hiring system will scan for — match the job description language exactly"]
}

Generate exactly 3 highlights and exactly 2-3 logical work experiences using context from their profile domains and strengths.`,
      },
    ],
    temperature: 0.4,
    max_tokens: 2000,
  });

  const content = completion.choices[0].message.content || "{}";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
}

export async function extractFromManualInput(params: {
  skills: string;
  areas: string;
  displayName: string;
}): Promise<{
  skills: string[];
  domains: string[];
  summary: string;
  strengths: string[];
  experienceLevel: "junior" | "mid" | "senior" | "lead";
}> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are a professional career advisor. Structure the provided information into a professional profile. Always respond with valid JSON only.`,
      },
      {
        role: "user",
        content: `Structure this person's self-described skills and experience into a professional profile.

Name: ${params.displayName}
Skills they mentioned: ${params.skills}
Areas/domains: ${params.areas}

Return a JSON object with exactly these fields:
{
  "skills": ["clean list of skills, max 12"],
  "domains": ["relevant professional domains, max 5"],
  "summary": "2-3 sentence professional summary",
  "strengths": ["3-5 key strengths"],
  "experienceLevel": "junior|mid|senior|lead"
}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 700,
  });

  const content = completion.choices[0].message.content || "{}";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
}

export async function extractFromManualJobDescription(
  description: string,
  companyName: string
): Promise<{
  roles: string[];
  requirements: string[];
  culture: string;
  techStack: string[];
  keywords: string[];
}> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are a job description analyst. Extract structured information from job descriptions. Always respond with valid JSON only.`,
      },
      {
        role: "user",
        content: `Extract structured information from this job description.

Company: ${companyName}
Description: ${description}

Return a JSON object with exactly these fields:
{
  "roles": ["possible role titles that match this description"],
  "requirements": ["specific skills and experience required"],
  "culture": "brief culture description based on language used",
  "techStack": ["technologies mentioned or implied"],
  "keywords": ["important ATS keywords"]
}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 700,
  });

  const content = completion.choices[0].message.content || "{}";
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
}
