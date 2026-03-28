// permissions.js

export const WORKSPACE_PERMISSIONS = {
  manager: [
    "create_project",
    "delete_workspace",
    "update_workspace",
    "add_members_to_workspace",
  ],
  leader: ["create_project"],
  member: [],
};

export const PROJECT_PERMISSIONS = {
  manager: [
    "update_project",
    "delete_project",
    "add_members_to_project",
  ],
  leader: [
    "update_project",
    "add_members_to_project",
  ],
  frontend: [],
  backend: [],
  seo: [],
};

export const can = (role, action, scope = "workspace") => {
  const permissionsMap =
    scope === "project"
      ? PROJECT_PERMISSIONS
      : WORKSPACE_PERMISSIONS;

  return permissionsMap[role]?.includes(action);
};