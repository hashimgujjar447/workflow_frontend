'use client'

import WorkspaceTopbar from '@/components/features/workspace/WorkspaceTopbar'
import { useParams } from 'next/navigation'
import ProjectTasks from '@/components/features/project/ProjectTasks'
import ProjectMembers from '@/components/features/project/ProjectMembers'
import ProjectSettings from '@/components/features/project/ProjectSettings'
import { useWorkspace } from '@/context/WorkspaceContext'
import { useEffect } from 'react'
const ProjectDetail = () => {
  const params = useParams()
  const{selectedItem,setSelectedProject}=useWorkspace()
  useEffect(()=>{
     setSelectedProject('Project Alpha')
  },[params])
 const renderView=()=>{
  switch(selectedItem){
    case 'project-tasks':
      return <ProjectTasks/>
    case 'project-members':
      return <ProjectMembers/>
    case 'project-settings':
      return <ProjectSettings/>
    default:
      return null;      
  }
 }
  return (
   <div>
    <WorkspaceTopbar type='project' />
     <div >
   

      <div>
        {renderView()}
      </div>

    </div>
   </div>
  )
}

export default ProjectDetail