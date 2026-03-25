'use client'

import { useParams, useRouter } from 'next/navigation'
import { useHandleInviteMutation } from '@/store/services/workspaceApi'
import { Button } from '@/components/ui/Button'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { RootState } from '@/store/store'

const InviteDetailPage = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const params = useParams()
  const token = params.token as string
  const router = useRouter()

  const [handleInvite, { isLoading }] = useHandleInviteMutation()

 

  const handleAction = async (action: 'accept' | 'reject') => {
    try {
      await handleInvite({ token, action }).unwrap()

      alert(`Invite ${action}ed successfully`)

      router.push('/workspaces')

    } catch (err: any) {
      alert(err?.data?.error || 'Something went wrong')
    }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
    <div className="p-6 max-w-md mx-auto">
      <div className="border rounded-xl p-6 bg-white">

        <h1 className="text-lg font-semibold mb-4">
          Workspace Invitation
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          You have been invited to join a workspace.
        </p>

        <div className="flex gap-3">
          <Button
            onClick={() => handleAction('accept')}
            disabled={isLoading}
            className="bg-green-600 text-white"
          >
            Accept
          </Button>

          <Button
            onClick={() => handleAction('reject')}
            disabled={isLoading}
            className="bg-red-600 text-white"
          >
            Reject
          </Button>
        </div>

      </div>
    </div>
    </div>
  )
}

export default InviteDetailPage