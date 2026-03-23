import { TwitterUser, Tweet } from "@/types";

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN!;
const BASE_URL = "https://api.twitter.com/2";

async function twitterFetch(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    next: { revalidate: 300 }, // cache 5 mins
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twitter API error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function getUserByUsername(
  username: string
): Promise<TwitterUser | null> {
  try {
    const data = await twitterFetch(
      `/users/by/username/${username}?user.fields=description,profile_image_url,public_metrics`
    );
    return data.data || null;
  } catch (e) {
    console.error("getUserByUsername error:", e);
    return null;
  }
}

export async function getUserTweets(
  userId: string,
  maxResults = 100
): Promise<Tweet[]> {
  try {
    const data = await twitterFetch(
      `/users/${userId}/tweets?max_results=${Math.min(maxResults, 100)}&tweet.fields=created_at,public_metrics&exclude=retweets,replies`
    );
    return data.data || [];
  } catch (e) {
    console.error("getUserTweets error:", e);
    return [];
  }
}

export async function getCompanyProfile(handle: string): Promise<{
  user: TwitterUser | null;
  tweets: Tweet[];
}> {
  const user = await getUserByUsername(handle.replace("@", ""));
  if (!user) return { user: null, tweets: [] };
  const tweets = await getUserTweets(user.id, 60);
  return { user, tweets };
}
