'use client'

import TopBar from '@/components/layouts/TopBar'
import { useState } from 'react'
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'

import { IWorkspace } from '@/lib/types';

const WorkspaceLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([
    { id: 1, title: "First Workspace", description: "...", created_by: "user", life: 1 },
    { id: 2, title: "second workspace", description: "...", created_by: "user", life: 1 },
  ])

  const [selectedWorkspace, setSelectedWorkspace] =
    useState<IWorkspace | null>(null)

  const { selectedProject } = useWorkspace() // ✅ from context

  return (
    <div className="p-4">
      <TopBar
        workspaces={workspaces}
        setSelectedWorkspace={setSelectedWorkspace}
      />

      <div className="mt-6">
        <div className='flex items-center justify-between'>

          {/* 🔥 Breadcrumb */}
          <h1 className="text-lg font-semibold flex items-center gap-2">
            {selectedWorkspace ? (
              <>
                <span>{selectedWorkspace.title}</span>

                {selectedProject && (
                  <>
                    <span className="text-gray-400">{'>'}</span>
                    <span className="text-primary_blue">{selectedProject}</span>
                  </>
                )}
              </>
            ) : (
              "Select Workspace"
            )}
          </h1>

          {selectedWorkspace === null && (
            <Button className="bg-cards text-black rounded border-custom_border border hover:text-white">
              <Plus size={16} /> Create Workspace
            </Button>
          )}
        </div>

        <div className="mt-3">
          {selectedWorkspace ? children : <p>Select workspace</p>}
        </div>
      </div>
    </div>
  )
}

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <WorkspaceProvider>
      <WorkspaceLayoutContent>{children}</WorkspaceLayoutContent>
    </WorkspaceProvider>
  )
}

export default WorkspaceLayout