export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  description?: string;
  profile_image_url?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

export interface Tweet {
  id: string;
  text: string;
  created_at?: string;
  public_metrics?: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
}

export interface UserAnalysis {
  skills: string[];
  domains: string[];
  summary: string;
  strengths: string[];
  experienceLevel: "junior" | "mid" | "senior" | "lead";
  twitterHandle: string;
  displayName: string;
  avatarUrl?: string;
}

export interface CompanyAnalysis {
  companyName: string;
  roles: string[];
  requirements: string[];
  culture: string;
  techStack: string[];
  keywords: string[];
}

export interface CVData {
  personalInfo: {
    name: string;
    title: string;
    twitterHandle: string;
    avatarUrl?: string;
    summary: string;
  };
  skills: string[];
  highlights: { title: string; description: string }[];
  experience: {
    title: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
  education: { degree: string; school: string; year: string }[];
  targetRole: string;
  targetCompany: string;
  keywords: string[];
}

export type CVTemplate = "modern" | "professional" | "minimal";

export interface ReviewData {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  title: string;
  summary: string;
  education: { degree: string; school: string; year: string }[];
}

export interface BuilderState {
  step: number;
  // Step 1
  useXAuth: boolean;
  twitterHandle: string;
  manualSkills: string;
  manualAreas: string;
  // Step 2
  companyHandle: string;
  manualJobDescription: string;
  useManualCompany: boolean;
  // Step 3
  selectedRole: string;
  customRole: string;
  // Step 4 - Review & Edit
  reviewData: ReviewData | null;
  // Step 5
  selectedTemplate: CVTemplate;
  // Analysis results
  userAnalysis: UserAnalysis | null;
  companyAnalysis: CompanyAnalysis | null;
  cvData: CVData | null;
  // Loading states
  analyzingUser: boolean;
  analyzingCompany: boolean;
  generatingCV: boolean;
  error: string | null;
}

