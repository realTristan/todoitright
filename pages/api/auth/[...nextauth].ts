import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { sha256 } from "@/app/lib/crypto";

declare module "next-auth" {
  interface Session {
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
      accessToken: string | null;
    };
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token;
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      const bearerSecret: string | undefined = process.env.BEARER_SECRET;

      if (!bearerSecret) {
        throw new Error("BEARER_SECRET is not defined");
      }

      if (!session) {
        throw new Error("Session is not defined");
      }

      if (!session.user) {
        throw new Error("User is not defined");
      }

      const email: string | null = session.user.email || null;
      const image: string | null = session.user.image || null;
      const name: string | null = session.user.name || null;
      const accessToken: string | null = email
        ? await sha256(email + bearerSecret)
        : null;

      session.user = { email, image, name, accessToken };

      return session;
    },
  },
});
