"use client";
import TopBar from "@/components/layouts/TopBar";
import { Button } from "@/components/ui/Button";
import { Plus, Workflow } from "lucide-react";
import React, { useState } from "react";

export interface IWorkspace {
  title: string;
  description: string;
  created_by: string;
  life: number;
}

const Home = () => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([
    {
      title: "First Workspace",
      description: "This is the first workspace",
      created_by: "hashim",
      life: 2,
    },
    {
      title: "second workspace",
      description: "This is the first workspace",
      created_by: "hashim",
      life: 2,
    },
    {
      title: "Third Workspace",
      description: "This is the first workspace",
      created_by: "qasim",
      life: 2,
    },
  ]);

  const [tasks, setTasks] = useState([
    {
      title: "Design new landing page",
      project: "Nano banana",
      status: "pending",
      total_inprogress: 12,
    },
    {
      title: "Database optimization",
      project: "Project 123",
      status: "completed",
      total_inprogress: 6,
    },
    {
      title: "SEO keyword research",
      project: "Project Alpha",
      status: "pending",
      total_inprogress: 5,
    },
    {
      title: "Write API documentation",
      project: "Project Beta",
      status: "todo",
      total_inprogress: 2,
    },
  ]);

  const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    todo: "bg-gray-200 text-gray-600",
  };

  return (
    <div className="p-4 px-7">
      <TopBar />

      {/* WORKSPACES */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Your Workspaces</h1>

          <Button className="bg-cards text-black rounded border-custom_border border hover:text-white">
            <Plus size={16} /> Create Workspace
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          {workspaces.map((workspace, index) => (
            <div
              key={index}
              className="bg-cards border-custom_border border p-4 rounded"
            >
              <div className="flex items-start gap-x-3">
                <div className="bg-primary-light h-8 w-8 rounded flex items-center justify-center">
                  <Workflow size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-sm">{workspace.title}</h2>
                  <p className="text-xs text-text-secondary">
                    {workspace.created_by}
                  </p>
                </div>
              </div>

              <div className="flex mt-4">
                <p className="text-sm py-1 pr-3 border-r text-text-secondary border-custom_border">
                  2 projects
                </p>

                <p className="text-sm text-text-secondary px-3 py-1">
                  12 members
                </p>
              </div>

              <div className="border text-sm text-text-secondary border-custom_border p-2 flex items-center justify-between rounded mt-4">
                <span>2 days ago</span>

                <Button className="bg-primary_blue hover:bg-primary-hover text-white">
                  View Detail
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TASKS */}
      <div className="mt-8">
        <h1 className="text-lg font-semibold">Recent Tasks</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* LEFT TASK LIST */}
          <div className="border p-4 rounded bg-cards border-custom_border">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-custom_border last:border-none"
              >
                <div>
                  <h3 className="text-sm font-semibold mb-1">{task.title}</h3>

                  <p className="text-xs text-text-secondary">
                    {index + 1}: {task.project}
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
              <Button variant="outline">View All Tasks</Button>
            </div>
          </div>

          {/* RIGHT ACTIVITY PANEL */}
          <div className="border p-4 rounded bg-cards border-custom_border">
            {tasks.map((task, index) => (
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
      </div>
    </div>
  );
};

export default Home;