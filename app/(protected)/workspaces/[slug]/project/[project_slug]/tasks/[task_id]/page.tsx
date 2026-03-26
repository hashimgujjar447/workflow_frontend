'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGetTaskQuery } from '@/store/services/workspaceApi'
import { Calendar } from 'lucide-react'

const statusColors = {
  todo: 'bg-gray-200 text-gray-700',
  inprogress: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
}

const TaskDetailPage = () => {
  const params = useParams()
  const router = useRouter()

  const { slug, project_slug, task_id } = params as {
    slug: string
    project_slug: string
    task_id: string
  }

  const { data: task, isLoading } = useGetTaskQuery({
    workspace_slug: slug,
    project_slug,
    task_id,
  })

  if (isLoading) return <div className="p-5 text-sm">Loading...</div>
  if (!task) return <div className="p-5 text-red-500">Task not found</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border p-6">

        {/* 🔥 Title */}
        <h1 className="text-2xl font-semibold">{task.title}</h1>

        {/* 🔥 Status */}
        <div className="mt-2">
          <span className={`text-xs px-3 py-1 rounded-full ${statusColors[task.status]}`}>
            {task.status}
          </span>
        </div>

        {/* 🔥 Description */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Description
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {task.description || 'No description'}
          </p>
        </div>

        {/* 🔥 Divider */}
        <div className="my-6 border-t" />

        {/* 🔥 META SECTION (IMPROVED) */}
        <div className="grid grid-cols-2 gap-6">

          {/* 👤 Assigned To */}
          <div className="bg-gray-50 border rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2">Assigned to</p>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                {task.assigned_to?.member?.first_name?.[0] || '?'}
              </div>

              <div>
                <p className="text-sm font-medium">
                  {task.assigned_to?.member?.first_name || 'Unassigned'}
                </p>
                <p className="text-xs text-gray-500">
                  {task.assigned_to?.role}
                </p>
              </div>
            </div>
          </div>

          {/* 🛠 Created By */}
          <div className="bg-gray-50 border rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2">Created by</p>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-semibold">
                {task.created_by?.first_name?.[0] || '?'}
              </div>

              <div>
                <p className="text-sm font-medium">
                  {task.created_by?.first_name}
                </p>
                <p className="text-xs text-gray-500">
                  Task creator
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 🕒 Created Date */}
        <div className="mt-4 text-xs text-gray-500">
          Created on: {new Date(task.created_at).toLocaleDateString()}
        </div>

        {/* 📅 Due Date */}
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} />
          <span>
            {task.due_date
              ? new Date(task.due_date).toLocaleDateString()
              : 'No due date'}
          </span>
        </div>

        {/* 🔥 COMMENTS PREVIEW */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-3">
            Comments ({task.comments?.length || 0})
          </h2>

          <div className="space-y-3">

            {task.comments?.length === 0 && (
              <p className="text-xs text-gray-400">No comments yet</p>
            )}

            {task.comments?.map((comment: any) => (
              <div
                key={comment.id}
                className="bg-gray-50 border rounded-lg p-3"
              >
                <p className="text-xs font-medium text-gray-700">
                  {comment.author.first_name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {comment.content}
                </p>
              </div>
            ))}

          </div>

          {/* 🔥 View More */}
          <button
            onClick={() =>
              router.push(
                `/workspace/${slug}/projects/${project_slug}/tasks/${task_id}?comments=true`
              )
            }
            className="mt-4 text-xs text-blue-600 hover:underline"
          >
            View all comments →
          </button>
        </div>

      </div>
    </div>
  )
}

export default TaskDetailPage