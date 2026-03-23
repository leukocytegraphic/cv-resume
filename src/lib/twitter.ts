/**
 * twitter.ts — X profile scraper using Jina Reader (free, no API key needed).
 * Jina fetches the public X profile page and returns markdown text we can parse.
 */

const JINA_BASE = "https://r.jina.ai";

async function jinaFetch(url: string): Promise<string> {
  const res = await fetch(`${JINA_BASE}/${url}`, {
    headers: {
      "Accept": "text/plain",
    },
    next: { revalidate: 300 }, // cache 5 min
  });
  if (!res.ok) throw new Error(`Jina fetch failed ${res.status}: ${url}`);
  return res.text();
}

export interface XProfile {
  name: string;
  description: string;
  username: string;
  profileImageUrl: string | null;
}

export interface XTweet {
  text: string;
}

function parseProfileFromMarkdown(md: string, username: string): XProfile {
  // Extract display name from the title line (Title: NAME ...)
  const titleMatch = md.match(/^Title:\s*(.+)/m);
  const name = titleMatch ? titleMatch[1].split("(")[0].trim().replace(/[^\w\s-]/g, "").trim() : username;

  // Get the main text block (after URL: line)
  const urlIdx = md.indexOf("\nURL:");
  const body = urlIdx > 0 ? md.slice(urlIdx) : md;

  // Try to extract sentence-like bio text from the body
  const lines = body.split("\n").map(l => l.trim()).filter(Boolean);
  // The bio is usually in the first few non-link sentences
  const bioLines = lines
    .filter(l => !l.startsWith("http") && !l.startsWith("[") && !l.startsWith("!") && l.length > 30)
    .slice(0, 3)
    .join(" ")
    .substring(0, 300);

  return {
    name: name || username,
    username,
    description: bioLines,
    profileImageUrl: null,
  };
}

function extractTweetsFromMarkdown(md: string): XTweet[] {
  const lines = md.split("\n").map(l => l.trim()).filter(Boolean);

  const tweets: XTweet[] = [];
  for (const line of lines) {
    // Skip links, images, and very short lines
    if (line.startsWith("http") || line.startsWith("!") || line.startsWith("[") || line.length < 20) continue;
    // Skip nav-like lines
    if (/^\d+$/.test(line)) continue;
    tweets.push({ text: line });
    if (tweets.length >= 50) break;
  }
  return tweets;
}

export async function getUserProfile(username: string): Promise<{
  profile: XProfile;
  tweets: XTweet[];
} | null> {
  try {
    const cleanUsername = username.replace("@", "").trim();
    const md = await jinaFetch(`https://x.com/${cleanUsername}`);
    const profile = parseProfileFromMarkdown(md, cleanUsername);
    const tweets = extractTweetsFromMarkdown(md);
    return { profile, tweets };
  } catch (e) {
    console.error("getUserProfile error:", e);
    return null;
  }
}

// Backwards compat helpers used by existing API routes
export async function getUserByUsername(username: string) {
  const result = await getUserProfile(username);
  if (!result) return null;
  return {
    id: result.profile.username,
    name: result.profile.name,
    description: result.profile.description,
    profile_image_url: result.profile.profileImageUrl,
  };
}

export async function getUserTweets(userId: string, _maxResults = 100) {
  // userId here is the username since we don't have real IDs from Jina
  const result = await getUserProfile(userId);
  return result ? result.tweets.map(t => ({ text: t.text })) : [];
}

export async function getCompanyProfile(handle: string): Promise<{
  user: { id: string; name: string; description: string; profile_image_url: string | null } | null;
  tweets: { text: string }[];
}> {
  const result = await getUserProfile(handle);
  if (!result) return { user: null, tweets: [] };
  return {
    user: {
      id: result.profile.username,
      name: result.profile.name,
      description: result.profile.description,
      profile_image_url: result.profile.profileImageUrl,
    },
    tweets: result.tweets,
  };
}
