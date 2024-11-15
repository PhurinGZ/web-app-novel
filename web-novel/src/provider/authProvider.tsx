"use client";
import { ReactNode } from "react"; // Import ReactNode type
import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: ReactNode; // Explicitly type the 'children' prop
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};
