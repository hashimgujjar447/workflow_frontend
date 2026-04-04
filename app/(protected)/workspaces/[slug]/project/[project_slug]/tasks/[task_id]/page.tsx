'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  useGetTaskQuery,
  useUpdateTaskStatusMutation,
} from '@/store/services/workspaceApi'
import { Calendar, MessageSquare } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import CommentCard from '@/components/features/tasks/CommentCard'

const statusColors: any = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
}

const TaskDetailPage = () => {
  const params = useParams()
  const router = useRouter()

  const { user } = useSelector((state: RootState) => state.auth)

  const { slug, project_slug, task_id } = params as any

  const { data: task, isLoading } = useGetTaskQuery({
    workspace_slug: slug,
    project_slug,
    task_id,
  })

  const [updateStatus] = useUpdateTaskStatusMutation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!task) return <div>Task not found</div>

  // 🔥 Due date logic
  const dueDate = task.due_date ? new Date(task.due_date) : null
  const today = new Date()
  const isOverdue = dueDate && dueDate < today

  return (
    <div className="min-h-screen bg-gray-50 sm:p-6">

      {/* 🧾 TASK CARD */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border shadow-sm p-6">

        {/* TITLE + STATUS */}
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-xl font-semibold">{task.title}</h1>

          <select
            value={task.status}
            onChange={(e) =>
              updateStatus({
                workspace_slug: slug,
                project_slug,
                task_id,
                status: e.target.value,
              })
            }
            className={`text-xs px-3 py-1 rounded-full border ${statusColors[task.status]}`}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-5">
          <h2 className="text-sm font-semibold mb-1">Description</h2>
          <p className="text-sm text-gray-600">
            {task.description || 'No description'}
          </p>
        </div>

        {/* 🔥 IMPROVED META SECTION */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* 👤 ASSIGNED USER */}
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary_blue text-white text-sm font-semibold">
              {task.assigned_to?.member?.first_name?.charAt(0) || 'U'}
            </div>

            <div>
              <p className="text-xs text-gray-400">Assigned to</p>
              <p className="font-medium text-sm">
                {task.assigned_to?.member?.first_name || 'Unassigned'}
              </p>
            </div>
          </div>

          {/* ⏰ DUE DATE */}
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl">
            <Calendar size={16} className={isOverdue ? 'text-red-500' : ''} />

            <div>
              <p className="text-xs text-gray-400">Due date</p>
              <p className={`font-medium text-sm ${isOverdue ? 'text-red-500' : ''}`}>
                {dueDate
                  ? dueDate.toLocaleDateString()
                  : 'No deadline'}
              </p>

           
            </div>
          </div>

        </div>

        {/* CREATED INFO */}
        <div className="mt-6 text-xs text-gray-500 flex justify-between flex-wrap gap-2">
          <span>
            Created by: {task.created_by?.first_name}
          </span>
          <span>
            Created: {new Date(task.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* 💬 COMMENTS PREVIEW */}
      <div className="max-w-3xl mx-auto mt-6 bg-white rounded-2xl border shadow-sm p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold flex gap-2 items-center">
            <MessageSquare size={16} />
            Comments ({task.comments?.length || 0})
          </h2>

          <button
            onClick={() =>
              router.push(
                `/workspaces/${slug}/project/${project_slug}/tasks/${task_id}/comments`
              )
            }
            className="text-xs text-primary_blue hover:underline"
          >
            View all
          </button>
        </div>

        {task.comments?.length ? (
          <div className="space-y-3">
            {task.comments.slice(0, 2).map((c: any) => (
              <CommentCard key={c.id} comment={c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            No comments yet
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetailPage