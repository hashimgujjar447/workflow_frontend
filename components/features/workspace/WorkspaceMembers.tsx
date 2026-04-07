'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import {
  useGetWorkspaceMembersQuery,
  useInviteMemberMutation,
} from '@/store/services/workspaceApi'
import { IWorkspaceMember } from '@/types/workspace'
import { Button } from '@/components/ui/Button'
import { usePermission } from '@/hooks/usePermissions'
import toast from 'react-hot-toast'

const WorkspaceMembers = () => {
  const params = useParams()
  const slug = params?.slug as string

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetWorkspaceMembersQuery(
    { workspace_slug: slug },
    { skip: !slug }
  )

  const {
    isLoading: permissionLoading,
    canAddWorkspaceMembers,
  } = usePermission(slug)

  

  const [inviteMember, { isLoading: inviteLoading }] =
    useInviteMemberMutation()

  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleInvite = async () => {
    setErrorMsg('')

    if (!email.trim()) {
      setErrorMsg('Email is required')
      return
    }

    try {
      await inviteMember({ slug, email }).unwrap()

      setIsOpen(false)
      setEmail('')
      toast.success("Invite send successfully")
    } catch (err: any) {
      setErrorMsg(err?.data?.error || 'Failed to send invite')
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
  if (error) {
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

  console.log(canAddWorkspaceMembers)

  return (
    <div className="mt-7 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold">
          Workspace Members
        </h1>

        {canAddWorkspaceMembers && (
          <Button onClick={() => setIsOpen(true)}>
            Add Member
          </Button>
        )}
      </div>

      {/* 📭 EMPTY STATE */}
      {data?.length === 0 ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">
              No members yet
            </p>
            <p className="text-xs text-gray-500">
              Invite members to collaborate
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.map((member: IWorkspaceMember, index: number) => {
            const user = member.user_detail

            return (
              <div
                key={index}
                className="flex items-center justify-between bg-white border rounded-xl p-4 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-3">

                  {/* 👤 Avatar */}
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary_blue text-white text-xs font-semibold">
                    {user?.first_name?.charAt(0) ||
                      user?.username?.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs capitalize font-medium">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-400">
                    Joined:{' '}
                    {new Date(
                      member.joined_at
                    ).toLocaleDateString()}
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
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">

            <h2 className="text-sm font-semibold mb-4">
              Invite Member
            </h2>

            {/* ❌ ERROR */}
            {errorMsg && (
              <p className="text-xs text-red-500 mb-2">
                {errorMsg}
              </p>
            )}

            <input
              type="email"
              placeholder="Enter email"
              className="border w-full p-2 rounded mb-4 outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-primary_blue text-white"
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