import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      server: "",
      from: "onboarding@resend.dev",
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        try {
          await resend.emails.send({
            from: provider.from as string,
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
        } catch (error) {
          console.error("Resend error:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow any absolute URL on the same origin (covers /result, /dashboard, etc.)
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {}
      return baseUrl;
    },
    async jwt({ token }) {
      // By default NextAuth jwt keeps token.sub which is the User ID in database
      return token;
    },
    async session({ session, token }) {
      try {
        if (token.sub) {
          const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
          if (dbUser) {
            (session.user as any).id = dbUser.id;
            (session.user as any).credits = dbUser.credits ?? 10;
          }
        }
      } catch (e) {
        console.error("Auth session lookup failed:", e);
      }
      return session;
    },
  },
};
