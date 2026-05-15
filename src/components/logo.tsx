import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <span className="relative grid size-11 place-items-center rounded-full bg-white text-black shadow-glow">
        <span className="absolute inset-[7px] rounded-full border-[7px] border-black/[0.85] border-r-transparent" />
      </span>
      <span className="text-base font-semibold tracking-[-0.02em] text-white">AevixTrack</span>
    </Link>
  );
}
