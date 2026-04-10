"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetAllUserTasksQuery } from "@/store/services/workspaceApi";
import { Calendar, User, Folder, Building } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "todo":
      return "bg-gray-100 text-gray-600";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "failed":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const TaskCard = ({ task }: any) => {
  const router = useRouter();

  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date();

  return (
    <div
      onClick={() =>
        router.push(
          `/workspaces/${task.workspace_slug}/project/${task.project_slug}/tasks/${task.id}`
        )
      }
      className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          {task.title}
        </h3>

        <span
          className={`px-2 py-1 text-[10px] rounded-full font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
        {task.description || "No description"}
      </p>

      <div className="mt-3 space-y-1 text-[11px] text-gray-500">
        <div className="flex items-center gap-1">
          <Folder size={12} />
          {task.project_name || "No project"}
        </div>

        <div className="flex items-center gap-1">
          <Building size={12} />
          {task.workspace_name || "No workspace"}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <User size={12} />
          {task.assigned_to?.name || "Unassigned"}
        </div>

        <div
          className={`flex items-center gap-1 ${
            isOverdue ? "text-red-500 font-medium" : ""
          }`}
        >
          <Calendar size={12} />
          {task.due_date
            ? new Date(task.due_date).toLocaleDateString()
            : "No date"}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const { data, isLoading, error, refetch } =
    useGetAllUserTasksQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <p className="text-red-500 text-sm">Failed to load tasks</p>
        <button
          onClick={() => refetch()}
          className="px-3 py-2 bg-black text-white rounded text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-gray-50 min-h-screen">

      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Tasks
        </h1>
        <p className="text-sm text-gray-500">
          Manage and track your work
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-semibold">
            {data?.count || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border text-center">
          <p className="text-xs text-gray-500">My Tasks</p>
          <p className="text-lg font-semibold">
            {data?.my_tasks?.length || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border text-center">
          <p className="text-xs text-gray-500">Recent</p>
          <p className="text-lg font-semibold">
            {data?.recent_tasks?.length || 0}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3 text-gray-700">
          My Tasks
        </h2>

        {data?.my_tasks?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.my_tasks.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm py-10">
            No tasks found
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3 text-gray-700">
          Recent Tasks
        </h2>

        {data?.recent_tasks?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.recent_tasks.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm py-10">
            No recent tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;