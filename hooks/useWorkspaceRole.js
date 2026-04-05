'use client'

import { useGetWorkspaceMembersQuery } from "@/store/services/workspaceApi";
import { useSelector } from "react-redux";

export const useWorkspaceRole = (workspace_slug) => {
  const user = useSelector((state) => state.auth.user)

  const { isLoading, data } = useGetWorkspaceMembersQuery(
    { workspace_slug },
    {
      skip: !workspace_slug || !user?.id, // ✅ important fix
    }
  )

  const currentUser = data?.find(
    (member) => member?.user_detail?.id === user?.id // ✅ safe access
  )

  return {
    isLoading,
    role: currentUser?.role || null,
  }
}