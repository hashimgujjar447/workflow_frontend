'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  useGetSingleWorkspaceQuery,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from '@/store/services/workspaceApi'

const WorkspaceSettings = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug

  const { data, isLoading } = useGetSingleWorkspaceQuery(slug, {
    skip: !slug,
  })

  const [updateWorkspace] = useUpdateWorkspaceMutation()
  const [deleteWorkspace] = useDeleteWorkspaceMutation()

  const [name, setName] = useState('')

  // set initial value
  useEffect(() => {
    if (data) {
      setName(data.name)
    }
  }, [data])

  const handleUpdate = async () => {
    try {
      await updateWorkspace({ slug, name }).unwrap()
      alert('Workspace updated ✅')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure?')

    if (!confirmDelete) return

    try {
      await deleteWorkspace(slug).unwrap()
      alert('Workspace deleted ❌')
      router.push('/workspaces')
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="mt-7 max-w-xl">
      <h1 className="text-sm font-semibold">Workspace Settings</h1>

      <div className="mt-4 space-y-4">

        {/* Name */}
        <div>
          <label className="text-xs text-gray-500">Workspace Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2 text-sm"
          />
        </div>

        {/* Stats */}
        <div className="text-xs text-gray-500">
          <p>Total Members: {data?.total_members}</p>
          <p>Total Projects: {data?.total_projects}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
          >
            Save Changes
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceSettings