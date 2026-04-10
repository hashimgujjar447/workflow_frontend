"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  User,
  Mail,
  Briefcase,
  Folder,
  Users,
} from "lucide-react";

import { useGetUserStatsQuery } from "@/store/services/workspaceApi";

const Page = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading } = useGetUserStatsQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div>
        <h1 className=" text-lg sm:text-xl font-semibold text-gray-800">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Manage your profile and workspace activity
        </p>
      </div>

      {/* USER CARD */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Profile Information
        </h2>

        <div className="space-y-3 text-sm text-gray-600">

          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{user?.first_name} {user?.last_name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>{user?.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>@{user?.username}</span>
          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition">
          <Briefcase className="text-blue-500" size={20} />
          <div>
            <p className="text-xs text-gray-500">Workspaces Joined</p>
            <p className="text-lg font-semibold">
              {data?.workspaces_count || 0}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition">
          <Folder className="text-green-500" size={20} />
          <div>
            <p className="text-xs text-gray-500">Projects</p>
            <p className="text-lg font-semibold">
              {data?.projects_count || 0}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition">
          <Users className="text-purple-500" size={20} />
          <div>
            <p className="text-xs text-gray-500">Memberships</p>
            <p className="text-lg font-semibold">
              {data?.project_memberships || 0}
            </p>
          </div>
        </div>

      </div>

      {/* EXTRA SECTION */}
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Account Settings
        </h2>

        <div className="space-y-2 text-sm text-gray-600">
          <p>Update profile details</p>
          <p>Manage your workspaces</p>
          <p>View your project roles</p>
        </div>
      </div>

    </div>
  );
};

export default Page;