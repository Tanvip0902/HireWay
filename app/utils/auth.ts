import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false; // Ensure account exists

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email ?? undefined },
          include: { accounts: true }, // Include accounts to check providers
        });

        if (existingUser) {
          const isProviderLinked = existingUser.accounts.some(
            (acc) => acc.provider === account.provider
          );

          if (!isProviderLinked) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                access_token: account.access_token ?? null,
                refresh_token: account.refresh_token ?? null,
                expires_at: account.expires_at ?? null,
                token_type: account.token_type ?? null,
                scope: account.scope ?? null,
                id_token: account.id_token ?? null,
                session_state: account.session_state ? String(account.session_state) : null, // Fix type error
              },
            });
          }
        }
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }

      return true;
    },
  },
});
