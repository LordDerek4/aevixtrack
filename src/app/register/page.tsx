"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";

const included = [
  "Up to 10 subscriptions on the free plan",
  "Trial progress bars and renewal countdowns",
  "Email reminders before every charge",
  "Spend analytics by category",
  "No credit card required to start",
];

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

function passwordStrength(pw: string): "weak" | "medium" | "strong" | null {
  if (!pw) return null;
  const long    = pw.length >= 8;
  const upper   = /[A-Z]/.test(pw);
  const lower   = /[a-z]/.test(pw);
  const digit   = /[0-9]/.test(pw);
  const special = /[^A-Za-z0-9]/.test(pw);
  const score   = [long, upper, lower, digit, special].filter(Boolean).length;
  if (score <= 2) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [error, setError]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const [verifying, setVerifying]         = useState(false);
  const [code, setCode]                   = useState("");
  const [verifyBusy, setVerifyBusy]       = useState(false);
  const [verifyError, setVerifyError]     = useState("");

  const strength = passwordStrength(password);

  const strengthBar = {
    weak:   { bars: 1, barColor: "bg-red-400",   label: "Weak",   labelColor: "text-red-400",   hint: " — add uppercase, numbers or symbols" },
    medium: { bars: 2, barColor: "bg-amber-400",  label: "Medium", labelColor: "text-amber-400", hint: " — add a symbol to make it stronger" },
    strong: { bars: 3, barColor: "bg-green-400",  label: "Strong", labelColor: "text-green-400", hint: "" },
  };

  async function signUpWithGoogle() {
    if (!signUp) return;
    setGoogleBusy(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch {
      setError("Google sign-up failed — try again.");
      setGoogleBusy(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!signUp) return;
    setSubmitting(true);
    setError("");
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message ?? "Could not create account — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!signUp || !setActive) return;
    setVerifyBusy(true);
    setVerifyError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setVerifyError(err?.errors?.[0]?.longMessage ?? err?.errors?.[0]?.message ?? "Invalid code — check your email and try again.");
    } finally {
      setVerifyBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen text-white">

      {/* ── Left brand panel ──────────────────────────────── */}
      <aside className="hidden lg:flex w-1/2 flex-col justify-between px-16 py-16">
        <Link href="/" className="text-2xl font-bold text-green-400 tracking-tight">AevixTrack</Link>

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

        <p className="text-xs text-white/30">© 2026 AevixTrack. All rights reserved.</p>
      </aside>

      {/* ── Right form panel ──────────────────────────────── */}
      <section className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-6">

          {/* Mobile logo */}
          <div className="lg:hidden">
            <Link href="/" className="text-xl font-bold text-green-400">AevixTrack</Link>
          </div>

          {verifying ? (
            /* ── Email verification ────────────────────────── */
            <>
              <div>
                <h2 className="text-2xl font-semibold">Check your email</h2>
                <p className="mt-2 text-sm text-white/50">
                  We sent a 6-digit code to <span className="text-white/80">{email}</span>. Enter it below to activate your account.
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

                <button
                  type="button"
                  onClick={() => setVerifying(false)}
                  className="block w-full text-center text-sm text-white/40 transition hover:text-white/70"
                >
                  ← Back
                </button>
              </form>
            </>
          ) : (
            /* ── Sign-up form ──────────────────────────────── */
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Create account</h2>
                <Link href="/" className="text-sm text-green-400/60 hover:text-green-400 transition-colors">← Home</Link>
              </div>

              <p className="text-sm text-white/50">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-green-400 hover:text-green-300 transition-colors">Sign in</Link>
              </p>

              {/* Google */}
              <button
                type="button"
                onClick={signUpWithGoogle}
                disabled={googleBusy || !isLoaded}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
              >
                {googleBusy ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/35">or sign up with email</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

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
                    className="h-11 w-full rounded-2xl border border-green-500/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-green-400/50 focus:ring-2 focus:ring-green-500/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-white/70" htmlFor="password">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="h-11 w-full rounded-2xl border border-green-500/25 bg-transparent px-4 pr-12 text-sm text-white outline-none placeholder:text-white/25 focus:border-green-400/50 focus:ring-2 focus:ring-green-500/10"
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

                  {/* Strength meter */}
                  {strength && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${i < strengthBar[strength].bars ? strengthBar[strength].barColor : "bg-white/10"}`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${strengthBar[strength].labelColor}`}>
                        {strengthBar[strength].label}{strengthBar[strength].hint}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || !isLoaded || strength === "weak"}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-green-500 text-sm font-semibold text-black transition hover:bg-green-400 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
                </button>

                {strength === "weak" && password.length > 0 && (
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
