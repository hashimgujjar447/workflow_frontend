'use client'

import { BellRing } from 'lucide-react'
import React from 'react'
import { IWorkspace } from '@/lib/types'
import { useRouter, useParams } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ITopbar {
  workspaces?: IWorkspace[]
}

const TopBar = ({ workspaces }: any) => {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string | undefined

  

  return (
    <div className='flex items-center justify-between'>
      <div>
        {workspaces && workspaces.length > 0 ? (
         <Select
  value={slug || ""}
  onValueChange={(value) => {
    router.push(`/workspaces/${value}`)
  }}
>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Workspace" />
            </SelectTrigger>

            <SelectContent>
              {workspaces.map((workspace:any) => (
                <SelectItem
                  key={workspace.slug}
                  value={workspace.slug}
                >
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <h1 className='font-bold text-lg'>DashBoard</h1>
        )}
      </div>

      <div className='flex items-center  sm:gap-x-4'>
        <input
          type="text"
          className='outline-none border w-40 border-border p-1 rounded'
          placeholder='Search'
        />
        <BellRing className='hidden sm:inline-block' />
        <div className='bg-black hidden rounded-full text-sidebar-text h-8 sm:flex items-center justify-center w-8'>
          M
        </div>
      </div>
    </div>
  )
}

export default TopBar