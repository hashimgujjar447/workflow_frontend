'use client'

import WorkspaceInfo from '@/components/features/workspace/WorkspaceInfo'
import WorkspaceTopbar from '@/components/features/workspace/WorkspaceTopbar'
import { useParams } from 'next/navigation'

const WorkspacePage = () => {
  const params = useParams()
  const slug = params.slug

  console.log("Workspace slug:", slug)

  return (
    <>
      <WorkspaceTopbar type="workspace" />
      <WorkspaceInfo />
    </>
  )
}

export default WorkspacePage