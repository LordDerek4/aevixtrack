import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SignUp } from "@clerk/nextjs";

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
    card: { background: "transparent", boxShadow: "none", border: "none", padding: "0" },
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

const included = [
  "Up to 10 subscriptions on the free plan",
  "Trial progress bars and renewal countdowns",
  "Email reminders before every charge",
  "Spend analytics by category",
  "No credit card required to start"
];

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen">
      {/* Left — brand section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-16 py-16">
        <Link href="/" className="text-2xl font-bold tracking-tight text-green-400">
          AevixTrack
        </Link>
        <div>
          <h1 className="text-5xl font-semibold tracking-[-0.04em] leading-tight">
            Take control of<br />
            <span className="text-green-400">every subscription</span><br />
            you own.
          </h1>
          <p className="mt-6 text-base leading-7 text-white/55">
            The average person wastes £300+ a year on forgotten renewals and auto-converted free trials.
            AevixTrack surfaces every charge before it happens.
          </p>
          <ul className="mt-8 grid gap-4">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/65">
                <Check className="size-4 shrink-0 text-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-white/30">© 2026 AevixTrack. All rights reserved.</p>
      </div>

      {/* Right — form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="text-xl font-bold text-green-400">AevixTrack</Link>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Create account</h2>
            <Link href="/" className="text-sm text-green-400/60 hover:text-green-400 transition-colors">
              ← Home
            </Link>
          </div>
          <p className="mb-8 text-sm text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="text-green-400 hover:text-green-300 transition-colors">
              Sign in
              <ArrowRight className="inline ml-1 size-3" />
            </Link>
          </p>
          <SignUp routing="hash" signInUrl="/login" appearance={clerkAppearance} />
        </div>
      </div>
    </main>
  );
}
