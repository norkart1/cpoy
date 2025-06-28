
"use client";

import { useState } from "react";
import { Menu, X, Home, Users, Activity, FileText, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";


const menuItems = [
  { label: "Dashboard", href: "/team-panel", icon: Home },
  { label: "Team Members", href: "/team-panel/manage-contestants", icon: Users },
];

export default function UserSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-indigo-600 text-white p-2 rounded-full shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 z-40 h-screen bg-gradient-to-b from-indigo-600 to-purple-700 text-white transition-transform duration-300 ease-in-out transform overflow-y-auto
    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} lg:relative lg:shadow-lg`}
      >


        {/* Close button (mobile only) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white p-1"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-indigo-400 border-opacity-30">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 19l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <h1 className="ml-3 text-xl font-bold">Mehrajan2k25</h1>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.href)
                    ? "bg-white bg-opacity-20 text-white font-semibold shadow-inner"
                    : "text-indigo-100 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <span className="inline-flex items-center justify-center text-lg w-8 h-8 rounded-md bg-white/10 text-white group-hover:bg-white/20">
                    <item.icon size={20} />
                  </span>
                  <span className="text-[16px] tracking-wide">{item.label}</span>
                  {isActive(item.href) && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
                  )}
                </Link>
              </li>

            ))}
          </ul>
          <li>
            <button
              onClick={() => signOut({ callbackUrl: "/team-login" })}
              className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-indigo-100 hover:bg-white/10 hover:text-white"
            >
              <span className="inline-flex items-center justify-center text-lg w-8 h-8 rounded-md bg-white/10 text-white group-hover:bg-white/20">
                <User size={20} />
              </span>
              <span className="text-[16px] tracking-wide">Logout</span>
            </button>
          </li>

        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center bg-indigo-800 bg-opacity-40 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-800 font-bold">
              U
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Team Leader</p>
              <p className="text-xs text-indigo-200">User Panel</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
