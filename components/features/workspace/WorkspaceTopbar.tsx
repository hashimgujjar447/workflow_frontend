'use client'
import { Button } from '@/components/ui/Button'
import { Clipboard, Ellipsis, Settings, UserRound } from 'lucide-react'
import React, { useEffect } from 'react'
import { useWorkspace, WorkspaceProvider } from '@/context/WorkspaceContext'

interface IWorkspaceTopBar {
  type?: 'workspace' | 'project'
}

const WorkspaceTopbar = ({type='workspace'}:IWorkspaceTopBar) => {
    const{selectedItem,setSelectedItem}=useWorkspace()
    const workspaceList=[
        {
            id:1,
            title:'Projects',
            icon:<Clipboard className='w-4 h-4 text-text-secondary' />
        },{
            id:2,
            title:'Members',
            icon:<UserRound className='w-4 h-4 text-text-secondary' />
        },{
            id:3,
            title:'settings',
            icon:<Settings  className='w-4 h-4 text-text-secondary'/>
            
        }
    ]
       const projectList=[
        {
            id:1,
            title:'Tasks',
            icon:<Clipboard className='w-4 h-4 text-text-secondary' />
        },{
            id:2,
            title:'Members',
            icon:<UserRound className='w-4 h-4 text-text-secondary' />
        },{
            id:3,
            title:'settings',
            icon:<Settings  className='w-4 h-4 text-text-secondary'/>
            
        }
    ]

    const itemsList=type==='workspace'?workspaceList:projectList

    useEffect(()=>{
        if(type==='project'){
            setSelectedItem('Tasks')
            
        }else if(type==='workspace'){
            setSelectedItem('Projects')

        }
    },[type])
  return (
   <div className='bg-cards border py-1 px-3 border-custom_border w-full h-10 justify-between flex items-center'>
     <div className=' flex items-center gap-x-15 '>
     {itemsList.map((item)=>(
        <div onClick={()=>{
            setSelectedItem?.(item.title || '')
        }} className={`flex  relative items-center gap-x-1 ${selectedItem===item.title && 'selected_item_after'} text-sm hover:cursor-pointer text-text-secondary`}>
            {item.icon}
            <h2>{item.title}</h2>
        </div>
     ))}
    </div>
    <Button className={'bg-transparent text-text-secondary hover:bg-transparent cursor-pointer '}>
        <Ellipsis className='h-4 w-4 ' />
    </Button>
   </div>
  )
}

export default WorkspaceTopbar