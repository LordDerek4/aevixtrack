import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SignUp } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

const clerkAppearance = {
  variables: {
    colorPrimary: "#d8e3dc",
    colorBackground: "#0d0d0d",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.5)",
    colorInputBackground: "rgba(255,255,255,0.04)",
    colorInputText: "#ffffff",
    colorNeutral: "rgba(255,255,255,0.18)",
    borderRadius: "12px",
    fontFamily: "inherit"
  },
  elements: {
    rootBox: { width: "100%" },
    card: {
      background: "transparent",
      boxShadow: "none",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "24px",
      padding: "28px"
    },
    headerTitle: { color: "#ffffff" },
    headerSubtitle: { color: "rgba(255,255,255,0.5)" },
    socialButtonsBlockButton: {
      border: "1px solid rgba(255,255,255,0.1)",
      background: "rgba(255,255,255,0.04)",
      color: "rgba(255,255,255,0.85)"
    },
    dividerLine: { background: "rgba(255,255,255,0.1)" },
    dividerText: { color: "rgba(255,255,255,0.3)" },
    formFieldInput: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#ffffff"
    },
    formButtonPrimary: {
      background: "#ffffff",
      color: "#000000"
    },
    footerActionLink: { color: "#d8e3dc" },
    footerActionText: { color: "rgba(255,255,255,0.4)" },
    identityPreviewText: { color: "rgba(255,255,255,0.8)" },
    identityPreviewEditButton: { color: "#d8e3dc" }
  }
};

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen text-white lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-black p-8 lg:block">
        <div className="hero-mist noise flex h-full flex-col justify-between rounded-[36px] border border-white/10 p-8">
          <Logo />
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
              <ShieldCheck className="size-4" />
              Renewal protection
            </div>
            <h1 className="text-6xl font-semibold tracking-[-0.065em]">
              Keep every trial and renewal in view.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/[0.58]">
              AevixTrack gives your subscriptions a home that feels focused, premium, and easy to trust.
            </p>
          </div>
          <p className="text-sm text-white/[0.36]">Designed for founders, operators, and tool-heavy teams.</p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-white/[0.56] hover:text-white">
            <ArrowLeft className="size-4" />
            Back home
          </Link>
          <SignUp routing="hash" signInUrl="/login" appearance={clerkAppearance} />
        </div>
      </section>
    </main>
  );
}
