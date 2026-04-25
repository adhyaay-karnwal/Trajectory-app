"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WelcomeLoading } from "@/components/welcome-loading";

export function AppGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted) {
      router.replace("/welcome/01");
    }
  }, [router]);

  if (!mounted) return <WelcomeLoading />;

  const onboardingCompleted = localStorage.getItem('onboardingCompleted');
  if (!onboardingCompleted) return <WelcomeLoading />;

  return <>{children}</>;
}
