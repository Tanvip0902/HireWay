import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    JobSeeker?: boolean | null; // Adjust based on your database schema
    Company?: boolean | null;
  }

  interface Session {
    user: User;
  }
}
