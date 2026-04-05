import { useGetProjectMembersQuery } from "@/store/services/workspaceApi";
import { useSelector } from "react-redux";

export const useProjectRole = (workspace_slug, project_slug) => {
  const user = useSelector((state) => state.auth.user);

  const { data, isLoading } = useGetProjectMembersQuery(
    { workspace_slug, project_slug },
    {
      skip: !project_slug || !user?.id, // ✅ important fix
    }
  );

  const currentUser = data?.find(
    (member) => member?.member_detail?.id === user?.id // ✅ safe access
  );

  return {
    role: currentUser?.role || null,
    isLoading,
  };
};