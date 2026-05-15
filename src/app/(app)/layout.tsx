import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <Sidebar />
        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 pb-28 md:px-8 lg:py-8">
            {children}
          </div>
        </section>
      </div>
      <MobileNav />
    </main>
  );
}
