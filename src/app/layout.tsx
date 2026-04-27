import type { Metadata } from "next";
import { Inter } from "next/font/google";
import FirebaseProvider from "@/components/FirebaseProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IndiaVotes — Election Process Assistant",
  description:
    "A secure, interactive, AI-powered guide to the Indian election process. Understand voter registration, timelines, and polling steps.",
  keywords: [
    "Indian elections",
    "voter registration",
    "Form 6",
    "EPIC",
    "EVM",
    "election timeline",
    "voter guide",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Skip to main content link for keyboard/screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#FF9933] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
        >
          Skip to main content
        </a>
        <FirebaseProvider>{children}</FirebaseProvider>
      </body>
    </html>
  );
}
