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
}): Promise<object> {
  const { userAnalysis, companyAnalysis, selectedRole } = params;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are a professional CV writer. Create tailored, compelling CV content that matches a candidate's skills to a specific job. Write in a confident, professional tone. Always respond with valid JSON only.`,
      },
      {
        role: "user",
        content: `Create a professional CV for this candidate applying for a role.

CANDIDATE:
Name: ${userAnalysis.displayName}
Twitter: @${userAnalysis.twitterHandle}
Skills: ${userAnalysis.skills.join(", ")}
Domains: ${userAnalysis.domains.join(", ")}
Summary: ${userAnalysis.summary}
Strengths: ${userAnalysis.strengths.join(", ")}
Experience Level: ${userAnalysis.experienceLevel}

TARGET ROLE: ${selectedRole} at ${companyAnalysis.companyName}
Company Requirements: ${companyAnalysis.requirements.join(", ")}
Company Tech Stack: ${companyAnalysis.techStack.join(", ")}
Company Culture: ${companyAnalysis.culture}
Keywords to naturally incorporate: ${companyAnalysis.keywords.join(", ")}

Return a JSON object with exactly these fields:
{
  "personalInfo": {
    "name": "${userAnalysis.displayName}",
    "title": "Professional title for this application",
    "twitterHandle": "${userAnalysis.twitterHandle}",
    "summary": "3-4 sentences tailored professional summary highlighting fit for this role"
  },
  "skills": ["top 10 most relevant skills, prioritizing match with company needs"],
  "highlights": [
    { "title": "Achievement/Project Title", "description": "One powerful sentence about impact" }
  ],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company/Project Name",
      "period": "Year - Year or Present",
      "bullets": ["2-3 impact-focused bullet points"]
    }
  ],
  "education": [
    { "degree": "Degree or Certification", "school": "Institution", "year": "Year" }
  ],
  "keywords": ["important ATS keywords for this role"]
}

Note: For experience and education, create realistic but clearly labeled fictional entries based on the candidate's skills and domains since we don't have their actual history. Make 2-3 experience entries and 1-2 education entries.`,
      },
    ],
    temperature: 0.5,
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
