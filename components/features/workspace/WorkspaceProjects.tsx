'use client'

import { Button } from '@/components/ui/Button'
import { useWorkspace } from '@/context/WorkspaceContext'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useGetWorkspaceProjectsQuery } from '@/store/services/workspaceApi'

const WorkspaceProjects = () => {
  const router = useRouter()
  const { setSelectedProject } = useWorkspace()
  const params = useParams()
  const slug = params.slug

  const { data, isLoading } = useGetWorkspaceProjectsQuery(slug, {
    skip: !slug,
  })

  if (isLoading) return <p>Loading projects...</p>

  return (
    <div className="mt-7">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold">All available projects</h1>

        <Button className="bg-cards text-black rounded border-custom_border border hover:text-white">
          <Plus size={16} /> Create New Project
        </Button>
      </div>

      <div className="grid grid-cols-3 mt-3 gap-x-20 gap-y-10">
        {data?.map((project:any) => (
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