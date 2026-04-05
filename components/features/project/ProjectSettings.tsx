'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '@/store/services/workspaceApi'

import { useWorkspace } from '@/context/WorkspaceContext'
import { usePermission } from '@/hooks/usePermissions'

const ProjectSettings = () => {
  const params = useParams()
  const router = useRouter()

  const workspaceSlug = params?.slug
  const projectSlug = params?.project_slug

  const { selectedProject } = useWorkspace()

  const [name, setName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [updateProject, { isLoading: isUpdating }] =
    useUpdateProjectMutation()

  const [deleteProject, { isLoading: isDeleting }] =
    useDeleteProjectMutation()

  const {
    isLoading: permissionLoading,
    canDeleteProject,
    canUpdateProject,
  } = usePermission(workspaceSlug, projectSlug)

  useEffect(() => {
    if (selectedProject) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(selectedProject?.name)
    }
  }, [selectedProject])

  /* 🔄 LOADING */
  if (!selectedProject || permissionLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  /* ✏️ UPDATE */
  const handleUpdate = async () => {
    setErrorMsg('')
    try {
      await updateProject({
        workspace_slug: workspaceSlug,
        project_slug: projectSlug,
        data: { name },
      }).unwrap()
    } catch (err: any) {
      setErrorMsg('Failed to update project')
    }
  }

  /* 🗑 DELETE */
  const handleDelete = async () => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this project?'
    )
    if (!confirmDelete) return

    try {
      await deleteProject({
        workspace_slug: workspaceSlug,
        project_slug: projectSlug,
      }).unwrap()

      router.push(`/workspaces/${workspaceSlug}`)
    } catch (err) {
      setErrorMsg('Failed to delete project')
    }
  }

  return (
    <div className="max-w-xl space-y-6">

      {/* 🔝 HEADER */}
      <h2 className="text-xl font-semibold">Project Settings</h2>

      {/* ❌ ERROR */}
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded">
          {errorMsg}
        </div>
      )}

      {/* 📦 PROJECT INFO */}
      <div className="p-5 border rounded-xl bg-white shadow-sm">
        <p className="text-xs text-gray-400">Project Slug</p>
        <p className="font-medium">{selectedProject.slug}</p>

        <p className="text-xs text-gray-400 mt-3">Total Members</p>
        <p className="font-medium">{selectedProject?.total_members}</p>
      </div>

      {/* ✏️ EDIT */}
      {canUpdateProject && (
        <div className="p-5 border rounded-xl bg-white shadow-sm space-y-3">
          <h3 className="font-medium text-sm">Edit Project Name</h3>

          <input
            type="text"
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
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* ⚠️ DANGER ZONE */}
      {canDeleteProject && (
        <div className="p-5 border border-red-200 rounded-xl bg-red-50 space-y-3">
          <h3 className="font-medium text-red-600">Danger Zone</h3>

          <p className="text-xs text-red-500">
            Deleting this project will remove all related data permanently.
          </p>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectSettings