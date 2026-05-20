import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-green-500">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2 11 L5 7 L8 9.5 L11 5 L14 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-base font-semibold tracking-[-0.02em] text-white">AevixTrack</span>
    </Link>
  );
}
