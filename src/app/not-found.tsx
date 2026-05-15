import Link from "next/link";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center text-white">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-white/40">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">This page drifted out of orbit.</h1>
        <p className="mx-auto mt-4 max-w-md text-white/[0.52]">Return to the dashboard or landing page to keep tracking renewals.</p>
        <div className="mt-8 flex justify-center gap-3">
          <LinkButton href="/dashboard">Dashboard</LinkButton>
          <Link href="/" className="inline-flex h-11 items-center rounded-full px-5 text-sm text-white/[0.58] hover:text-white">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
