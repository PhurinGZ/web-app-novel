// src/app/api/auth/[...nextauth]/route.tsx

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiHandler } from "next";
import User from "../../../../models/User"; // Adjust path based on your structure
import dbConnect from "../../../../lib/dbConnect"; // Ensure MongoDB connection
import bcrypt from "bcryptjs";

interface UserType {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

const authOption: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          await dbConnect();

          // Find the user by email
          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            console.error("User not found");
            return Promise.reject(new Error("User not found"));
          }

          console.log("Password to compare:", credentials?.password);
          console.log("Hashed password:", user.password);

          // Compare password
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("Password match result:", passwordMatch);

          if (!passwordMatch) {
            return Promise.reject(new Error("Incorrect password"));
          }

          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            role: user.role,
            novel_favorites: user.novel_favorites,
          };
        } catch (error: any) {
          console.error("Authorize error:", error.message);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.novel_favorites = user.novel_favorites;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as object,
          role: token.role as string,
          novel_favorites: token.novel_favorites as string,
        };
      }
      return session;
    },
  },
};

const handler: NextApiHandler = (req, res) => NextAuth(req, res, authOption);
export { handler as GET, handler as POST, authOption };
