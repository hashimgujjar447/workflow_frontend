'use client'

import WorkspaceInfo from '@/components/features/workspace/WorkspaceInfo'
import WorkspaceTopbar from '@/components/features/workspace/WorkspaceTopbar'

import React, { useState } from 'react'

const WorkspacePage = () => {
 
  return(
    <>
     <WorkspaceTopbar type='workspace'  /> 
  <WorkspaceInfo  /></>
  )
  
}

export default WorkspacePage