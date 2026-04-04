'use client'
import React, { createContext, useContext, useState } from 'react'

interface IProject {
  name: string
  slug: string
  created_at?: string
  is_active?: boolean
  status?: string
  total_members?:number
}
interface IWorkspaceContext {
  workspaceTab: string
    projectTab: string
  setWorkspaceTab:React.Dispatch<React.SetStateAction<string>>
  setProjectTab:React.Dispatch<React.SetStateAction<string>>
  selectedProject:IProject | null
  setSelectedProject:React.Dispatch<React.SetStateAction<IProject|null>>

  
  

}

const WorkspaceContext = createContext<IWorkspaceContext | null>(null)

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [workspaceTab, setWorkspaceTab] = useState<string>('workspace-projects')
const [projectTab, setProjectTab] = useState<string>('project-tasks')
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null)


  return (
    <WorkspaceContext.Provider value={{ workspaceTab,projectTab,setProjectTab, setWorkspaceTab,selectedProject,setSelectedProject }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('useWorkspace must be used inside provider')
  return context
}