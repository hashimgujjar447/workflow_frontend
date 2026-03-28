/**
 * @param {string} workspace_slug
 * @param {string | null} [project_slug]
 */
import { can } from "./permissions";
import { useWorkspaceRole } from "./useWorkspaceRole";
import { useProjectRole } from "./useProjectRole";

export const usePermission = (workspace_slug, project_slug ) => {
  const { role: workspaceRole, isLoading: wLoading } =
    useWorkspaceRole(workspace_slug);

  const { role: projectRole, isLoading: pLoading } =
    useProjectRole(workspace_slug, project_slug);

    
  const isLoading = wLoading || pLoading;

  return {
    isLoading,

    // 🔹 Workspace permissions
    canCreateProject: can(workspaceRole, "create_project"),
    canDeleteWorkspace: can(workspaceRole, "delete_workspace"),
    canUpdateWorkspace: can(workspaceRole, "update_workspace"),
    canAddWorkspaceMembers: can(
      workspaceRole,
      "add_members_to_workspace"
    ),

    // 🔹 Project permissions
    canUpdateProject: can(projectRole, "update_project", "project"),
    canDeleteProject: can(projectRole, "delete_project", "project"),
    canAddProjectMembers: can(
      projectRole,
      "add_members_to_project",
      "project"
    ),
  };
};