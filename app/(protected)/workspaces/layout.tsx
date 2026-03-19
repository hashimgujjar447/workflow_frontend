'use client'

import TopBar from '@/components/layouts/TopBar'
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { IWorkspace } from '@/lib/types'

const WorkspaceLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { selectedProject } = useWorkspace()

  const params = useParams()
  const slug = params?.slug as string | undefined

  const [workspaces] = useState<IWorkspace[]>([
    { name: 'First Workspace', slug: 'first-workspace' },
    { name: 'Second Workspace', slug: 'second-workspace' },
  ])

  return (
    <div className="p-4">
      <TopBar workspaces={workspaces} />

      <div className="mt-6">
        <div className='flex items-center justify-between'>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            {slug ? (
              <>
                <span>{slug}</span>

                {selectedProject && (
                  <>
                    <span className="text-gray-400">{'>'}</span>
                    <span className="text-primary_blue">
                      {selectedProject}
                    </span>
                  </>
                )}
              </>
            ) : (
              "Dashboard"
            )}
          </h1>

          {!slug && (
            <Button className="bg-cards text-black rounded border-custom_border border hover:text-white">
              <Plus size={16} /> Create Workspace
            </Button>
          )}
        </div>

        <div className="mt-3">
          {children}
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