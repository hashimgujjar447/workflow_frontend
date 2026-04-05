'use client'

import React from 'react'
import { useGetAllUserTasksQuery } from '@/store/services/workspaceApi'
import { Calendar, User } from 'lucide-react'

/* 🎨 STATUS COLORS */
const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 text-gray-600'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-700'
    case 'done':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

/* 🧩 TASK CARD */
const TaskCard = ({ task }: any) => {
  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date()

  return (
    <div className="bg-white border rounded-2xl p-5 hover:shadow-lg transition group">

      {/* 🔝 TOP */}
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold group-hover:text-black">
          {task.title}
        </h3>

        <span
          className={`px-2 py-1 text-[10px] rounded-full ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      {/* 📝 DESCRIPTION */}
      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
        {task.description || 'No description'}
      </p>

      {/* 📁 PROJECT + WORKSPACE */}
      <div className="mt-3 text-[11px] text-gray-400 space-y-1">
        <p>📁 {task.project_name || 'No project'}</p>
        <p>🏢 {task.workspace_name || 'No workspace'}</p>
      </div>

      {/* 📊 META */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">

        <div className="flex items-center gap-1">
          <User size={12} />
          {task.assigned_to?.name || 'Unassigned'}
        </div>

        <div
          className={`flex items-center gap-1 ${
            isOverdue ? 'text-red-500 font-medium' : ''
          }`}
        >
          <Calendar size={12} />
          {task.due_date
            ? new Date(task.due_date).toLocaleDateString()
            : 'No date'}
        </div>

      </div>
    </div>
  )
}

/* 📄 MAIN PAGE */
const Page = () => {
  const { data, isLoading, error, refetch } =
    useGetAllUserTasksQuery(undefined)

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
    <div className="p-4 sm:p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* 🔝 HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Tasks</h1>
        <p className="text-sm text-gray-500">
          Manage and track your work
        </p>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-semibold">
            {data?.count || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border text-center">
          <p className="text-xs text-gray-500">My Tasks</p>
          <p className="text-lg font-semibold">
            {data?.my_tasks?.length || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border text-center">
          <p className="text-xs text-gray-500">Recent</p>
          <p className="text-lg font-semibold">
            {data?.recent_tasks?.length || 0}
          </p>
        </div>
      </div>

      {/* 🎯 MY TASKS */}
      <div>
        <h2 className="text-sm font-semibold mb-3">
          My Tasks
        </h2>

        {data?.my_tasks?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.my_tasks.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[20vh] text-gray-400 text-sm">
            <p>No tasks found 😴</p>
            <p className="text-xs">You’re all caught up</p>
          </div>
        )}
      </div>

      {/* 📌 RECENT TASKS */}
      <div>
        <h2 className="text-sm font-semibold mb-3">
          Recent Tasks
        </h2>

        {data?.recent_tasks?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.recent_tasks.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[20vh] text-gray-400 text-sm">
            <p>No recent tasks 😴</p>
            <p className="text-xs">Nothing to show</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page