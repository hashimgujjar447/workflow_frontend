'use client'
import React from 'react'
import { useGetProjectMembersQuery } from '@/store/services/workspaceApi'
import { useParams } from 'next/navigation'
import { IItem } from '@/types/project'
import { IProjectMember } from '@/types/project'

interface ProjectMembersProps {
  project: IItem
}

const ProjectMembers = ({ project }:ProjectMembersProps) => {
  const { slug: projectSlug } = project
  const params = useParams()

  const workspaceSlug = params?.slug

  const {
    data: members,
    isLoading,
    isError,
    error,
  } = useGetProjectMembersQuery(
    {
      workspace_slug: workspaceSlug,
      project_slug: projectSlug,
    },
    {
      skip: !workspaceSlug || !projectSlug,
    }
  )

  console.log(members)

  if (isLoading) return <div>Loading members...</div>

  if (isError ) {
    return <p>Sorry, you don't have access</p>
  }

  if (isError) {
    return <p>Failed to load members</p>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Project Members</h3>

      {members?.length === 0 && <p>No members found</p>}

      {members?.map((member:IProjectMember, index:number) => {
        const user = member?.member_detail

        return (
          <div
            key={index}
            className="p-3 border rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-sm text-gray-500">
                {user?.email}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium capitalize">
                {member?.role}
              </p>
              <p className="text-xs text-gray-400">
                Joined: {new Date(member?.joined_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProjectMembers