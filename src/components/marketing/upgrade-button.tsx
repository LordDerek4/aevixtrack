"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface UpgradeButtonProps {
  plan: "PRO" | "BUSINESS";
  className?: string;
  variant?: "primary" | "secondary";
  selected?: boolean;
}

export function UpgradeButton({ plan, className, variant = "secondary", selected = false }: UpgradeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsSignedIn(!!data.user));
  }, []);

  async function handleUpgrade() {
    if (selected) return;

    if (!isSignedIn) {
      router.push(`/auth?redirect=/pricing`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error?.includes("Already subscribed")) {
        const portal = await fetch("/api/stripe/portal", { method: "POST" });
        const portalData = (await portal.json()) as { url?: string };
        if (portalData.url) window.location.href = portalData.url;
      } else {
        toast.error(data.error ?? "Payments are not configured yet.");
      }
    } catch {
      toast.error("Could not connect to payment service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      className={cn(
        className,
        selected && "ring-2 ring-green-400/60 ring-offset-2 ring-offset-transparent shadow-[0_0_16px_rgba(74,222,128,0.35)]"
      )}
      onClick={handleUpgrade}
      disabled={loading || selected}
    >
      {loading ? "Redirecting…" : selected ? "Current plan" : "Select"}
    </Button>
  );
}

export function ManageBillingButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "Billing portal is not configured yet.");
      }
    } catch {
      toast.error("Could not connect to billing service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="secondary" className={className} onClick={handlePortal} disabled={loading}>
      {loading ? "Opening…" : "Manage billing"}
    </Button>
  );
}
