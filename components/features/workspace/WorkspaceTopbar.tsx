'use client'

import { Button } from '@/components/ui/Button'
import { Clipboard, Ellipsis, Settings, UserRound } from 'lucide-react'
import React, { useEffect } from 'react'
import { useWorkspace } from '@/context/WorkspaceContext'

interface IWorkspaceTopBar {
  type?: 'workspace' | 'project'
}

const WorkspaceTopbar = ({ type = 'workspace' }: IWorkspaceTopBar) => {
  const {
    projectTab,
    setProjectTab,
    workspaceTab,
    setWorkspaceTab,
  } = useWorkspace()

  // ✅ decide active state based on type
  const selectedItem = type === 'workspace' ? workspaceTab : projectTab
  const setSelectedItem =
    type === 'workspace' ? setWorkspaceTab : setProjectTab

  // ✅ menu lists
  const workspaceList = [
    { id: 'workspace-projects', title: 'Projects', icon: <Clipboard className="w-4 h-4" /> },
    { id: 'workspace-members', title: 'Members', icon: <UserRound className="w-4 h-4" /> },
    { id: 'workspace-settings', title: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ]

  const projectList = [
    { id: 'project-tasks', title: 'Tasks', icon: <Clipboard className="w-4 h-4" /> },
    { id: 'project-members', title: 'Members', icon: <UserRound className="w-4 h-4" /> },
    { id: 'project-settings', title: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ]

  const itemsList = type === 'workspace' ? workspaceList : projectList

  // ✅ default tab set (IMPORTANT FIX)
  useEffect(() => {
    if (type === 'workspace' && !workspaceTab) {
      setWorkspaceTab('workspace-projects')
    }

    if (type === 'project' && !projectTab) {
      setProjectTab('project-tasks')
    }
  }, [type, workspaceTab, projectTab])

  return (
    <div className="bg-cards border py-1 px-3 border-custom_border w-full h-10 flex justify-between items-center">
      
      {/* LEFT MENU */}
      <div className="flex items-center gap-x-5">
        {itemsList.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item.id)}
            className={`flex items-center gap-x-1 text-sm relative cursor-pointer ${
              selectedItem === item.id ? 'selected_item_after' : ''
            }`}
          >
            {item.icon}
            <h2>{item.title}</h2>
          </div>
        ))}
      </div>

      {/* RIGHT BUTTON */}
      <Button className="bg-transparent hover:bg-transparent">
        <Ellipsis className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default WorkspaceTopbar