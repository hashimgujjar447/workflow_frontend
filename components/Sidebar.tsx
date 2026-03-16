"use client";
import {
  BriefcaseBusiness,
  ClipboardList,
  Ellipsis,
  EllipsisIcon,
  House,
  Mail,
  Settings,
  X
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/Button";


interface ISideBar {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ setOpen }: ISideBar) => {
  const pathName = usePathname();

  const sideBarItems = [
    {
      id: 1,
      logo: <House className="w-5 h-5" />,
      text: "Dashboard",
      href: "/",
    },
    {
      id: 2,
      logo: <BriefcaseBusiness className="w-5 h-5" />,
      text: "Workspaces",
      href: "/workspaces",
    },
    {
      id: 3,
      logo: <ClipboardList className="w-5 h-5" />,
      text: "My Tasks",
      href: "/tasks",
    },
    {
      id: 4,
      logo: <Mail className="w-5 h-5" />,
      text: "Invites",
      href: "/invites",
    },
    {
      id: 5,
      logo: <Settings className="w-5 h-5" />,
      text: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="w-24 p-4 bg-black h-screen flex flex-col justify-between items-center">
      {/* Logo + Nav */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 bg-primary_blue rounded-xl flex items-center justify-center shadow-md">
          <span className="text-sidebar-text font-bold text-lg ">W</span>
        </div>

        <ul className="text-sidebar-text text-xs flex flex-col gap-y-5 mt-10">
          {sideBarItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathName === "/"
                : pathName.startsWith(item.href);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setOpen?.(false)}
                  className="flex flex-col items-center gap-y-1.5"
                >
                  <div
                    className={`${
                      isActive
                        ? "bg-[#35425a] py-1 rounded px-4"
                        : "px-4 py-1 hover:bg-[#1f2937] rounded transition"
                    }`}
                  >
                    <div
                      className={`${
                        isActive ? "bg-primary_blue p-1 rounded" : "p-1"
                      } transition-colors`}
                    >
                      {item.logo}
                    </div>
                  </div>

                  <p>{item.text}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-sidebar-text hidden sm:block cursor-pointer hover:text-white transition">
          <EllipsisIcon />
        </div>

        {/* Mobile Close */}
        <Button
         onClick={(e) => {
            e.stopPropagation()
            setOpen?.(false)
          }}
          className="text-sidebar-text md:hidden cursor-pointer hover:text-white transition"
         
        >
          <X />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;