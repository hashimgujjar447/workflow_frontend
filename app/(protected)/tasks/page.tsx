'use client'

import React from 'react'
import {  useGetAllUserTasksQuery } from '@/store/services/workspaceApi'
import { Calendar, User } from 'lucide-react'

const TaskCard = ({ task }: any) => {
  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-md transition">

      {/* TITLE */}
      <h3 className="text-sm font-semibold">{task.title}</h3>

      {/* DESCRIPTION */}
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
        {task.description || 'No description'}
      </p>

      {/* META */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">

        <div className="flex items-center gap-1">
          <User size={12} />
          {task.assigned_to?.member?.first_name || 'Unassigned'}
        </div>

        <div className="flex items-center gap-1">
          <Calendar size={12} />
          {task.due_date
            ? new Date(task.due_date).toLocaleDateString()
            : 'No date'}
        </div>

      </div>
    </div>
  )
}

const Page = () => {
  const { data, isLoading, error, refetch } = useGetAllUserTasksQuery(undefined)
  console.log(data)

  /* 🔄 LOADING */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  /* ❌ ERROR */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <p className="text-red-500 text-sm">Failed to load tasks</p>
        <button
          onClick={() => refetch()}
          className="px-3 py-2 bg-black text-white rounded text-xs"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">

      {/* 🔝 HEADER */}
      <div>
        <h1 className="text-lg font-semibold">Tasks</h1>
        <p className="text-xs text-gray-500">
          Manage and track your work
        </p>
      </div>

      {/* 🎯 MY TASKS */}
      <div>
        <h2 className="text-sm font-semibold mb-3">
          My Tasks
        </h2>

        {data?.my_tasks?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.my_tasks.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[20vh] text-gray-500 text-sm">
            No assigned tasks
          </div>
        )}
      </div>

      {/* 📌 RECENT TASKS */}
      <div>
        <h2 className="text-sm font-semibold mb-3">
          Recent Tasks
        </h2>

        {data?.recent_tasks?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recent_tasks.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[20vh] text-gray-500 text-sm">
            No recent tasks
          </div>
        )}
      </div>
    </div>
  )
}

export default Page