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
 

  // Prevent hydration mismatch
  if (workspacesLoading || tasksLoading) {
    return (  <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500">Loading your dashboard...</p>
    </div>)
  }

  return (
    <div className="p-4 px-3 sm:px-7">
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

     
<div className="mt-8">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
    
    {/* ALL TASKS */}
    {tasksData?.recent_tasks?.length ? (
      <DashboardAllTasks tasks={tasksData.recent_tasks} />
    ) : (
      <div className="p-4 border rounded-lg text-center text-gray-500">
        No tasks available
      </div>
    )}

    {/* MY TASKS */}
    {tasksData?.my_tasks?.length ? (
      <DashboardYourAssign tasks={tasksData.my_tasks} />
    ) : (
      <div className="p-4 border rounded-lg text-center text-gray-500">
        No assigned tasks
      </div>
    )}

  </div>
</div>
    </div>
  );
};

export default Home;