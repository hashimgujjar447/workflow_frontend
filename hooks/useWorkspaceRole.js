'use client'

import { useSelector } from "react-redux";
import { useGetWorkspaceMembersQuery } from "@/store/services/workspaceApi";

export const useWorkspaceRole = (workspace_slug) => {
  const {user}= useSelector((state) => state.auth)
   
  
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