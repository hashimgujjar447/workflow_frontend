import { BellRing } from 'lucide-react'
import React from 'react'

const TopBar = () => {
  return (
    <div className='flex items-center justify-between'>
        <div>
            <h1 className='font-bold text-lg'>DashBoard</h1>
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