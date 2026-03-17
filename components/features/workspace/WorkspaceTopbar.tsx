'use client'

import { Button } from '@/components/ui/Button'
import { Clipboard, Ellipsis, Settings, UserRound } from 'lucide-react'
import React, { useEffect } from 'react'
import { useWorkspace } from '@/context/WorkspaceContext'

interface IWorkspaceTopBar {
  type?: 'workspace' | 'project'
}

const WorkspaceTopbar = ({ type = 'workspace' }: IWorkspaceTopBar) => {
  const { selectedItem, setSelectedItem } = useWorkspace()

  // ✅ UNIQUE + STABLE IDS
  const workspaceList = [
    {
      id: 'workspace-projects',
      title: 'Projects',
      icon: <Clipboard className="w-4 h-4 text-text-secondary" />,
    },
    {
      id: 'workspace-members',
      title: 'Members',
      icon: <UserRound className="w-4 h-4 text-text-secondary" />,
    },
    {
      id: 'workspace-settings',
      title: 'Settings',
      icon: <Settings className="w-4 h-4 text-text-secondary" />,
    },
  ]

  const projectList = [
    {
      id: 'project-tasks',
      title: 'Tasks',
      icon: <Clipboard className="w-4 h-4 text-text-secondary" />,
    },
    {
      id: 'project-members',
      title: 'Members',
      icon: <UserRound className="w-4 h-4 text-text-secondary" />,
    },
    {
      id: 'project-settings',
      title: 'Settings',
      icon: <Settings className="w-4 h-4 text-text-secondary" />,
    },
  ]

  const itemsList = type === 'workspace' ? workspaceList : projectList

  // ✅ DEFAULT SELECTED (BASED ON TYPE)
  useEffect(() => {
    if (type === 'project') {
      setSelectedItem?.('project-tasks')
    } else {
      setSelectedItem?.('workspace-projects')
    }
  }, [type, setSelectedItem])

  return (
    <div className="bg-cards border py-1 px-3 border-custom_border w-full h-10 justify-between flex items-center">
      
      {/* LEFT MENU */}
      <div className="flex items-center gap-x-5">
        {itemsList.map((item) => (
          <div
            key={item.id} // ✅ IMPORTANT (React optimization)
            onClick={() => setSelectedItem?.(item.id)}
            className={`flex relative items-center gap-x-1 ${
              selectedItem === item.id ? 'selected_item_after' : ''
            } text-sm hover:cursor-pointer text-text-secondary`}
          >
            {item.icon}
            <h2>{item.title}</h2>
          </div>
        ))}
      </div>

      {/* RIGHT BUTTON */}
      <Button className="bg-transparent text-text-secondary hover:bg-transparent cursor-pointer">
        <Ellipsis className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default WorkspaceTopbar