'use client'

import TopBar from '@/components/layouts/TopBar'
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { useState,useEffect } from 'react'
import {
  useGetWorkspacesQuery,
  useCreateWorkspaceMutation,
} from '@/store/services/workspaceApi'

const WorkspaceLayoutContent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { selectedProject,setSelectedProject } = useWorkspace()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  const params = useParams()
  const slug = params?.slug as string | undefined
  const router = useRouter()

  const { data, isLoading } = useGetWorkspacesQuery(undefined)

  const [createWorkspace, { isLoading: createWorkspaceLoading }] =
    useCreateWorkspaceMutation()

    useEffect(() => {
  if (!params?.project_slug) {
    setSelectedProject(null)
  }
}, [params?.project_slug])
  const handleSubmit = async () => {
    try {
      if (name.trim() === '') {
        return alert('Please enter a workspace name')
      }

      await createWorkspace({ name }).unwrap()

      setIsOpen(false)
      setName('')
      router.push('/workspaces')
    } catch (error: any) {
      alert(
        error?.data?.name ||
          'Workspace name must be unique'
      )
    }
  }

  // 🔄 LOADER
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* 🔝 GLOBAL TOPBAR */}
      <TopBar workspaces={data} />

      <div className="mt-6">
        {/* 🔥 HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          
          {/* ✅ BREADCRUMB */}
          <h1 className="text-lg font-semibold flex items-center gap-2 flex-wrap">
            {slug ? (
              <>
                <span className="capitalize">{slug}</span>

                {selectedProject?.name && (
                  <>
                    <span className="text-gray-400">/</span>
                    <span className="text-primary_blue font-medium">
                      {selectedProject.name}
                    </span>
                  </>
                )}
              </>
            ) : (
              <span>Workspace Page</span>
            )}
          </h1>

          {/* ✅ ACTION BUTTON */}
          {!slug && (
            <Button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1 bg-primary_blue text-white px-3 py-2 text-sm hover:opacity-90"
            >
              <Plus size={16} /> New Workspace
            </Button>
          )}
        </div>

        {/* 🔻 CONTENT */}
        <div className="mt-4">{children}</div>
      </div>

      {/* 🔥 MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-lg">
            
            <h2 className="text-base font-semibold mb-4">
              Create Workspace
            </h2>

            <input
              type="text"
              placeholder="Enter workspace name"
              className="border w-full p-2 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-gray-100 text-black hover:bg-gray-200"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={createWorkspaceLoading}
                className="bg-primary_blue text-white"
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

const WorkspaceLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <WorkspaceProvider>
      <WorkspaceLayoutContent>
        {children}
      </WorkspaceLayoutContent>
    </WorkspaceProvider>
  )
}

export default WorkspaceLayout