"use client";

import { useState, FormEvent } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Bell, BarChart3, ShieldCheck, Sparkles } from "lucide-react";

const highlights = [
  { icon: BarChart3, text: "Full spend visibility across every subscription" },
  { icon: Bell, text: "Email reminders before every renewal hits" },
  { icon: Sparkles, text: "Free trial countdowns so you never get charged by surprise" },
  { icon: ShieldCheck, text: "Secure, private — your data stays yours" }
];

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogle() {
    if (!isLoaded) return;
    setGoogleLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard"
      });
    } catch {
      setError("Google sign-in failed. Try again.");
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen">
      {/* Left — brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-16 py-16">
        <Link href="/" className="text-2xl font-bold tracking-tight text-green-400">AevixTrack</Link>
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
            <Link href="/" className="text-sm text-green-400/60 hover:text-green-400 transition-colors">← Home</Link>
          </div>
          <p className="mb-8 text-sm text-white/50">
            No account?{" "}
            <Link href="/register" className="text-green-400 hover:text-green-300 transition-colors font-medium">
              Create one free
            </Link>
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || !isLoaded}
            className="mb-6 flex h-11 w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            {googleLoading ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="mb-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/35">or sign in with email</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-2 text-sm text-white/70">
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="h-11 w-full rounded-2xl border border-green-500/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-green-400/50 focus:ring-2 focus:ring-green-500/10"
              />
            </label>

            <label className="grid gap-2 text-sm text-white/70">
              Password
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-2xl border border-green-500/25 bg-transparent px-4 pr-12 text-sm text-white outline-none placeholder:text-white/25 focus:border-green-400/50 focus:ring-2 focus:ring-green-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-green-400/60 hover:text-green-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-green-500 text-sm font-semibold text-black transition hover:bg-green-400 disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
