import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "AevixTrack - Subscription and Free-Trial Tracker",
  description:
    "Track subscriptions, free trials, renewal dates, and reminder emails in a polished SaaS dashboard."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ClerkProvider
          signInUrl="/login"
          signUpUrl="/register"
        >
          {children}
          <Toaster richColors position="top-right" theme="dark" />
        </ClerkProvider>
      </body>
    </html>
  );
}
