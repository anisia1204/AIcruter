import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import logoImage from "@/public/aicruterlogotop.png";
import Image from "next/image";
import ChatBot from "@/components/chat/ChatBot";
import NavbarUserSection from "@/components/NavbarUserSection";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIcruter",
  description: "AI-powered platform for recruiters and applicants.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-md py-3 px-6 shadow-lg border-b border-white/20">
          <div className="container mx-auto flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center text-xl font-bold text-gray-800 gap-2 hover:text-gray-600 transition-colors"
            >
              <Image
                src={logoImage}
                alt="AIcruter Logo"
                width={50}
                height={40}
                className="mr-2 rounded-lg"
              />
              AIcruter
            </Link>

            <NavbarUserSection />
          </div>
        </nav>

        <main className="mt-20">{children}</main>

        <Toaster />
        <ChatBot />
      </body>
    </html>
  );
}
