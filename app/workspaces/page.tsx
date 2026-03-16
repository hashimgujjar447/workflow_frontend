'use client'
import TopBar from '@/components/layouts/TopBar'
import React, { useState } from 'react'

export interface IWorkspace {
  title: string
  description: string
}
const page = () => {
  const [workspaces,setWorkspaces]=useState<IWorkspace[]>([
    {
      title:"First Workspace",
      description:"This is the first workspace"
    },
       {
      title:"second workspace",
      description:"This is the first workspace"
    },
       {
      title:"Third Workspace",
      description:"This is the first workspace"
    }
  ]);
  return (
    <div className='p-4'>
      <TopBar workspaces={workspaces}   />
    </div>
  )
}

export default page