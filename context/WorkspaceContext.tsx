'use client'
import React, { createContext, useContext, useState } from 'react'

interface IWorkspaceContext {
  selectedItem: string
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>
  selectedProject:string 
  setSelectedProject:React.Dispatch<React.SetStateAction<string>>

}

const WorkspaceContext = createContext<IWorkspaceContext | null>(null)

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState('Projects')
  const [selectedProject, setSelectedProject] = useState('')

  return (
    <WorkspaceContext.Provider value={{ selectedItem, setSelectedItem,selectedProject,setSelectedProject }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('useWorkspace must be used inside provider')
  return context
}