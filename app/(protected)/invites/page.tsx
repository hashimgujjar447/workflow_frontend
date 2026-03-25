'use client'

import { useGetInvitesQuery } from '@/store/services/workspaceApi'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

const InvitesPage = () => {
  const { data, isLoading, error } = useGetInvitesQuery()
  const router = useRouter()

  console.log(data)

  if (isLoading) return <p>Loading invites...</p>
  if (error) return <p>Error loading invites</p>

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">Your Invites</h1>

      <div className="space-y-3">
        {data?.length === 0 && <p>No invites found</p>}

        {data?.map((invite, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{invite.workspace.name}</p>
              <p className="text-xs text-gray-500">{invite.role}</p>
            </div>

            <Button
              onClick={() => router.push(`/invites/${invite.token}`)}
            >
              View
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InvitesPage