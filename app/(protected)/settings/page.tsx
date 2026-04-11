"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/slices/authSlice/authSlice";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Briefcase,
  Folder,
  Users,
  LogOut,
} from "lucide-react";

import { useGetUserStatsQuery } from "@/store/services/workspaceApi";
import { useLogoutMutation } from "@/store/services/authApi";

const Page = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const { data, isLoading } = useGetUserStatsQuery(undefined);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi(undefined).unwrap();
    } catch (_) {}
    dispatch(logout());
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage your profile and workspace activity
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Profile Information
        </h2>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>
              {user?.first_name} {user?.last_name}
            </span>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
          <Briefcase className="text-blue-500" size={20} />
          <div>
            <p className="text-xs text-gray-500">Workspaces Joined</p>
            <p className="text-lg font-semibold">
              {data?.workspaces_count || 0}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
          <Folder className="text-green-500" size={20} />
          <div>
            <p className="text-xs text-gray-500">Projects</p>
            <p className="text-lg font-semibold">
              {data?.projects_count || 0}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
          <Users className="text-purple-500" size={20} />
          <div>
            <p className="text-xs text-gray-500">Memberships</p>
            <p className="text-lg font-semibold">
              {data?.project_memberships || 0}
            </p>
          </div>
        </div>
      </div>

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