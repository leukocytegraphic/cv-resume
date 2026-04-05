import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If result page is in the URL, strictly return it
      if (url.includes("/result")) return url.startsWith(baseUrl) ? url : `${baseUrl}${url}`;
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow absolute URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.twitterId = profile?.sub;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).twitterId = token.twitterId;

      if (token.sub) {
        // Find user by either token sub directly (if adapter linked it) or by account
        let dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        if (!dbUser) {
          dbUser = await prisma.user.findFirst({
            where: { accounts: { some: { providerAccountId: token.twitterId as string } } },
          });
        }
        
        if (dbUser) {
          (session.user as any).id = dbUser.id;
          (session.user as any).credits = dbUser.credits;
        }
      }
      return session;
    },
  },
};
