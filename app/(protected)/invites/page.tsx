'use client'

import { useGetInvitesQuery } from '@/store/services/workspaceApi'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Mail, Users } from 'lucide-react'

const InvitesPage = () => {
  const { data, isLoading, error, refetch } = useGetInvitesQuery()
  const router = useRouter()

  /* 🔄 LOADING */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  /* ❌ ERROR */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <p className="text-red-500 text-sm">Failed to load invites</p>
        <button
          onClick={() => refetch()}
          className="px-3 py-2 bg-black text-white rounded text-xs"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* 🔝 HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Invitations</h1>
        <p className="text-sm text-gray-500">
          Join workspaces you’ve been invited to
        </p>
      </div>

      {/* 📊 STATS */}
      <div className="bg-white p-4 rounded-xl border flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Total Invites</p>
          <p className="text-lg font-semibold">{data?.length || 0}</p>
        </div>

        <div className="p-2 bg-gray-100 rounded-lg">
          <Mail size={18} />
        </div>
      </div>

      {/* 📬 INVITES LIST */}
      <div className="space-y-4">

        {data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[30vh] text-gray-400 text-sm">
            <p>No invites found 📭</p>
            <p className="text-xs">You’re all caught up</p>
          </div>
        ) : (
         data &&  data?.map((invite: any, index: number) => (
            <div
              key={index}
              className="bg-white border rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition"
            >
              {/* LEFT */}
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {invite.workspace?.name}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users size={12} />
                  <span className="capitalize">
                    {invite.role}
                  </span>
                </div>
              </div>

              {/* RIGHT */}
              <Button
                className="text-xs px-4 py-2"
                onClick={() => router.push(`/invites/${invite.token}`)}
              >
                View
              </Button>
            </div>
          ))
        )}

      </div>
    </div>
  )
}

export default InvitesPage