import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIcruter",
  description: "AI-powered platform for recruiters and applicants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xs py-4 px-6 shadow-sm">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-800">
              AIcruter
            </Link>
            <div>
              <Link
                href="/register"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>
        <main className="pt-20">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
