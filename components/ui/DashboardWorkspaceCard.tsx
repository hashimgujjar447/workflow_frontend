import React from 'react'
import { Button } from './Button'
import { Workflow } from 'lucide-react'
import { IWorkspace } from '@/lib/types'

import { useRouter } from 'next/navigation'
interface WorkspaceCardProps{
    workspace:IWorkspace
    
}

const DashboardWorkspaceCard = ({workspace}:WorkspaceCardProps) => {
  const router=useRouter()
  const created_at=workspace.created_at
  const diff=Date.now() - new Date(created_at).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return (
     <div
            
              className="bg-cards border-custom_border border p-4 rounded"
            >
              <div className="flex items-start gap-x-3">
                <div className="bg-primary-light h-8 w-8 rounded flex items-center justify-center">
                  <Workflow size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-sm">{workspace.name}</h2>
                  <p className="text-xs text-text-secondary">
                    {workspace.creator}
                  </p>
                </div>
              </div>

              <div className="flex mt-4">
                <p className="text-sm py-1 pr-3 border-r text-text-secondary border-custom_border">
                  {workspace.total_projects} projects
                </p>

                <p className="text-sm text-text-secondary px-3 py-1">
                  {workspace.total_members} members
                </p>
              </div>

              <div className="border text-sm text-text-secondary border-custom_border p-2 flex items-center justify-between rounded mt-4">
                <span>{days} days ago</span>

                <Button onClick={()=>{
                  router.push(`/workspaces/${workspace.slug}`)

                }} className="bg-primary_blue hover:bg-primary-hover text-white">
                  View Detail
                </Button>
              </div>
            </div>
  )
}

export default DashboardWorkspaceCard