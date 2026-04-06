import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  providers: [
    EmailProvider({
      from: "onboarding@cvbuilder.creatorops.site",
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey || apiKey === 'fallback_key') {
          console.error("Missing RESEND_API_KEY");
          throw new Error("Configuration error: Missing API Key");
        }
        
        const resend = new Resend(apiKey);
        try {
          // Attempt 1: Custom verified domain
          const sender = "onboarding@creatorops.site";
          
          const { data, error } = await resend.emails.send({
            from: sender,
            to: identifier,
            subject: "Sign in to CVBuilder",
            html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; text-align: center; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
                <h1 style="color: #1a1a2e; margin-bottom: 24px;">Sign in to CVBuilder</h1>
                <p style="color: #4b5563; font-size: 16px; margin-bottom: 32px;">Click the button below to sign in. No password required.</p>
                <a href="${url}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Sign In</a>
                <p style="color: #9ca3af; font-size: 13px; margin-top: 32px;">If you didn't request this email, you can safely ignore it.</p>
              </div>
            `,
          });
          
          if (error) {
            console.error("Resend primary sender failed:", JSON.stringify(error));
            // Detailed Check: If it's a domain error, we need the user to see it.
            throw new Error(`Resend Error: ${error.message}`);
          }
          
          console.log("Resend email sent successfully:", data?.id);
        } catch (error: any) {
          console.error("Resend delivery failed:", error);
          throw new Error(error.message || "Failed to send verification email");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/result",
    error: "/result",
  },
  events: {
    async signIn(message) {
      console.log("NextAuth SignIn event:", JSON.stringify(message));
    },
    async createUser(message) {
      console.log("NextAuth CreateUser event:", JSON.stringify(message));
    },
    async linkAccount(message) {
      console.log("NextAuth LinkAccount event:", JSON.stringify(message));
    },
    async session(message) {
      // console.log("NextAuth Session event:", JSON.stringify(message));
    },
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("NextAuth signIn callback triggered for:", user?.email);
      if (account?.provider === "email") {
        console.log("Email sign-in check for:", user?.email);
        return true;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch {}
      return baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        try {
          const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
          if (dbUser) {
            (session.user as any).credits = dbUser.credits ?? 10;
          }
        } catch (e) {
          console.error("Session db check failed:", e);
        }
      }
      return session;
    },
  },
};
