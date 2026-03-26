'use client'

import React from 'react'
import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useGetProjectTasksQuery } from '@/store/services/workspaceApi'
import { useParams, useRouter } from 'next/navigation'

/* ================= TYPES ================= */

type TaskStatus = 'todo' | 'inprogress' | 'failed' | 'completed'

interface ITask {
  id: number
  title: string
  description?: string
  status: TaskStatus
  due_date?: string
  created_at?: string
}

interface IGroupedTasks {
  todo: ITask[]
  inprogress: ITask[]
  failed: ITask[]
  completed: ITask[]
}

/* ================= COMPONENT ================= */

const ProjectTasks = () => {
  const params = useParams()
  const router = useRouter()

  const workspace_slug = params?.slug as string
  const project_slug = params?.project_slug as string

  const { data, isLoading, error } = useGetProjectTasksQuery(
    {
      workspace_slug,
      project_slug,
    },
    {
      skip: !workspace_slug || !project_slug,
    }
  )

  /* ================= SAFE DATA ================= */

  const tasksData: IGroupedTasks = data ?? {
    todo: [],
    inprogress: [],
    failed: [],
    completed: [],
  }

  /* ================= LOADING ================= */

  if (isLoading) {
    return <div className="mt-5 text-sm">Loading tasks...</div>
  }

  /* ================= ERROR ================= */

  if (error) {
    return <div className="mt-5 text-red-500 text-sm">Failed to load tasks</div>
  }

  /* ================= COLUMNS ================= */

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-todo',
      tasks: tasksData.todo,
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      color: 'bg-info',
      tasks: tasksData.inprogress,
    },
    {
      id: 'failed',
      title: 'Failed',
      color: 'bg-warning',
      tasks: tasksData.failed,
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-success',
      tasks: tasksData.completed,
    },
  ]

  /* ================= UI ================= */

  return (
    <div className="mt-5">

      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-sm font-semibold">Project Tasks</h1>

        <Button className="bg-primary_blue text-white text-xs px-3 py-1 flex items-center gap-1">
          <Plus size={14} />
          Add Task
        </Button>
      </div>

      {/* 🔥 Board */}
      <div className="flex gap-5 overflow-x-auto pb-2">

        {columns.map((col) => (
          <div
            key={col.id}
            className="min-w-[280px] bg-gray-50 border rounded-xl p-3 hover:bg-gray-100 transition"
          >
            {/* Column Header */}
            <div className={`flex justify-between text-white items-center px-2 py-2 rounded ${col.color}`}>
              <h2 className="text-sm font-semibold">
                {col.title} ({col.tasks.length})
              </h2>
              <span className="text-xs">•••</span>
            </div>

            {/* Tasks */}
            <div className="mt-3 space-y-3 max-h-60 overflow-y-auto pr-1">

              {col.tasks.length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-5">
                  No tasks yet
                </p>
              )}

              {col.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() =>
                    router.push(
                      `/workspaces/${workspace_slug}/project/${project_slug}/tasks/${task.id}`
                    )
                  }
                  className="bg-white p-3 rounded-lg border hover:shadow-md transition cursor-pointer group"
                >
                  {/* Title */}
                  <h3 className="text-sm font-medium">{task.title}</h3>

                  {/* Due Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Calendar size={12} />
                    <span>
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : 'No date'}
                    </span>
                  </div>

                  {/* 🔥 Hover CTA */}
                  <p className="mt-3 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition">
                    View details →
                  </p>
                </div>
              ))}

            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default ProjectTasks