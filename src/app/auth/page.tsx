"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Eye, EyeOff, Loader2, Bell, BarChart3, ShieldCheck, Sparkles } from "lucide-react";

/* ── brand panel data ─────────────────────────────────────────────── */

const perks = [
  { icon: BarChart3,   text: "Full spend visibility across every subscription" },
  { icon: Bell,        text: "Email reminders before every renewal hits" },
  { icon: Sparkles,    text: "Free trial countdowns — never get charged by surprise" },
  { icon: ShieldCheck, text: "Secure and private — your data stays yours" },
];

const included = [
  "Up to 10 subscriptions on the free plan",
  "Trial progress bars and renewal countdowns",
  "Email reminders before every charge",
  "Spend analytics by category",
  "No credit card required to start",
];

/* ── Google SVG ───────────────────────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

/* ── password strength ────────────────────────────────────────────── */

type Strength = "weak" | "medium" | "strong";

function getStrength(pw: string): Strength | null {
  if (!pw) return null;
  const score = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[a-z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ].filter(Boolean).length;
  if (score <= 2) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}

const STRENGTH: Record<Strength, { bars: number; bar: string; text: string; hint: string }> = {
  weak:   { bars: 1, bar: "bg-red-400",   text: "text-red-400",   hint: "Add uppercase letters, numbers or symbols" },
  medium: { bars: 2, bar: "bg-amber-400", text: "text-amber-400", hint: "Add a symbol to make it stronger" },
  strong: { bars: 3, bar: "bg-green-400", text: "text-green-400", hint: "Strong password" },
};

/* ── shared input class ───────────────────────────────────────────── */

const input =
  "h-11 w-full rounded-2xl border border-green-500/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-green-400/50 focus:ring-2 focus:ring-green-500/10";

/* ── page ─────────────────────────────────────────────────────────── */

type Mode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  const [mode, setMode] = useState<Mode>("signin");

  /* shared */
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [busy, setBusy]         = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  /* sign-up verification */
  const [verifying, setVerifying]   = useState(false);
  const [code, setCode]             = useState("");
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const strength = getStrength(password);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setShowPw(false);
    setVerifying(false);
    setCode("");
  }

  /* ── Google ─────────────────────────────────────────────────────── */

  async function handleGoogle() {
    const auth = mode === "signin" ? signIn : signUp;
    if (!auth) return;
    setGoogleBusy(true);
    try {
      await auth.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch {
      setError("Google sign-in failed — try again.");
      setGoogleBusy(false);
    }
  }

  /* ── Sign in ────────────────────────────────────────────────────── */

  async function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!signIn || !setSignInActive) return;
    setBusy(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message ?? "Incorrect email or password.");
    } finally {
      setBusy(false);
    }
  }

  /* ── Sign up ────────────────────────────────────────────────────── */

  async function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!signUp) return;
    setBusy(true);
    setError("");
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message ?? "Could not create account — try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!signUp || !setSignUpActive) return;
    setVerifyBusy(true);
    setVerifyError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setVerifyError(err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message ?? "Invalid code — try again.");
    } finally {
      setVerifyBusy(false);
    }
  }

  const isLoaded = mode === "signin" ? signInLoaded : signUpLoaded;

  /* ── render ─────────────────────────────────────────────────────── */

  return (
    <main className="flex min-h-screen text-white">

      {/* ── Left brand ──────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-1/2 flex-col justify-between px-16 py-16">
        <Link href="/" className="text-2xl font-bold text-green-400 tracking-tight">AevixTrack</Link>

        {mode === "signin" ? (
          <div>
            <h1 className="text-5xl font-semibold tracking-[-0.04em] leading-tight">
              Welcome back.<br />
              <span className="text-green-400">Your subscriptions</span><br />
              are waiting.
            </h1>
            <ul className="mt-10 space-y-5">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-4">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-green-500/30">
                    <Icon className="size-4 text-green-400" />
                  </span>
                  <span className="text-sm leading-6 text-white/60">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h1 className="text-5xl font-semibold tracking-[-0.04em] leading-tight">
              Take control of<br />
              <span className="text-green-400">every subscription</span><br />
              you own.
            </h1>
            <p className="mt-6 text-base leading-7 text-white/55">
              The average person wastes £300+ a year on forgotten renewals. AevixTrack surfaces every charge before it happens.
            </p>
            <ul className="mt-8 space-y-4">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/65">
                  <Check className="size-4 shrink-0 text-green-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-white/30">© 2026 AevixTrack. All rights reserved.</p>
      </aside>

      {/* ── Right form ──────────────────────────────────────────────── */}
      <section className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-6">

          {/* Mobile logo */}
          <div className="flex items-center justify-between lg:hidden">
            <Link href="/" className="text-xl font-bold text-green-400">AevixTrack</Link>
            <Link href="/" className="text-sm text-green-400/60 hover:text-green-400 transition-colors">← Home</Link>
          </div>

          {verifying ? (
            /* ── Verification ──────────────────────────────────────── */
            <>
              <div>
                <h2 className="text-2xl font-semibold">Check your email</h2>
                <p className="mt-2 text-sm text-white/50">
                  We sent a 6-digit code to <span className="text-white/80">{email}</span>.
                </p>
              </div>

              {verifyError && (
                <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {verifyError}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm text-white/70" htmlFor="code">Verification code</label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="h-14 w-full rounded-2xl border border-green-500/25 bg-transparent px-4 text-center text-2xl font-semibold tracking-[0.3em] text-white outline-none placeholder:text-white/20 focus:border-green-400/50 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={verifyBusy || code.length < 6}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-green-500 text-sm font-semibold text-black transition hover:bg-green-400 disabled:opacity-50"
                >
                  {verifyBusy ? <Loader2 className="size-4 animate-spin" /> : "Verify & continue"}
                </button>
                <button type="button" onClick={() => setVerifying(false)}
                  className="block w-full text-center text-sm text-white/40 transition hover:text-white/70">
                  ← Back
                </button>
              </form>
            </>
          ) : (
            /* ── Auth form ─────────────────────────────────────────── */
            <>
              {/* Tabs */}
              <div className="flex rounded-2xl border border-green-500/20 p-1 gap-1">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
                    mode === "signin"
                      ? "bg-green-500 text-black"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
                    mode === "signup"
                      ? "bg-green-500 text-black"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Create account
                </button>
              </div>

              {/* Desktop home link */}
              <div className="hidden lg:flex justify-end">
                <Link href="/" className="text-sm text-green-400/60 hover:text-green-400 transition-colors">← Home</Link>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleBusy || !isLoaded}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
              >
                {googleBusy ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
                {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/35">or continue with email</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">

                <div className="space-y-2">
                  <label className="block text-sm text-white/70" htmlFor="email">Email address</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={input}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/70" htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "signin" ? "Enter your password" : "Create a strong password"}
                      className={`${input} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/80"
                    >
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>

                  {/* Strength meter — sign up only */}
                  {mode === "signup" && strength && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <div key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${i < STRENGTH[strength].bars ? STRENGTH[strength].bar : "bg-white/10"}`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${STRENGTH[strength].text}`}>{STRENGTH[strength].hint}</p>
                    </div>
                  )}

                  {/* Forgot password — sign in only */}
                  {mode === "signin" && (
                    <div className="text-right">
                      <Link href="/forgot-password"
                        className="text-xs text-green-400/60 hover:text-green-400 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={busy || !isLoaded || (mode === "signup" && strength === "weak")}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-green-500 text-sm font-semibold text-black transition hover:bg-green-400 disabled:opacity-50"
                >
                  {busy
                    ? <Loader2 className="size-4 animate-spin" />
                    : mode === "signin" ? "Sign in" : "Create account"
                  }
                </button>

                {mode === "signup" && strength === "weak" && password.length > 0 && (
                  <p className="text-center text-xs text-white/35">Strengthen your password to continue</p>
                )}

              </form>
            </>
          )}

        </div>
      </section>
    </main>
  );
}
