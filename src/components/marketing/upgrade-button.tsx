"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";

interface UpgradeButtonProps {
  plan: "PRO" | "BUSINESS";
  className?: string;
  variant?: "primary" | "secondary";
}

export function UpgradeButton({ plan, className, variant = "secondary" }: UpgradeButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    if (!isSignedIn) {
      router.push(`/register?redirect=/pricing`);
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
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <Button variant={variant} className={className} disabled>
        Loading…
      </Button>
    );
  }

  return (
    <Button variant={variant} className={className} onClick={handleUpgrade} disabled={loading}>
      {loading ? "Redirecting…" : `Upgrade to ${plan === "PRO" ? "Pro" : "Business"}`}
    </Button>
  );
}

export function ManageBillingButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string };
      if (data.url) window.location.href = data.url;
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
