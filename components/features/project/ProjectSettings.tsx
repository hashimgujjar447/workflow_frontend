'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '@/store/services/workspaceApi'

import { useSelector } from 'react-redux'
import { useWorkspace } from '@/context/WorkspaceContext'

const ProjectSettings = () => {
  const params = useParams()
  const router = useRouter()

  const workspaceSlug = params?.slug
  const projectSlug = params?.project_slug

  // 🧠 selectedProject from store
  const {selectedProject} = useWorkspace()
  

  const [name, setName] = useState('')

  const [updateProject, { isLoading: isUpdating }] =
    useUpdateProjectMutation()

  const [deleteProject, { isLoading: isDeleting }] =
    useDeleteProjectMutation()

  // set initial name
  useEffect(() => {
    if (selectedProject) {
      setName(selectedProject?.name)
    }
  }, [selectedProject])

  // ✏️ Update handler
  const handleUpdate = async () => {
    try {
      await updateProject({
        workspace_slug: workspaceSlug,
        project_slug: projectSlug,
        data: {
          name,
        },
      }).unwrap()

      alert('Project updated successfully ✅')
    } catch (err) {
      console.error(err)
      alert('Update failed ❌')
    }
  }

  // 🗑️ Delete handler
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

      alert('Project deleted 🗑️')

      // redirect after delete
      router.push(`/workspace/${workspaceSlug}`)
    } catch (err) {
      console.error(err)
      alert('Delete failed ❌')
    }
  }

  if (!selectedProject) return <div>Loading project...</div>

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-xl font-semibold">Project Settings</h2>

      {/* 📌 Project Info */}
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-gray-500">Project Slug</p>
        <p className="font-medium">{selectedProject.slug}</p>

        <p className="text-sm text-gray-500 mt-2">Total Members</p>
        <p>{selectedProject?.total_members}</p>
      </div>

      {/* ✏️ Edit Name */}
      <div className="p-4 border rounded-lg space-y-3">
        <h3 className="font-medium">Edit Project Name</h3>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </div>

      {/* 🗑️ Delete */}
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium text-red-600">Danger Zone</h3>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          {isDeleting ? 'Deleting...' : 'Delete Project'}
        </button>
      </div>
    </div>
  )
}

export default ProjectSettings