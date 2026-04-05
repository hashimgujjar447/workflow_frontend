'use client'

import WorkspaceTopbar from '@/components/features/workspace/WorkspaceTopbar'
import { useParams } from 'next/navigation'
import ProjectTasks from '@/components/features/project/ProjectTasks'
import ProjectMembers from '@/components/features/project/ProjectMembers'
import ProjectSettings from '@/components/features/project/ProjectSettings'
import { useWorkspace } from '@/context/WorkspaceContext'
import { useEffect } from 'react'
import { useGetWorkspaceProjectDetailQuery } from '@/store/services/workspaceApi'

const ProjectDetail = () => {
  const params = useParams()

  const { projectTab, setSelectedProject } = useWorkspace()

  const {
    data: project,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetWorkspaceProjectDetailQuery(
    {
      workspace_slug: params?.slug,
      project_slug: params?.project_slug,
    },
    {
      skip: !params?.slug || !params?.project_slug,
    }
  )

  // ✅ set project in context
  useEffect(() => {
    if (project) {
      setSelectedProject(project)
    }
  }, [project, setSelectedProject])

  // 🔄 FIRST LOAD
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500">Loading project...</p>
      </div>
    )
  }

 
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <p className="text-lg font-medium text-red-500">
          Failed to load project
        </p>

        <p className="text-sm text-gray-500">
          Something went wrong. Please try again.
        </p>

        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-80 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  // ✅ VIEW SWITCH
  const renderView = () => {
    const current = projectTab || 'project-tasks'

    switch (current) {
      case 'project-tasks':
        return <ProjectTasks />

      case 'project-members':
        return <ProjectMembers project={project} />

      case 'project-settings':
        return <ProjectSettings />

      default:
        return null
    }
  }

  return (
    <div >
      {/* 🔝 TOPBAR */}
      <WorkspaceTopbar type="project" />

    

      {/* 📦 CONTENT */}
      <div className="mt-3">
        {renderView()}
      </div>
    </div>
  )
}

export default ProjectDetail