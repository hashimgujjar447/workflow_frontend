'use client'

import WorkspaceInfo from '@/components/features/workspace/WorkspaceInfo'
import WorkspaceTopbar from '@/components/features/workspace/WorkspaceTopbar'
import { useGetSingleWorkspaceQuery } from '@/store/services/workspaceApi'
import { useParams } from 'next/navigation'

const WorkspacePage = () => {
  const params = useParams()
  const slug = params.slug

  const { data, isLoading, isFetching, error, refetch } =
    useGetSingleWorkspaceQuery(slug, {
      skip: !slug,
    })

  // 🔄 First load (full page loader)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">Loading workspace...</p>
      </div>
    )
  }

  // ❌ Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <p className="text-lg font-medium text-red-500">
          Failed to load workspace
        </p>
        <p className="text-sm text-gray-500">
          Something went wrong. Please try again.
        </p>

        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-80 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div >
      <WorkspaceTopbar type="workspace" />
      <WorkspaceInfo data={data} />
    </div>
  )
}

export default WorkspacePage