import { api } from '../api'

export const workspaceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaces: builder.query({
      query: () => ({
        url: 'workspaces/',
        method: 'GET',
      }),
       providesTags: ['Workspaces'],
    }),
    createWorkspace: builder.mutation({
  query: (body: { name: string }) => ({
    url: '/workspaces/',
    method: 'POST',
    body,
  }),
    invalidatesTags: ['Workspaces'],
}),

    getSingleWorkspace: builder.query({
      query: (workspace_slug) => ({
        url: `workspaces/${workspace_slug}/`,
        method: 'GET',
      }),
    }),

    getWorkspaceProjects: builder.query({
      query: (workspace_slug) => ({
        url: `workspaces/${workspace_slug}/projects/`,
        method: 'GET',
      }),
    }),

    getWorkspaceProjectDetail: builder.query({
      query: ({ workspace_slug, project_slug }) => ({
        url: `workspaces/${workspace_slug}/projects/${project_slug}/`,
        method: 'GET',
      }),
    }),

    updateProject: builder.mutation({
      query: ({ workspace_slug, project_slug, data }) => ({
        url: `workspaces/${workspace_slug}/projects/${project_slug}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteProject: builder.mutation({
      query: ({ workspace_slug, project_slug }) => ({
        url: `workspaces/${workspace_slug}/projects/${project_slug}/`,
        method: 'DELETE',
      }),
    }),

  getWorkspaceMembers: builder.query({
  query: ({ workspace_slug, exclude_project }) => ({
    url: `workspaces/${workspace_slug}/members/`,
    method: 'GET',
    params: exclude_project
      ? { exclude_project }
      : undefined,
  }),
}),

    updateWorkspace: builder.mutation({
      query: ({ slug, ...body }) => ({
        url: `workspaces/${slug}/`,
        method: 'PATCH',
        body,
      }),
    }),

    deleteWorkspace: builder.mutation({
      query: (slug) => ({
        url: `workspaces/${slug}/`,
        method: 'DELETE',
      }),
    }),

    getAllTasks: builder.query({
      query: () => ({
        url: 'dashboard_tasks/',
        method: 'GET',
      }),
    }),

    getProjectTasks: builder.query({
      query: ({ workspace_slug, project_slug }) => ({
        url: `workspaces/${workspace_slug}/projects/${project_slug}/tasks/`,
        method:"GET"
      }),
    }),

    getProjectMembers: builder.query({
      query: ({ workspace_slug, project_slug }) => ({
        url: `workspaces/${workspace_slug}/projects/${project_slug}/members/`,
        method:"GET"
      }),
        providesTags: ['ProjectMembers'],
    }),
    addProjectMember: builder.mutation({
  query: ({ workspace_slug, project_slug, member, role }) => ({
    url: `workspaces/${workspace_slug}/projects/${project_slug}/members/`,
    method: 'POST',
    body: {
      member,
      role,
    },
  }),
    invalidatesTags: ['ProjectMembers'],
}),
    inviteMember: builder.mutation<
  { message: string },
  { slug: string; email: string }
>({
  query: ({ slug, email }) => ({
    url: `workspaces/${slug}/invite/`,
    method: 'POST',
    body: { email },
  }),
}),
getInvites: builder.query<any[], void>({
  query: () => 'invites/',
}),
handleInvite: builder.mutation({
  query: ({ token, action }) => ({
    url: 'invites/action/',
    method: 'POST',
    body: { token, action },
  }),
}),
getTask: builder.query({
  query: ({ workspace_slug, project_slug, task_id }) =>
    `/workspaces/${workspace_slug}/projects/${project_slug}/tasks/${task_id}/`,
}),
getTaskComments: builder.query({
  query: ({ workspace_slug, project_slug, task_id, page = 1 }) =>
    `/workspaces/${workspace_slug}/projects/${project_slug}/tasks/${task_id}/comments/?page=${page}`,
})
  }),
  
  
})

export const {
  useGetWorkspacesQuery,
  useGetAllTasksQuery,
  useGetSingleWorkspaceQuery,
  useGetWorkspaceProjectsQuery,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useGetWorkspaceProjectDetailQuery,
  useGetWorkspaceMembersQuery,
  useGetProjectMembersQuery,
  useGetProjectTasksQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useCreateWorkspaceMutation,
  useInviteMemberMutation,
  useGetInvitesQuery,
  useHandleInviteMutation,
  useAddProjectMemberMutation,
  useGetTaskQuery,
  useGetTaskCommentsQuery
} = workspaceApi