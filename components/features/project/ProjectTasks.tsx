'use client'

import React, { useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useGetProjectMembersQuery, useGetProjectTasksQuery, useAddNewTaskMutation } from '@/store/services/workspaceApi'
import { useParams, useRouter } from 'next/navigation'

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

const ProjectTasks = () => {
  const params = useParams()
  const router = useRouter()

  const [openAddTaskMenu, setOpenAddTaskMenu] = useState(false)
  const [assignedUser, setAssignedUser] = useState<any>("")
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [status, setStatus] = useState('todo')
const [dueDate, setDueDate] = useState('')

  const workspace_slug = params?.slug as string
  const project_slug = params?.project_slug as string

  const [addNewTask, { isLoading: isCreating }] = useAddNewTaskMutation()

  const { data, isLoading: isTasksLoading, error } = useGetProjectTasksQuery(
    { workspace_slug, project_slug },
    { skip: !workspace_slug || !project_slug }
  )

  const { data: members } = useGetProjectMembersQuery(
    { workspace_slug, project_slug },
    { skip: !workspace_slug || !project_slug }
  )

  console.log(members)

  const tasksData: IGroupedTasks = data ?? {
    todo: [],
    inprogress: [],
    failed: [],
    completed: [],
  }

  const handleAddNewTask = async () => {
    try {
      await addNewTask({
  workspace_slug,
  project_slug,
  title,
  description,
  assigned_to: Number(assignedUser),
  status,
  due_date: dueDate
}).unwrap()

      setOpenAddTaskMenu(false)
      setTitle('')
      setDescription('')
      setAssignedUser('')
    } catch (err) {
      console.log(err)
    }
  }

  if (isTasksLoading) {
    return <div className="mt-5 text-sm">Loading tasks...</div>
  }

  if (error) {
    return <div className="mt-5 text-red-500 text-sm">Failed to load tasks</div>
  }

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-todo', tasks: tasksData.todo },
    { id: 'inprogress', title: 'In Progress', color: 'bg-info', tasks: tasksData.inprogress },
    { id: 'failed', title: 'Failed', color: 'bg-warning', tasks: tasksData.failed },
    { id: 'completed', title: 'Completed', color: 'bg-success', tasks: tasksData.completed },
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
          <div
            key={col.id}
            className="min-w-[280px] bg-gray-50 border rounded-xl p-3 hover:bg-gray-100 transition"
          >
            <div className={`flex justify-between text-white items-center px-2 py-2 rounded ${col.color}`}>
              <h2 className="text-sm font-semibold">
                {col.title} ({col.tasks.length})
              </h2>
              <span className="text-xs">•••</span>
            </div>

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
                  <h3 className="text-sm font-medium">{task.title}</h3>

                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Calendar size={12} />
                    <span>
                      {task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : 'No date'}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition">
                    View details →
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

     {openAddTaskMenu && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 space-y-6">

      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Add New Task
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
          className="w-full border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-3">

          <select
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
            className="border rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Assign user</option>
            {members?.map((member: any, index: number) => (
              <option key={index} value={member.id}>
                {member.member_detail.first_name} {member.member_detail.last_name}
              </option>
            ))}
          </select>

         <select
  value={status}
  onChange={(e) => setStatus(e.target.value as any)}
  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="todo">To Do</option>
  <option value="in_progress">In Progress</option>
  <option value="failed">Failed</option>
  <option value="completed">Completed</option>
</select>

        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <div className="flex justify-end gap-3 pt-2">

        <button
          onClick={() => setOpenAddTaskMenu(false)}
          className="px-5 py-2.5 rounded-xl border text-sm hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          disabled={isCreating}
          onClick={handleAddNewTask}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Create Task'}
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  )
}

export default ProjectTasks