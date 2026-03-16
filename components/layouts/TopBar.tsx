import { BellRing } from 'lucide-react'
import React from 'react'
import { IWorkspace } from '@/app/workspaces/page'
interface ITopbar{
    workspaces?:IWorkspace[]
}

const TopBar = ({workspaces}:ITopbar) => {
  return (
    <div className='flex items-center justify-between'>
        <div>
           {workspaces ?<select className='border-border border outline-none p-1'>
            <option value="all_workspaces">Your Workspaces</option>
            {workspaces.map((workspace)=>(
                <option value={workspace.title}>{workspace.title}</option>
            ))}
           
           </select>:<h1 className='font-bold text-lg'>DashBoard</h1>}
        </div>
         <div className='flex items-center gap-x-4'>
        <input type="text" className='outline-none border border-border p-1 rounded' placeholder='Search' />
        <BellRing />
        <div className='bg-black rounded-full text-sidebar-text h-8 flex items-center justify-center w-8'>
          M
        </div>
      </div>
    </div>
  )
}

export default TopBar