"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // ✅ current path

  const isInitialized = useSelector(
    (state: RootState) => state.auth.isInitialized
  );

  useEffect(() => {
    if (!isAuthenticated && isInitialized) {
      // 🔥 redirect with return path
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isAuthenticated, isInitialized, router, pathname]);

  if (!isInitialized) {
    return <p>Checking auth...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}