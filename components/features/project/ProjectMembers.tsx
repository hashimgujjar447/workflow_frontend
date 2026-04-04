'use client'
import React, { useState } from 'react'
import {
  useGetProjectMembersQuery,
  useGetWorkspaceMembersQuery,
  useAddProjectMemberMutation
} from '@/store/services/workspaceApi'
import { useParams } from 'next/navigation'
import { IItem, IProjectMember } from '@/types/project'
import { Button } from '@/components/ui/Button'
import { usePermission } from '@/hooks/usePermissions'

export interface ProjectMembersProps {
  project: IItem
}

const ProjectMembers = ({ project }: ProjectMembersProps) => {
  const { slug: projectSlug } = project
  const params = useParams()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<number | ''>('')
  const [role, setRole] = useState('')

  const workspaceSlug = params?.slug

  const {
    data: members,
    isLoading,
    isError,
    refetch
  } = useGetProjectMembersQuery(
    {
      workspace_slug: workspaceSlug,
      project_slug: projectSlug,
    },
    {
      skip: !workspaceSlug || !projectSlug,
    }
  )

  const { data: workspaceMembers } = useGetWorkspaceMembersQuery(
    {
      workspace_slug: workspaceSlug,
      exclude_project: projectSlug,
    },
    {
      skip: !workspaceSlug,
    }
  )

  const [addMember, { isLoading: isAdding }] = useAddProjectMemberMutation()

  const { canAddProjectMembers, isLoading: permissionLoading } =
    usePermission(workspaceSlug, projectSlug)

  const handleAddMember = async () => {
    if (!selectedUser || !role) {
      alert('Please select user and role')
      return
    }

    try {
      await addMember({
        workspace_slug: workspaceSlug,
        project_slug: projectSlug,
        member: selectedUser,
        role,
      }).unwrap()

      setIsOpen(false)
      setSelectedUser('')
      setRole('')
    } catch (err) {
      console.log(err)
    }
  }

  /* 🔄 LOADING */
  if (isLoading || permissionLoading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  /* ❌ ERROR */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] gap-3 text-center">
        <p className="text-red-500 text-sm font-medium">
          Failed to load members
        </p>

        <button
          onClick={() => refetch()}
          className="px-3 py-1 bg-black text-white rounded text-xs"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="mt-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Members</h3>

        {canAddProjectMembers && (
          <Button onClick={() => setIsOpen(true)}>
            Add Member
          </Button>
        )}
      </div>

      {/* 📭 EMPTY STATE */}
      {members?.length === 0 ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">No members yet</p>
            <p className="text-xs text-gray-500">
              Add members to collaborate on this project
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {members?.map((member: IProjectMember, index: number) => {
            const user = member?.member_detail

            return (
              <div
                key={index}
                className="p-4 border rounded-xl flex justify-between items-center bg-white hover:shadow-sm transition"
              >
                <div className="flex items-center gap-3">

                  {/* 🔥 Avatar */}
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary_blue text-white text-xs font-semibold">
                    {user?.first_name?.charAt(0)}
                  </div>

                  <div>
                    <p className="font-medium text-sm">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>
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
      )}

      {/* 🔥 MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-xl w-[350px] shadow-lg">

            <h2 className="text-sm font-semibold mb-4">
              Add Member
            </h2>

            <select
              className="w-full border p-2 rounded mb-3"
              value={selectedUser}
              onChange={(e) => setSelectedUser(Number(e.target.value))}
            >
              <option value="">Select User</option>

              {workspaceMembers?.map((member: any) => (
                <option key={member.id} value={member.user}>
                  {member.user_detail.first_name} {member.user_detail.last_name}
                </option>
              ))}
            </select>

            <select
              className="w-full border p-2 rounded mb-4"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="leader">Leader</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="seo">SEO</option>
            </select>

            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsOpen(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleAddMember}
                disabled={isAdding}
                className="bg-primary_blue text-white"
              >
                {isAdding ? 'Adding...' : 'Add'}
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectMembers