'use client'

import TopBar from '@/components/layouts/TopBar'
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IWorkspace } from '@/lib/types'
import { useGetWorkspacesQuery } from '@/store/services/workspaceApi'

const WorkspaceLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { selectedProject,isProjectLoaded } = useWorkspace()

  const params = useParams()
  const slug = params?.slug as string | undefined

  useEffect(()=>{
console.log("selectedProject:", selectedProject)
console.log("isProjectLoaded:", isProjectLoaded)
  },[selectedProject,isProjectLoaded])


  const {data,isLoading}=useGetWorkspacesQuery(undefined)

  if(isLoading){
    return <h1>Loading</h1>
  }

  return (
    <div className="p-4">
      <TopBar workspaces={data} />

      <div className="mt-6">
        <div className='flex items-center justify-between'>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            {slug ? (
              <>
                <span>{slug}</span>

                {selectedProject?.name && (
                  <>
                    <span className="text-gray-400">{'>'}</span>
                    <span className="text-primary_blue">
                      {selectedProject?.name}
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