'use client'

import TopBar from '@/components/layouts/TopBar'
import { WorkspaceProvider, useWorkspace } from '@/context/WorkspaceContext'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import {toast} from 'react-hot-toast'

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

      toast.success("Workspace created successfully")
      setIsOpen(false)
      setName('')

      router.push('/workspaces')
    } catch (error: any) {
       toast.error(  error?.data?.name || "Failed to create task ❌");
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
    <div className="flex items-center justify-between flex-wrap gap-3 border-b pb-3">

  {/* LEFT SIDE */}
  <div className="flex items-center  gap-3 flex-wrap">

    {/* Back Button */}
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border bg-white hover:bg-gray-100 transition"
    >
      <ArrowLeft size={14} />
      Back
    </button>

    {/* Divider */}
    <div className="h-4 w-px bg-gray-300 hidden sm:block" />

    {/* Breadcrumb */}
    <div className="flex items-center gap-1 text-sm sm:text-base font-medium flex-wrap">

      <span
        onClick={() => router.push('/workspaces')}
        className="text-gray-500 hover:text-black cursor-pointer"
      >
        Workspaces
      </span>

      {slug && (
        <>
          <span className="text-gray-400">/</span>

          <span
            onClick={() => router.push(`/workspaces/${slug}`)}
            className="capitalize text-gray-700 hover:text-black cursor-pointer"
          >
            {slug}
          </span>
        </>
      )}

      {selectedProject?.name && (
        <>
          <span className="text-gray-400">/</span>

          <span className="text-primary_blue font-semibold">
            {selectedProject.name}
          </span>
        </>
      )}

    </div>

  </div>

  {/* RIGHT SIDE */}
  {!slug && (
    <button
      onClick={() => setIsOpen(true)}
      className="flex items-center gap-1 bg-primary_blue text-white px-3 py-2 text-xs sm:text-sm rounded-md hover:opacity-90 transition"
    >
      <Plus size={16} />
      New Workspace
    </button>
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