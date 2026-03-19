"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useGetWorkspacesQuery } from "@/store/services/workspaceApi";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}