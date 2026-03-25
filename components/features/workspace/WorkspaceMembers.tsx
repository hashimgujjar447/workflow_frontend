'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useGetWorkspaceMembersQuery, useInviteMemberMutation } from '@/store/services/workspaceApi'
import { IWorkspaceMember } from '@/types/workspace'
import { Button } from '@/components/ui/Button'

const WorkspaceMembers = () => {
  const params = useParams()
  const slug = params.slug as string

  const { data, isLoading, error } = useGetWorkspaceMembersQuery(slug, {
    skip: !slug,
  })

  const [inviteMember, { isLoading: inviteLoading }] = useInviteMemberMutation()

  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')

  const handleInvite = async () => {
    try {
      if (!email.trim()) {
        return alert('Please enter email')
      }

      await inviteMember({ slug, email }).unwrap()

      setIsOpen(false)
      setEmail('')

      alert('Invite sent successfully')

    } catch (err: any) {
      alert(err?.data?.error || 'Failed to send invite')
    }
  }

  if (isLoading) return <p>Loading members...</p>
  if (error) return <p>Error loading members</p>

  return (
    <div className="mt-7">
      <div className='flex items-center justify-between'>
        <h1 className="text-sm font-semibold">Workspace Members</h1>
        <Button onClick={() => setIsOpen(true)}>Add New Member</Button>
      </div>

      <div className="mt-4 space-y-3">
        {data?.map((member: IWorkspaceMember, index: number) => (
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

      {/* 🔥 Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-lg font-semibold mb-4">
              Invite Member
            </h2>

            <input
              type="email"
              placeholder="Enter email"
              className="border w-full p-2 rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsOpen(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleInvite}
                disabled={inviteLoading}
                className="bg-blue-600 text-white"
              >
                {inviteLoading ? 'Sending...' : 'Invite'}
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default WorkspaceMembers