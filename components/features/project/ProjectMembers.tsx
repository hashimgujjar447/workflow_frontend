'use client'
import React, { useState } from 'react'
import { useGetProjectMembersQuery,useGetWorkspaceMembersQuery } from '@/store/services/workspaceApi'
import { useParams } from 'next/navigation'
import { IItem } from '@/types/project'
import { IProjectMember } from '@/types/project'
import { Button } from '@/components/ui/Button'

interface ProjectMembersProps {
  project: IItem
}

const ProjectMembers = ({ project }:ProjectMembersProps) => {
  const { slug: projectSlug } = project
  const params = useParams()
  const[isOpen,setIsOpen]=useState(false)
  const[selectedUser,setSelectedUser]=useState('')
  const[role,setRole]=useState('')

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

  const {data:workspaceMembers}=useGetWorkspaceMembersQuery({
  workspace_slug: workspaceSlug,
  exclude_project: projectSlug,
})

  console.log(workspaceMembers)

  const handleAddMember=async()=>{

  }

  if (isLoading) return <div>Loading members...</div>

  if (isError ) {
    return <p>Sorry, you don't have access</p>
  }

  if (isError) {
    return <p>Failed to load members</p>
  }

  return (
    <div className="space-y-4">
      <div className='mt-3 flex items-center justify-between'>
        <h3 className="text-lg font-semibold">Project Members</h3>
        <Button onClick={() => setIsOpen(true)}>Add New Member</Button>
  
      </div>

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
      {isOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-96 space-y-4">

      <h2 className="text-lg font-semibold">Add Member</h2>

      {/* Select User */}
      <select
        className="w-full border p-2 rounded"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select User</option>
        {workspaceMembers && workspaceMembers?.map((member)=>(
           <option value={member.id}>{member.user_detail.first_name}</option>

        ))}
      </select>

      {/* Select Role */}
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
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  )
}

export default ProjectMembers