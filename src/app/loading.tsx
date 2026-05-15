import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-black p-6">
      <div className="mx-auto grid max-w-7xl gap-4">
        <Skeleton className="h-20" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </main>
  );
}
