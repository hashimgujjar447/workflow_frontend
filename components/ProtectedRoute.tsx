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
  const pathname = usePathname(); 

  const isInitialized = useSelector(
    (state: RootState) => state.auth.isInitialized
  );

  useEffect(() => {
    if (!isAuthenticated && isInitialized) {

      router.push(`/login?redirect=${pathname}`);
    }
  }, [isAuthenticated, isInitialized, router, pathname]);

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
  <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
  <p className="text-sm text-gray-500">Loading .... </p>
</div>
    )
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}