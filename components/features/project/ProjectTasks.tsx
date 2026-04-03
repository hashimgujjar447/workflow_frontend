'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  useGetProjectMembersQuery,
  useGetProjectTasksQuery,
  useAddNewTaskMutation,
  workspaceApi,
} from '@/store/services/workspaceApi'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/hooks'
import { useSocket } from '@/context/SocketContext'

/* ================= TYPES ================= */

type TaskStatus = 'todo' | 'in_progress' | 'failed' | 'completed'

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
  const dispatch = useAppDispatch()
  const socket = useSocket()

  const [openAddTaskMenu, setOpenAddTaskMenu] = useState(false)
  const [assignedUser, setAssignedUser] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [dueDate, setDueDate] = useState('')

  const workspace_slug = params?.slug as string
  const project_slug = params?.project_slug as string

  const [addNewTask, { isLoading: isCreating }] = useAddNewTaskMutation()

  const { data, isLoading: isTasksLoading, error } =
    useGetProjectTasksQuery(
      { workspace_slug, project_slug },
      { skip: !workspace_slug || !project_slug }
    )

  const { data: members } = useGetProjectMembersQuery(
    { workspace_slug, project_slug },
    { skip: !workspace_slug || !project_slug }
  )

  const tasksData: IGroupedTasks = data ?? {
    todo: [],
    inprogress: [],
    failed: [],
    completed: [],
  }

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!socket) return

    const handler = (e: MessageEvent) => {
      const data = JSON.parse(e.data)

      if (data.event === 'task_created') {
        dispatch(
          workspaceApi.util.updateQueryData(
            'getProjectTasks',
            { workspace_slug, project_slug },
            (draft: IGroupedTasks) => {
              const exists =
                draft.todo.find((t) => t.id === data.id) ||
                draft.inprogress.find((t) => t.id === data.id) ||
                draft.completed.find((t) => t.id === data.id) ||
                draft.failed.find((t) => t.id === data.id)

              if (exists) return

              const task: ITask = {
                id: data.id,
                title: data.title,
                status: data.status,
              }

              if (task.status === 'todo') draft.todo.unshift(task)
              if (task.status === 'in_progress') draft.inprogress.unshift(task)
              if (task.status === 'completed') draft.completed.unshift(task)
              if (task.status === 'failed') draft.failed.unshift(task)
            }
          )
        )
      }

      if (data.event === 'task_updated') {
        dispatch(
          workspaceApi.util.updateQueryData(
            'getProjectTasks',
            { workspace_slug, project_slug },
            (draft: IGroupedTasks) => {
              const lists = [
                draft.todo,
                draft.inprogress,
                draft.completed,
                draft.failed,
              ]

              let taskToMove: ITask | null = null

              // remove from old list
              for (const list of lists) {
                const index = list.findIndex((t) => t.id === data.id)
                if (index !== -1) {
                  taskToMove = list[index]
                  list.splice(index, 1)
                  break
                }
              }

              if (!taskToMove) return

              taskToMove.status = data.status as TaskStatus

              if (data.status === 'todo') draft.todo.unshift(taskToMove)
              if (data.status === 'in_progress')
                draft.inprogress.unshift(taskToMove)
              if (data.status === 'completed')
                draft.completed.unshift(taskToMove)
              if (data.status === 'failed') draft.failed.unshift(taskToMove)
            }
          )
        )
      }
    }

    socket.addEventListener('message', handler)

    return () => {
      socket.removeEventListener('message', handler)
    }
  }, [socket, project_slug, workspace_slug, dispatch])

  /* ================= HANDLERS ================= */

  const handleAddNewTask = async () => {
    try {
      await addNewTask({
        workspace_slug,
        project_slug,
        title,
        description,
        assigned_to: Number(assignedUser),
        status,
        due_date: dueDate,
      }).unwrap()

      setOpenAddTaskMenu(false)
      setTitle('')
      setDescription('')
      setAssignedUser('')
    } catch (err) {
      console.log(err)
    }
  }

  /* ================= UI ================= */

  if (isTasksLoading) {
    return <div className="mt-5 text-sm">Loading tasks...</div>
  }

  if (error) {
    return (
      <div className="mt-5 text-red-500 text-sm">
        Failed to load tasks
      </div>
    )
  }

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-todo', tasks: tasksData.todo },
    {
      id: 'inprogress',
      title: 'In Progress',
      color: 'bg-info',
      tasks: tasksData.inprogress,
    },
    { id: 'failed', title: 'Failed', color: 'bg-warning', tasks: tasksData.failed },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-success',
      tasks: tasksData.completed,
    },
  ]

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-sm font-semibold">Project Tasks</h1>

        <Button
          onClick={() => setOpenAddTaskMenu(true)}
          className="bg-primary_blue text-white text-xs px-3 py-1 flex items-center gap-1"
        >
          <Plus size={14} />
          Add Task
        </Button>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-2">
        {columns.map((col) => (
          <div key={col.id} className="min-w-[280px] bg-gray-50 border rounded-xl p-3">
            <div className={`flex justify-between text-white px-2 py-2 rounded ${col.color}`}>
              <h2 className="text-sm font-semibold">
                {col.title} ({col.tasks.length})
              </h2>
            </div>

            <div className="mt-3 space-y-3 max-h-60 overflow-y-auto pr-1">
              {col.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() =>
                    router.push(
                      `/workspaces/${workspace_slug}/project/${project_slug}/tasks/${task.id}`
                    )
                  }
                  className="bg-white p-3 rounded-lg border cursor-pointer"
                >
                  <h3 className="text-sm font-medium">{task.title}</h3>

                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Calendar size={12} />
                    <span>
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : 'No date'}
                    </span>
                  </div>
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