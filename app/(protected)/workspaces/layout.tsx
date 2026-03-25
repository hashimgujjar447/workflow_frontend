'use client'

import TopBar from '@/components/layouts/TopBar'
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useGetWorkspacesQuery, useCreateWorkspaceMutation } from '@/store/services/workspaceApi'

const WorkspaceLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { selectedProject } = useWorkspace()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  const params = useParams()
  const slug = params?.slug as string | undefined
  const router = useRouter()

  const { data, isLoading } = useGetWorkspacesQuery(undefined)
  const [createWorkspace, { isLoading: createWorkspaceLoading }] = useCreateWorkspaceMutation()

  const handleSubmit = async () => {
    try {
      if (name.trim() === '') {
        return alert('Please enter a name for workspace')
      }

      await createWorkspace({ name }).unwrap() // ✅ FIXED

      setIsOpen(false)
      setName('')

      router.push('/workspaces') // ✅ redirect after success

    } catch (error: any) {
      console.error(error)

      alert(error?.data?.name || 'Failed to create workspace please ensure unique workspace name') // ✅ show error
    }
  }


  if (isLoading) {
    return <h1>Loading</h1>
  }

  return (
    <div className="p-4">
      <TopBar workspaces={data} />

      <div className="mt-6">
        <div className='flex items-center justify-between'>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            {slug ? (
              <>
                <span>{slug}</span>

                {selectedProject?.name && (
                  <>
                    <span className="text-gray-400">{'>'}</span>
                    <span className="text-primary_blue">
                      {selectedProject?.name}
                    </span>
                  </>
                )}
              </>
            ) : (
              "Dashboard"
            )}
          </h1>

          {!slug && (
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-cards text-black rounded border-custom_border border hover:text-white"
            >
              <Plus size={16} /> Create Workspace
            </Button>
          )}
        </div>

        <div className="mt-3">
          {children}
        </div>
      </div>

      {/* ✅ Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-lg font-semibold mb-4">
              Create Workspace
            </h2>

            <input
              type="text"
              placeholder="Workspace Name"
              className="border w-full p-2 rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsOpen(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={createWorkspaceLoading}
                className="bg-blue-600 text-white"
              >
                {createWorkspaceLoading ? 'Creating...' : 'Create'}
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <WorkspaceProvider>
      <WorkspaceLayoutContent>{children}</WorkspaceLayoutContent>
    </WorkspaceProvider>
  )
}

export default WorkspaceLayout