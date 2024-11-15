// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "./auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Optional: Add types for session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      novel_favorites: string[];
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    novel_favorites: string[];
  }
}