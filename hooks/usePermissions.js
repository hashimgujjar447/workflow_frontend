import { can } from "./permissions";
import { useWorkspaceRole } from "./useWorkspaceRole";
import { useProjectRole } from "./useProjectRole";

export const usePermission = (workspace_slug, project_slug) => {
  const { role: workspaceRole, isLoading: wLoading } =
    useWorkspaceRole(workspace_slug);

  const { role: projectRole, isLoading: pLoading } =
    useProjectRole(workspace_slug, project_slug);

  const isLoading = wLoading || pLoading;

  return {
    isLoading,

    // ✅ Workspace permissions
    canCreateProject: workspaceRole
      ? can(workspaceRole, "create_project")
      : false,

    canDeleteWorkspace: workspaceRole
      ? can(workspaceRole, "delete_workspace")
      : false,

    canUpdateWorkspace: workspaceRole
      ? can(workspaceRole, "update_workspace")
      : false,

    canAddWorkspaceMembers: workspaceRole
      ? can(workspaceRole, "add_members_to_workspace")
      : false,

    // ✅ Project permissions
    canUpdateProject: projectRole
      ? can(projectRole, "update_project", "project")
      : false,

    canDeleteProject: projectRole
      ? can(projectRole, "delete_project", "project")
      : false,

    canAddProjectMembers: projectRole
      ? can(projectRole, "add_members_to_project", "project")
      : false,
  };
};