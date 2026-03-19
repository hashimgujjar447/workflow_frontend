"use client";

import React from "react";
import TopBar from "@/components/layouts/TopBar";
import DashboardWorkspaceCard from "@/components/ui/DashboardWorkspaceCard";
import DashboardAllTasks from "@/components/features/dashboard/DashboardAllTask";
import DashboardYourAssign from "@/components/features/dashboard/DashboardYourAssign";

import { IWorkspace } from "@/lib/types";
import {
  useGetAllTasksQuery,
  useGetWorkspacesQuery,
} from "@/store/services/workspaceApi";

const Home = () => {
  const {
    data: workspacesData,
    isLoading: workspacesLoading,
  } = useGetWorkspacesQuery(undefined);

  const {
    data: tasksData,
    isLoading: tasksLoading,
  } = useGetAllTasksQuery(undefined);
  console.log(tasksData)

  // Prevent hydration mismatch
  if (workspacesLoading || tasksLoading) {
    return <div className="p-4 px-7">Loading...</div>;
  }

  return (
    <div className="p-4 px-7">
      <TopBar />

      {/* WORKSPACES */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Your Workspaces</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          {workspacesData?.map((workspace: IWorkspace, index: number) => (
            <DashboardWorkspaceCard key={index} workspace={workspace} />
          ))}
        </div>
      </div>

      {/* TASKS */}
      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <DashboardAllTasks tasks={tasksData?.recent_tasks || []} />
          <DashboardYourAssign tasks={tasksData?.my_tasks || []} />
        </div>
      </div>
    </div>
  );
};

export default Home;