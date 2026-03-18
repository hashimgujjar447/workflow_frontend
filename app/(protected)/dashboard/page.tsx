"use client";
import TopBar from "@/components/layouts/TopBar";
import { Button } from "@/components/ui/Button";
import DashboardWorkspaceCard from "@/components/ui/DashboardWorkspaceCard";
import { Plus, Workflow } from "lucide-react";
import React, { useState } from "react";
import DashboardAllTasks from "@/components/features/dashboard/DashboardAllTask";
import DashboardYourAssign from "@/components/features/dashboard/DashboardYourAssign";

import { IWorkspace } from "@/lib/types";

const Home = () => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([
    {
      id: 1,
      title: "First Workspace",
      description: "This is the first workspace",
      created_by: "hashim",
      life: 2,
    },
    {
      id: 2,
      title: "second workspace",
      description: "This is the first workspace",
      created_by: "hashim",
      life: 2,
    },
    {
      id: 3,
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

  
  return (
    <div className="p-4 px-7">
      <TopBar />

      {/* WORKSPACES */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Your Workspaces</h1>

        
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          {workspaces.map((workspace, index) => (
            <DashboardWorkspaceCard key={index} workspace={workspace} />
           
          ))}
        </div>
      </div>

      {/* TASKS */}
      <div className="mt-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <DashboardAllTasks tasks={tasks} />
          <DashboardYourAssign tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Home;