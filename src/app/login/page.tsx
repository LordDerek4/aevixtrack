import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

const clerkAppearance = {
  variables: {
    colorPrimary: "#6d28d9",
    colorBackground: "transparent",
    colorText: "#1e1040",
    colorTextSecondary: "rgba(30,16,64,0.6)",
    colorInputBackground: "rgba(255,255,255,0.55)",
    colorInputText: "#1e1040",
    colorNeutral: "rgba(30,16,64,0.25)",
    borderRadius: "12px",
    fontFamily: "inherit"
  },
  elements: {
    rootBox: { width: "100%" },
    card: {
      background: "transparent",
      boxShadow: "none",
      border: "none",
      padding: "0"
    },
    headerTitle: { color: "#1e1040", fontWeight: "700" },
    headerSubtitle: { color: "rgba(30,16,64,0.6)" },
    socialButtonsBlockButton: {
      border: "1px solid rgba(255,255,255,0.5)",
      background: "rgba(255,255,255,0.35)",
      color: "#1e1040",
      backdropFilter: "blur(8px)"
    },
    dividerLine: { background: "rgba(30,16,64,0.12)" },
    dividerText: { color: "rgba(30,16,64,0.45)" },
    formFieldLabel: { color: "rgba(30,16,64,0.75)" },
    formFieldInput: {
      background: "rgba(255,255,255,0.55)",
      border: "1px solid rgba(255,255,255,0.6)",
      color: "#1e1040"
    },
    formButtonPrimary: {
      background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
      color: "#ffffff",
      boxShadow: "0 4px 20px rgba(109,40,217,0.4)"
    },
    footerActionLink: { color: "#6d28d9", fontWeight: "600" },
    footerActionText: { color: "rgba(30,16,64,0.55)" },
    identityPreviewText: { color: "#1e1040" },
    identityPreviewEditButton: { color: "#6d28d9" }
  }
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Animated background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/design.mp4" type="video/mp4" />
      </video>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-purple-900/10" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-[28px] border border-white/40 bg-white/25 p-8 shadow-2xl backdrop-blur-2xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-indigo-900/60 hover:text-indigo-900 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>
          <SignIn
            routing="hash"
            signUpUrl="/register"
            appearance={clerkAppearance}
          />
        </div>
      </div>
    </main>
  );
}
