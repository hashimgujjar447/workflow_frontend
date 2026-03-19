import {api} from '../api'

export const workspaceApi=api.injectEndpoints({
    endpoints:(builder)=>({
        getWorkspaces:builder.query({
         query:()=>({
            url:'workspaces/',
            method:"GET",
         })
        }),
        getAllTasks:builder.query({
            query:()=>({
                url:'dashboard_tasks/',
                method:"GET",
            })

        })
    })
})

export const  {useGetWorkspacesQuery,useGetAllTasksQuery}=workspaceApi
