'use client'

import React from 'react'
import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const columns = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-todo',
    tasks: [
      { id: 1, title: 'Plan site structure', date: 'June 25' },
      { id: 2, title: 'Develop style guide', date: 'July 3' },
       { id: 3, title: 'Develop style guide', date: 'July 3' },
        { id: 4, title: 'Develop style guide', date: 'July 3' },
    ],
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    color: 'bg-info',
    tasks: [
      { id: 3, title: 'Design homepage', date: 'June 27' },
    ],
  },
  {
    id: 'failed',
    title: 'Failed',
    color: 'bg-warning',
    tasks: [
      { id: 4, title: 'API Integration', date: 'June 20' },
    ],
  },
  {
    id: 'completed',
    title: 'Completed',
    color: 'bg-success',
    tasks: [
      { id: 5, title: 'Setup project repo', date: 'June 10' },
    ],
  },
]

const ProjectTasks = () => {
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
                  className="bg-white p-3 rounded-lg border hover:shadow-md transition cursor-pointer"
                >
                  <h3 className="text-sm font-medium">{task.title}</h3>

                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Calendar size={12} />
                    <span>{task.date}</span>
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