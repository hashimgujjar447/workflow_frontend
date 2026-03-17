import { Button } from '@/components/ui/Button'
import React from 'react'

const DashboardYourAssign = ({tasks}:any) => {
    const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    todo: "bg-gray-200 text-gray-600",
  };

  return (
  <div>
 <h1 className="text-lg font-semibold">Your Tasks</h1>
          {/* RIGHT ACTIVITY PANEL */}
          <div className="border p-4 rounded bg-cards border-custom_border">
            {tasks.map((task:any, index:any) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-custom_border last:border-none"
              >
                <div>
                  <h3 className="text-sm mb-1 font-semibold">{task.title}</h3>

                  <p className="text-xs text-text-secondary">1 hour ago</p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    statusColors[task.status]
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))}

            <div className="flex justify-center mt-4">
              <Button variant="outline">View All Tasks</Button>
            </div>
          </div>
          </div>
  )
}

export default DashboardYourAssign