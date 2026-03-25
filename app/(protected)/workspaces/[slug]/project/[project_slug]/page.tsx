'use client'

import WorkspaceTopbar from '@/components/features/workspace/WorkspaceTopbar'
import { useParams } from 'next/navigation'
import ProjectTasks from '@/components/features/project/ProjectTasks'
import ProjectMembers from '@/components/features/project/ProjectMembers'
import ProjectSettings from '@/components/features/project/ProjectSettings'
import { useWorkspace } from '@/context/WorkspaceContext'
import { useEffect } from 'react'
import { useGetWorkspaceProjectDetailQuery } from '@/store/services/workspaceApi'
import { IItem } from '@/types/project'

const ProjectDetail = () => {
  const params = useParams()
  const { selectedItem, setSelectedProject } = useWorkspace()

  // ✅ API call
  const {
    data: project,
    isLoading,
    error,
  } = useGetWorkspaceProjectDetailQuery(
    {
      workspace_slug: params?.slug,
      project_slug: params?.project_slug,
    },
    {
      skip: !params?.slug || !params?.project_slug,
    }
  )

  console.log(project)



  // ✅ Context update when data arrives
  useEffect(() => {
    if (project) {
     
      console.log(project)
      setSelectedProject(project)
    
    }
  }, [project])

  

  // ✅ View switch
  const renderView = () => {
    switch (selectedItem) {
      case 'project-tasks':
        return <ProjectTasks  />
      case 'project-members':
        return <ProjectMembers project={project} />
      case 'project-settings':
        return <ProjectSettings  />
      default:
        return null
    }
  }

  // ✅ Loading state
  if (isLoading) {
    return <div className="p-4">Loading project...</div>
  }

  // ✅ Error state
  if (error) {
    return <div className="p-4 text-red-500">Failed to load project</div>
  }

  return (
    <div>
      {/* ✅ Dynamic title */}
      <WorkspaceTopbar type="project"  />

      <div>
        {renderView()}
      </div>
    </div>
  )
}

export default ProjectDetail