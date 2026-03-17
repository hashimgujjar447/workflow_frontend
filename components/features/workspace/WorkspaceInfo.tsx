import React, { useState } from 'react'
import WorkspaceTopbar from './WorkspaceTopbar'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useWorkspace } from '@/context/WorkspaceContext'

const WorkspaceInfo = () => {
  const{selectedItem,setSelectedItem}=useWorkspace()
  const router=useRouter()
  return (
    <div>


     <div className='mt-3 '>
       
       {selectedItem==='Projects'?
       <div className='mt-7'>
         <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold">All available projects</h1>

          <Button className="bg-cards text-black  rounded border-custom_border border hover:text-white">
            <Plus size={16} /> Create New Project

          </Button>
        </div>
        <div className='grid grid-cols-3 mt-3 gap-x-20 gap-y-10'>
         {[1,2,3,4,5,6].map((i)=>(
           <div className="bg-white border rounded-xl p-4 hover:shadow-md transition">
  <div className="flex justify-between items-start">
    <h3 className="font-semibold text-sm">Project Alpha</h3>
    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
      Active
    </span>
  </div>

  <p className="text-xs text-gray-500 mt-1">
    Website redesign project
  </p>

 <div className="flex justify-between items-center mt-4">
  <div className="flex -space-x-2">
    <div className="h-6 w-6 bg-black rounded-full text-white text-xs flex items-center justify-center">
      A
    </div>
    <div className="h-6 w-6 bg-gray-300 rounded-full text-xs flex items-center justify-center">
      B
    </div>
  </div>

  <Button
    className="text-xs bg-primary_blue text-white px-3 py-1"
    onClick={() => {
        setSelectedItem('tasks')
        const id=i;
        router.push(`/workspaces/project/${id}`)
    }}
  >
    View Details
  </Button>
</div>
</div>
         ))}

       </div>
       </div>
       :<h1>Settings</h1>}

     </div>
    </div>
  )
}

export default WorkspaceInfo