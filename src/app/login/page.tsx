import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

const clerkAppearance = {
  variables: {
    colorPrimary: "#22c55e",
    colorBackground: "transparent",
    colorText: "#f0fdf4",
    colorTextSecondary: "rgba(240,253,244,0.6)",
    colorInputBackground: "rgba(0,0,0,0.45)",
    colorInputText: "#f0fdf4",
    colorNeutral: "rgba(240,253,244,0.25)",
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
    headerTitle: { color: "#f0fdf4", fontWeight: "700" },
    headerSubtitle: { color: "rgba(240,253,244,0.6)" },
    socialButtonsBlockButton: {
      border: "1px solid rgba(34,197,94,0.35)",
      background: "rgba(0,0,0,0.4)",
      color: "#f0fdf4",
      backdropFilter: "blur(8px)"
    },
    dividerLine: { background: "rgba(34,197,94,0.2)" },
    dividerText: { color: "rgba(240,253,244,0.45)" },
    formFieldLabel: { color: "rgba(240,253,244,0.75)" },
    formFieldInput: {
      background: "rgba(0,0,0,0.45)",
      border: "1px solid rgba(34,197,94,0.3)",
      color: "#f0fdf4"
    },
    formButtonPrimary: {
      background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      color: "#ffffff",
      boxShadow: "0 4px 20px rgba(34,197,94,0.35)"
    },
    footerActionLink: { color: "#4ade80", fontWeight: "600" },
    footerActionText: { color: "rgba(240,253,244,0.55)" },
    identityPreviewText: { color: "#f0fdf4" },
    identityPreviewEditButton: { color: "#4ade80" }
  }
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="rounded-[28px] border border-green-500/20 bg-black/20 p-8 shadow-2xl backdrop-blur-2xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-green-400/60 hover:text-green-400 transition-colors"
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
