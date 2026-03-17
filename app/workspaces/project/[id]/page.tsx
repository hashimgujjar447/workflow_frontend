'use client'

import WorkspaceTopbar from '@/components/features/workspace/WorkspaceTopbar'
import { useParams } from 'next/navigation'

const ProjectDetail = () => {
  const params = useParams()

  return (
   <div>
    <WorkspaceTopbar type='project' />
     <div className="p-6">
      <h1 className="text-xl font-semibold">
        Project Detail - {params.id}
      </h1>
    </div>
   </div>
  )
}

export default ProjectDetail