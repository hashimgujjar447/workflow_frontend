'use client'

import React from 'react'
import { useWorkspace } from '@/context/WorkspaceContext'
import WorkspaceProjects from './WorkspaceProjects'
import WorkspaceMembers from './WorkspaceMembers'
import WorkspaceSettings from './WorkspaceSettings'


const WorkspaceInfo = ({data }:any) => {
  const { workspaceTab} = useWorkspace()

  const renderView = () => {

    const current=workspaceTab || 'workspace-projects'
  
    switch (current) {
      case 'workspace-projects':
        return <WorkspaceProjects />

      case 'workspace-members':
        return <WorkspaceMembers />

      case 'workspace-settings':
        return <WorkspaceSettings />

      default:
        return <div className="mt-5 text-sm">No view found</div>
    }
  }

  return <div className="mt-3">{renderView()}</div>
}

export default WorkspaceInfo