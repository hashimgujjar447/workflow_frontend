'use client'

import { Button } from '@/components/ui/Button'
import { useWorkspace } from '@/context/WorkspaceContext'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useGetWorkspaceProjectsQuery, useCreateWorkspaceProjectMutation } from '@/store/services/workspaceApi'
import { IProject } from '@/types/project'
import { useState } from 'react'

const WorkspaceProjects = () => {
  const router = useRouter()
  const { setSelectedProject } = useWorkspace()
  const params = useParams()
  const slug = params.slug as string

  const { data, isLoading } = useGetWorkspaceProjectsQuery(slug, {
    skip: !slug,
  })

  const [createProject, { isLoading: creating }] = useCreateWorkspaceProjectMutation()

  // ✅ modal state
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) return

    try {
      await createProject({
        workspace_slug: slug,
        data: { name },
      }).unwrap()

      setName('')
      setOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) return <p>Loading projects...</p>

  return (
    <div className="mt-7">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold">All available projects</h1>

        {/* ✅ button */}
        <Button
          onClick={() => setOpen(true)}
          className="bg-cards text-black rounded border-custom_border border hover:text-white"
        >
          <Plus size={16} /> Create New Project
        </Button>
      </div>

      {/* ✅ modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px]">
            <h2 className="text-sm font-semibold mb-3">Create Project</h2>

            <input
              className="border w-full p-2 mb-4 rounded"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button onClick={() => setOpen(false)}>Cancel</Button>

              <Button
                onClick={handleCreate}
                disabled={creating}
                className="bg-primary_blue text-white"
              >
                {creating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ projects list */}
      <div className="grid grid-cols-3 mt-3 gap-x-20 gap-y-10">
        {data?.map((project: IProject) => (
          <div key={project.slug} className="bg-white border rounded-xl p-4 hover:shadow-md transition">
            
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-sm">{project.name}</h3>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {project.status}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Created at: {new Date(project.created_at).toLocaleDateString()}
            </p>

            <div className="flex justify-between items-center mt-4">
              <Button
                className="text-xs bg-primary_blue text-white px-3 py-1"
                onClick={() => {
                  setSelectedProject(project)
                  router.push(`/workspaces/${slug}/project/${project.slug}`)
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkspaceProjects