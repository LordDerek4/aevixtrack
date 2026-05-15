import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="glass flex min-h-[320px] flex-col items-center justify-center rounded-[32px] p-8 text-center">
      <div className="relative mb-6 grid size-24 place-items-center rounded-full bg-white/[0.08]">
        <div className="absolute inset-3 rounded-full border border-white/10" />
        <Sparkles className="size-9 text-fog" />
      </div>
      <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">No subscriptions yet</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-white/[0.56]">
        Add your first tool, trial, or membership and AevixTrack will begin watching renewals.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        <Plus className="size-4" />
        Add subscription
      </Button>
    </div>
  );
}
