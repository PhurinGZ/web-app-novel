import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import UserProvider from "@/context/UserProvider";
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import { AuthProvider } from "@/provider/authProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${inter.className} min-h-screen`}>
          <nav className="sticky top-0 z-50">
            <NavBar />
          </nav>
          <main>{children}</main>
          <footer>
            <Footer />
          </footer>
        </body>
      </AuthProvider>
    </html>
  );
}
