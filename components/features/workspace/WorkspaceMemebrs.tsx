'use client'

import { useParams } from 'next/navigation'
import { useGetWorkspaceMembersQuery } from '@/store/services/workspaceApi'

const WorkspaceMembers = () => {
  const params = useParams()
  const slug = params.slug

  const { data, isLoading, error } = useGetWorkspaceMembersQuery(slug, {
    skip: !slug,
  })

  if (isLoading) return <p>Loading members...</p>
  if (error) return <p>Error loading members</p>

  return (
    <div className="mt-7">
      <h1 className="text-sm font-semibold">Workspace Members</h1>

      <div className="mt-4 space-y-3">
        {data?.map((member:any, index:any) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white border rounded-lg p-3"
          >
            <div>
              <p className="text-sm font-medium">
                {member.user_detail?.username}
              </p>
              <p className="text-xs text-gray-500">
                {member.role}
              </p>
            </div>

            <span className="text-xs text-gray-400">
              Joined: {new Date(member.joined_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkspaceMembers