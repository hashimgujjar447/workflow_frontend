'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Plus, ArrowRight } from 'lucide-react'
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
import toast from 'react-hot-toast'

type TaskStatus = 'todo' | 'in_progress' | 'failed' | 'completed'

interface ITask {
  id: number
  title: string
  description?: string
  status: TaskStatus
  due_date?: string
}

interface IGroupedTasks {
  todo: ITask[]
  inprogress: ITask[]
  failed: ITask[]
  completed: ITask[]
}

const ProjectTasks = () => {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const socket = useSocket()

  const workspace_slug = params?.slug as string
  const project_slug = params?.project_slug as string

  const [openAddTaskMenu, setOpenAddTaskMenu] = useState(false)
  const [assignedUser, setAssignedUser] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [dueDate, setDueDate] = useState('')

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
    }

    socket.addEventListener('message', handler)
    return () => socket.removeEventListener('message', handler)
  }, [socket, workspace_slug, project_slug, dispatch])

  const handleAddNewTask = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      if (!title.trim()) {
        toast.error('Title is required')
        return
      }

      if (!description.trim()) {
        toast.error('Description is required')
        return
      }

      if (!assignedUser) {
        toast.error('Please assign a user')
        return
      }

      if (!dueDate) {
        toast.error('Due date is required')
        return
      }

      if (dueDate < today) {
        toast.error('Due date cannot be in the past')
        return
      }

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
      setDueDate('')

      toast.success('New task added successfully')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to create task')
    }
  }

  if (isTasksLoading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] gap-3 text-center">
        <p className="text-red-500 text-sm font-medium">
          Failed to load tasks
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-black text-white rounded text-xs"
        >
          Retry
        </button>
      </div>
    )
  }

  const isEmpty =
    !tasksData.todo.length &&
    !tasksData.inprogress.length &&
    !tasksData.failed.length &&
    !tasksData.completed.length

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
      <div className="flex flex-row items-center justify-between gap-2 mb-4">
        <h1 className="text-sm font-semibold">Project Tasks</h1>

        <Button
          onClick={() => setOpenAddTaskMenu(true)}
          className="bg-primary_blue text-white text-xs md:text-sm px-2 sm:px-3 py-1 flex items-center gap-1"
        >
          <Plus size={14} />
          Add Task
        </Button>
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="flex flex-col items-center text-center gap-3 bg-cards border border-custom_border rounded-xl p-6 md:p-8 shadow-sm">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>

            <h2 className="text-sm font-semibold">No tasks available</h2>

            <p className="text-xs text-gray-500 max-w-xs">
              You haven’t created any tasks yet.
              Click the <span className="font-medium text-black">“Add Task”</span> button above.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 md:gap-5 md:overflow-x-auto pb-2">
          {columns.map((col) => (
            <div key={col.id} className="w-full md:min-w-[280px] bg-gray-50 border rounded-xl p-3">
              <div className={`flex justify-between text-white px-2 py-2 rounded ${col.color}`}>
                <h2 className="text-sm font-semibold">
                  {col.title} ({col.tasks.length})
                </h2>
              </div>

              <div className="mt-3 space-y-3 md:max-h-60 md:overflow-y-auto">
                {col.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() =>
                      router.push(
                        `/workspaces/${workspace_slug}/project/${project_slug}/tasks/${task.id}`
                      )
                    }
                    className="bg-white p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary_blue group"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium group-hover:text-primary_blue">
                        {task.title}
                      </h3>
                      <ArrowRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition"
                      />
                    </div>

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
      )}

      {openAddTaskMenu && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-4 md:p-6 rounded-xl w-[90%] max-w-md">
            <h2 className="text-sm font-semibold mb-3">Create Task</h2>

            <input
              placeholder="Title"
              className="border w-full p-2 rounded mb-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Description"
              className="border w-full p-2 rounded mb-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="date"
              className="border w-full p-2 rounded mb-2"
              value={dueDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <select
              className="border w-full p-2 rounded mb-4"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              <option value="">Assign user</option>
              {members?.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.member_detail.username}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <Button onClick={() => setOpenAddTaskMenu(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleAddNewTask}
                disabled={isCreating}
                className="bg-primary_blue text-white"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectTasks