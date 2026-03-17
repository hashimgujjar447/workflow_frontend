import React from 'react'
import { Button } from './Button'
import { Workflow } from 'lucide-react'
import { IWorkspace } from '@/app/page'

interface WorkspaceCardProps{
    workspace:IWorkspace
    
}

const DashboardWorkspaceCard = ({workspace}:WorkspaceCardProps) => {
  return (
     <div
            
              className="bg-cards border-custom_border border p-4 rounded"
            >
              <div className="flex items-start gap-x-3">
                <div className="bg-primary-light h-8 w-8 rounded flex items-center justify-center">
                  <Workflow size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-sm">{workspace.title}</h2>
                  <p className="text-xs text-text-secondary">
                    {workspace.created_by}
                  </p>
                </div>
              </div>

              <div className="flex mt-4">
                <p className="text-sm py-1 pr-3 border-r text-text-secondary border-custom_border">
                  2 projects
                </p>

                <p className="text-sm text-text-secondary px-3 py-1">
                  12 members
                </p>
              </div>

              <div className="border text-sm text-text-secondary border-custom_border p-2 flex items-center justify-between rounded mt-4">
                <span>2 days ago</span>

                <Button className="bg-primary_blue hover:bg-primary-hover text-white">
                  View Detail
                </Button>
              </div>
            </div>
  )
}

export default DashboardWorkspaceCard