"use client";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Overlay (ADD THIS PART) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-black z-50 transform transition-transform duration-300 md:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar setOpen={setOpen} />
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto  ">
        {/* Mobile Topbar */}
        <div className="md:hidden p-4 flex items-center justify-between border-b">
          <button onClick={() => setOpen(true)}>
            <Menu />
          </button>

          <h1 className="font-semibold">WorkflowHub</h1>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Layout;