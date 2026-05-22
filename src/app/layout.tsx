import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    "Track subscriptions, free trials, renewal dates, and reminder emails in a polished SaaS dashboard.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  themeColor: "#22c55e",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {/* GIF background on mobile — no play button, autoplay everywhere */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Design2.gif"
          alt=""
          aria-hidden
          className="fixed inset-0 -z-10 h-full w-full object-cover lg:hidden"
        />
        {/* Video background on desktop */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 -z-10 h-full w-full object-cover hidden lg:block"
        >
          <source src="/Design2.mp4" type="video/mp4" />
        </video>
        {children}
        <Toaster richColors position="top-right" theme="dark" />
      </body>
    </html>
  );
}
