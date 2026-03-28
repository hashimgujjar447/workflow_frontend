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
  const [selectedUser, setSelectedUser] = useState<number | ''>('') // ✅ FIX
  const [role, setRole] = useState('')

  const workspaceSlug = params?.slug

  const {
    data: members,
    isLoading,
    isError,
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
  const{canAddProjectMembers,isLoading:permissionLoading}=usePermission(workspaceSlug,projectSlug);

  const handleAddMember = async () => {
    if (!selectedUser || !role) {
      alert('Please select user and role')
      return
    }

    try {
      await addMember({
        workspace_slug: workspaceSlug,
        project_slug: projectSlug,
        member: selectedUser, // ✅ already number
        role: role,
      }).unwrap()

      setIsOpen(false)
      setSelectedUser('')
      setRole('')
    } catch (err: any) {
      console.log(err?.data)
    }
  }

  if (isLoading || permissionLoading) return <div>Loading members...</div>

  if (isError) {
    return <p>Failed to load members</p>
  }

  return (
    <div className="space-y-4">
      <div className="mt-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Members</h3>
        {canAddProjectMembers && ( <Button onClick={() => setIsOpen(true)}>Add New Member</Button>)}
      </div>

      {members?.length === 0 && <p>No members found</p>}

      {members?.map((member: IProjectMember, index: number) => {
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

      {/* ✅ Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">

            <h2 className="text-lg font-semibold">Add Member</h2>

            {/* ✅ USER SELECT */}
            <select
              className="w-full border p-2 rounded"
              value={selectedUser}
              onChange={(e) => setSelectedUser(Number(e.target.value))} // ✅ FIX
            >
              <option value="">Select User</option>

              {workspaceMembers?.map((member: any) => (
                <option key={member.id} value={member.user}> {/* ✅ FIX */}
                  {member.user_detail.first_name} {member.user_detail.last_name}
                </option>
              ))}
            </select>

            {/* ✅ ROLE SELECT */}
            <select
              className="w-full border p-2 rounded"
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
              <button onClick={() => setIsOpen(false)}>Cancel</button>

              <button
                onClick={handleAddMember}
                disabled={isAdding}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                {isAdding ? 'Adding...' : 'Add'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectMembers