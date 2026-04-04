'use client'

import { ClipboardList } from 'lucide-react'

const WorkspaceHome = () => {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="flex flex-col items-center gap-4 bg-cards border border-custom_border rounded-xl p-8 shadow-sm">
        
        <div className="p-3 rounded-full bg-gray-100">
          <ClipboardList className="w-6 h-6 text-gray-500" />
        </div>

        <h2 className="text-lg font-semibold">No workspace selected</h2>

        <p className="text-sm text-gray-500 text-center max-w-xs">
          Select a workspace from the topbar to view projects, members, and settings.
        </p>

      </div>
    </div>
  )
}

export default WorkspaceHome