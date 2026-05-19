import Link from "next/link";
import { ArrowRight, Bell, BarChart3, ShieldCheck, Sparkles } from "lucide-react";
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

const highlights = [
  { icon: BarChart3, text: "Full spend visibility across every subscription" },
  { icon: Bell, text: "Email reminders before every renewal hits" },
  { icon: Sparkles, text: "Free trial countdowns so you never get charged by surprise" },
  { icon: ShieldCheck, text: "Secure, private — your data stays yours" }
];

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      {/* Left — brand section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-16 py-16">
        <Link href="/" className="text-2xl font-bold tracking-tight text-green-400">
          AevixTrack
        </Link>
        <div>
          <h1 className="text-5xl font-semibold tracking-[-0.04em] leading-tight">
            Welcome back.<br />
            <span className="text-green-400">Your subscriptions</span><br />
            are waiting.
          </h1>
          <ul className="mt-10 grid gap-5">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-4">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-green-500/30">
                  <Icon className="size-4 text-green-400" />
                </span>
                <span className="text-sm leading-6 text-white/65">{text}</span>
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
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <Link href="/" className="text-sm text-green-400/60 hover:text-green-400 transition-colors">
              ← Home
            </Link>
          </div>
          <p className="mb-8 text-sm text-white/50">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-green-400 hover:text-green-300 transition-colors">
              Create one free
              <ArrowRight className="inline ml-1 size-3" />
            </Link>
          </p>
          <SignIn routing="hash" signUpUrl="/register" appearance={clerkAppearance} />
        </div>
      </div>
    </main>
  );
}
