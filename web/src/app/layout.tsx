import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import logoImage from "@/public/aicruterlogotop.png";
import Image from "next/image";
import { cookies } from "next/headers";
import { UserCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SignOutButton } from "@/components/SignOutButton";
import ChatBot from "@/components/chat/ChatBot";

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
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  let firstName = "";
  let lastName = "";

  if (userCookie?.value) {
    try {
      const user = JSON.parse(userCookie.value);
      firstName = user.firstName;
      lastName = user.lastName;
    } catch (e) {
      console.error("Invalid user cookie: ", e);
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xs py-2 px-6 shadow-sm">
          <div className="container mx-auto flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center text-xl font-bold text-gray-800 gap-2 hover:text-gray-600"
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

            <div className="flex items-center gap-4">
              {firstName && lastName ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 hover:underline focus:outline-none">
                      <UserCircle className="text-gray-700" />
                      <span className="cursor-pointer">
                        Welcome,{" "}
                        <span className="font-bold">
                          {firstName} {lastName}!
                        </span>
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44">
                    <div className="flex flex-col gap-2">
                      <SignOutButton />
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div>
                  <Link href="/login">Login</Link>
                </div>
              )}

              {!firstName && (
                <Link
                  href="/register"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md"
                >
                  Register
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="mt-20">{children}</main>

        <Toaster />
        <ChatBot />
      </body>
    </html>
  );
}
