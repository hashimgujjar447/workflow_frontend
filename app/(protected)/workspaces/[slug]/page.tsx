'use client'

import WorkspaceInfo from '@/components/features/workspace/WorkspaceInfo'
import WorkspaceTopbar from '@/components/features/workspace/WorkspaceTopbar'
import { useGetSingleWorkspaceQuery } from '@/store/services/workspaceApi'
import { useParams } from 'next/navigation'

const WorkspacePage = () => {
  const params = useParams()
  const slug = params.slug

  const { data, isLoading, error } = useGetSingleWorkspaceQuery(slug, {
    skip: !slug,
  })


  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error...</p>

  return (
    <>
      <WorkspaceTopbar type="workspace" />
      <WorkspaceInfo data={data} />
    </>
  )
}

export default WorkspacePage