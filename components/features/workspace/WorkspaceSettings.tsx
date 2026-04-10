'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  useGetSingleWorkspaceQuery,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from '@/store/services/workspaceApi'
import { usePermission } from '@/hooks/usePermissions'
import toast from 'react-hot-toast'

const WorkspaceSettings = () => {
  const params = useParams()
  const router = useRouter()

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug

  const {
    data,
    isLoading: workspaceLoading,
    error,
    refetch,
  } = useGetSingleWorkspaceQuery(slug, {
    skip: !slug,
  })

  const [updateWorkspace, { isLoading: isUpdating }] =
    useUpdateWorkspaceMutation()

  const [deleteWorkspace, { isLoading: isDeleting }] =
    useDeleteWorkspaceMutation()

  const [name, setName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    isLoading: permissionLoading,
    canDeleteWorkspace,
    canUpdateWorkspace,
  } = usePermission(slug)

 
  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data?.name) {
      setName(data.name)
    }
  }, [data])

  /* 🔄 LOADING */
  if (workspaceLoading || permissionLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  /* ❌ ERROR */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-center">
        <p className="text-red-500 text-sm font-medium">
          Failed to load workspace
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

  /* ✏️ UPDATE */
  const handleUpdate = async () => {
    setErrorMsg('')

    try {
      const res = await updateWorkspace({ slug, name }).unwrap()

      toast.success('Workspace updated successfully')

      // redirect to updated workspace
      router.push(`/workspaces/${res?.slug || slug}`)
    } catch (err) {
      toast.error('Failed to update workspace')
      setErrorMsg('Failed to update workspace')
    }
  }

  /* 🗑 DELETE */
  const handleDelete = async () => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this workspace?'
    )
    if (!confirmDelete) return

    try {
      await deleteWorkspace(slug).unwrap()

      toast.success('Workspace deleted successfully')

      router.push('/workspaces')
    } catch (err) {
      toast.error('Failed to delete workspace')
      setErrorMsg('Failed to delete workspace')
    }
  }

  return (
    <div className="mt-7 max-w-xl space-y-6">
      {/* 🔝 HEADER */}
      <h1 className="text-lg font-semibold">
        Workspace Settings
      </h1>

      {/* ❌ ERROR */}
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded">
          {errorMsg}
        </div>
      )}

      {/* 📦 INFO CARD */}
      <div className="p-5 border rounded-xl bg-white shadow-sm space-y-2">
        <p className="text-xs text-gray-400">
          Workspace Slug
        </p>
        <p className="font-medium">{data?.slug}</p>

        <p className="text-xs text-gray-400 mt-3">
          Total Members
        </p>
        <p className="font-medium">{data?.total_members}</p>

        <p className="text-xs text-gray-400 mt-3">
          Total Projects
        </p>
        <p className="font-medium">{data?.total_projects}</p>
      </div>

      {/* ✏️ EDIT */}
      {canUpdateWorkspace && (
        <div className="p-5 border rounded-xl bg-white shadow-sm space-y-3">
          <h3 className="text-sm font-medium">
            Edit Workspace Name
          </h3>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="px-4 py-2 bg-primary_blue text-white rounded-lg text-sm"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* ⚠️ DANGER ZONE */}
      {canDeleteWorkspace && (
        <div className="p-5 border border-red-200 rounded-xl bg-red-50 space-y-3">
          <h3 className="font-medium text-red-600">
            Danger Zone
          </h3>

          <p className="text-xs text-red-500">
            Deleting this workspace will remove all projects and data permanently.
          </p>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
          >
            {isDeleting ? 'Deleting...' : 'Delete Workspace'}
          </button>
        </div>
      )}
    </div>
  )
}

export default WorkspaceSettings