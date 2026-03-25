export interface IWorkspaceMember{
    is_active:boolean
    role:string    
    joined_at:string
    user_detail:{
        date_joined:string
        email:string
        first_name:string
        last_name:string
        username:string
    }

}

// types/workspace.ts
export interface CreateWorkspacePayload {
  name: string
}