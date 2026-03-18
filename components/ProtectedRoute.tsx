"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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

  const isInitialized = useSelector(
    (state: RootState) => state.auth.isInitialized
  );


   useEffect(() => {
    if (!isAuthenticated && isInitialized) {
      router.push("/login");
    }
  }, [isAuthenticated, router,isInitialized]);

  // 🔥 wait until auth is ready
  if (!isInitialized) {
    return <p>Checking auth...</p>;
  }

 

  if (!isAuthenticated) {
    return null; // flicker avoid
  }

  return <>{children}</>;
}