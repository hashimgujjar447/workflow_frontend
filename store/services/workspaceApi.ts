import {api} from '../api'

export const workspaceApi=api.injectEndpoints({
    endpoints:(builder)=>({
        getWorkspaces:builder.query({
         query:()=>({
            url:'workspaces/',
            method:"GET",
         })
        }),
      getSingleWorkspace: builder.query({
    query: (workspace_slug) => ({
        url: `workspaces/${workspace_slug}/`,
        method: "GET",
    }),
    })
        ,
        getWorkspaceProjects: builder.query({
  query: (workspace_slug) => ({
    url: `workspaces/${workspace_slug}/projects/`,
    method: "GET",
  }),
}),
getProjectDetails: builder.query({
  query: ({ workspace_slug, project_slug }) => ({
    url: `workspaces/${workspace_slug}/projects/${project_slug}/`,
  }),
}),
getWorkspaceMembers: builder.query({
  query: (workspace_slug) => ({
    url: `workspaces/${workspace_slug}/members/`,
    method: "GET",
  }),
}),
updateWorkspace: builder.mutation({
  query: ({ slug, ...body }) => ({
    url: `workspaces/${slug}/`,
    method: "PATCH", // or PUT
    body,
  }),
}),

deleteWorkspace: builder.mutation({
  query: (slug) => ({
    url: `workspaces/${slug}/`,
    method: "DELETE",
  }),
}),
        getAllTasks:builder.query({
            query:()=>({
                url:'dashboard_tasks/',
                method:"GET",
            })

        })

    })
})

export const
  {useGetWorkspacesQuery,useGetAllTasksQuery,useGetSingleWorkspaceQuery
    ,useGetWorkspaceProjectsQuery,useUpdateWorkspaceMutation,useDeleteWorkspaceMutation,useGetProjectDetailsQuery,useGetWorkspaceMembersQuery
  }
  =workspaceApi
