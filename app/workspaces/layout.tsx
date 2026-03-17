'use client'

import TopBar from '@/components/layouts/TopBar'
import WorkspaceTopbar from '@/components/features/workspace/WorkspaceTopbar'
import { useState } from 'react'
import { WorkspaceProvider } from '@/context/WorkspaceContext' // ✅ add this
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'

export interface IWorkspace {
  title: string
  description: string
}

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([
    { title: "First Workspace", description: "..." },
    { title: "second workspace", description: "..." },
  ])

  const [selectedWorkspace, setSelectedWorkspace] =
    useState<IWorkspace | null>(null)

  return (
    <WorkspaceProvider> {/* ✅ wrap everything */}
      <div className="p-4">
        <TopBar
          workspaces={workspaces}
          setSelectedWorkspace={setSelectedWorkspace}
        />

        <div className="mt-6">
          <div className='flex items-center justify-between'>
            <h1 className="text-lg font-semibold">
            {selectedWorkspace
              ? selectedWorkspace.title
              : "Select Workspace"}
          </h1>
          {selectedWorkspace===null&&  <Button className="bg-cards text-black rounded border-custom_border border hover:text-white">
            <Plus size={16} /> Create Workspace
          </Button>}
          </div>
            
          <div className="mt-3">
    
            {selectedWorkspace ? children : <p>Select workspace</p>}
          </div>
        </div>
      </div>
    </WorkspaceProvider>
  )
}

export default WorkspaceLayout