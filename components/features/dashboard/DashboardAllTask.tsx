import { Button } from '@/components/ui/Button';
import React from 'react'

const DashboardAllTasks = ({tasks}:any) => {
    const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    todo: "bg-gray-200 text-gray-600",
  };

  return (
      <div>
           <h1 className="text-lg font-semibold">Recent Tasks</h1>
          {/* LEFT TASK LIST */}
          <div className="border p-4 rounded bg-cards border-custom_border">
            {tasks && tasks.map((task:any, index:any) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-custom_border last:border-none"
              >
                <div>
                  <h3 className="text-sm font-semibold mb-1">{task.title}</h3>

                  <p className="text-xs text-text-secondary">
                    {index + 1}: {task.project_name}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      statusColors[task.status]
                    }`}
                  >
                    {task.status}
                  </span>

                  <p className="text-xs text-text-secondary mt-1">
                    ✓ {task.total_inprogress} Progress
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-4">
              <Button  variant="outline">View All Tasks</Button>
            </div>
          </div>
          </div>

  )
}

export default DashboardAllTasks