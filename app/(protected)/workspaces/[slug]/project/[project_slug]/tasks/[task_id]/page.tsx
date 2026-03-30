'use client'

import { useParams, useRouter } from 'next/navigation'
import { useGetTaskQuery, useUpdateTaskStatusMutation } from '@/store/services/workspaceApi'
import { Calendar } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useSocket } from '@/context/SocketContext'
import { useEffect } from 'react'
import { workspaceApi } from '@/store/services/workspaceApi'
import { useAppDispatch } from '@/hooks/hooks'
import {store} from "@/store/store"

const statusColors = {
  todo: 'bg-gray-200 text-gray-700',
  inprogress: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
}

const TaskDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)
  const socket = useSocket()
  const dispatch = useAppDispatch()

  const { slug, project_slug, task_id } = params as {
    slug: string
    project_slug: string
    task_id: string
  }
  const workspace_slug=slug

  const { data: task, isLoading } = useGetTaskQuery(
    {
      workspace_slug: slug,
      project_slug,
      task_id,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const [updateStatus] = useUpdateTaskStatusMutation()

  useEffect(() => {
    if (!socket) return

    const handler = (e: MessageEvent) => {
      const data = JSON.parse(e.data)
    console.log(data)
      if (data.event === "task_updated") {
        

        // ✅ update single task
        dispatch(
          workspaceApi.util.updateQueryData(
            "getTask",
            { workspace_slug: slug, project_slug, task_id },
            (draft) => {
              draft.status = data.status
            }
          )
        )
  
      }
    }

    socket.addEventListener("message", handler)

    return () => {
      socket.removeEventListener("message", handler)
    }

  }, [socket, slug, project_slug, task_id])

  if (isLoading) return <div className="p-5 text-sm">Loading...</div>
  if (!task) return <div className="p-5 text-red-500">Task not found</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border p-6">

        <h1 className="text-2xl font-semibold">{task.title}</h1>

        <div className="mt-2">
          {task.assigned_to?.member?.email === user?.email ? (
            <select
              value={task.status}
              onChange={async (e) => {
                await updateStatus({
                  workspace_slug: slug,
                  project_slug,
                  task_id,
                  status: e.target.value,
                })
              }}
              className={`text-xs px-3 py-1 rounded-full border ${statusColors[task.status]}`}
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          ) : (
            <span className={`text-xs px-3 py-1 rounded-full ${statusColors[task.status]}`}>
              {task.status}
            </span>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Description</h2>
          <p className="text-sm text-gray-600">{task.description || 'No description'}</p>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} />
          <span>
            {task.due_date
              ? new Date(task.due_date).toLocaleDateString()
              : 'No due date'}
          </span>
        </div>

      </div>
    </div>
  )
}

export default TaskDetailPage