import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect width="32" height="32" rx="7" fill="#22c55e"/>
        <path d="M9 22 L13.8 10 L16 10 L18.2 10 L23 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.2 17.5 L20.8 17.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span className="text-base font-semibold tracking-[-0.02em] text-white">AevixTrack</span>
    </Link>
  );
}
