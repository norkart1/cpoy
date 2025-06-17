// "use client";

// import React from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { FaHome, FaUser, FaCog } from "react-icons/fa";
// import { PowerIcon } from "@heroicons/react/24/outline";
// import { motion } from "framer-motion";
// import { signOut } from "next-auth/react";
// import { useSession } from "next-auth/react";

// const navigation = [
//   { name: "Home", href: "/", icon: FaHome },
//   { name: "Dashboard", href: "/team-panel", icon: FaUser },
//   { name: "Manage Contestant", href: "/team-panel/manage-contestants", icon: FaCog },
// ];

// const UserSidebar = () => {
//   const { data: session, status } = useSession();
//   const pathname = usePathname();
//   const router = useRouter();

//   const isActive = (href) => pathname === href;

//   const handleLogout = () => {
//     signOut({ callbackUrl: "/team-login" });
//   };

//   // Render loading state while session is being fetched
//   if (status === "loading") {
//     return (
//       <div className="sticky top-0 z-50 hidden lg:flex lg:w-64 flex-col h-screen bg-gradient-to-b from-white to-gray-50 border-r border-gray-100 p-6 shadow-lg">
//         <div className="flex items-center gap-3 mb-8">
//           <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
//           <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
//         </div>
//         <nav className="flex-1 space-y-2">
//           {navigation.map((item) => (
//             <div
//               key={item.name}
//               className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-200 animate-pulse h-12"
//             ></div>
//           ))}
//         </nav>
//         <div className="pt-4 border-t border-gray-200 mt-auto">
//           <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-200 animate-pulse h-12"></div>
//         </div>
//       </div>
//     );
//   }

//   // Redirect unauthenticated users
//   if (status === "unauthenticated") {
//     router.push("/team-login");
//     return null;
//   }

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <motion.aside
//         initial={{ x: -20, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="sticky top-0 z-50 hidden lg:flex lg:w-64 flex-col h-screen bg-gradient-to-b from-white to-gray-50 border-r border-gray-100 p-6 shadow-lg"
//       >
//         {/* Header */}
//         <motion.div
//           initial={{ y: -10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="flex items-center gap-3 mb-8"
//         >
//           <motion.div
//             initial={{ scale: 1 }}
//             animate={{ scale: [1, 1.1, 1] }}
//             transition={{ duration: 0.5, delay: 0.4, repeat: 1 }}
//             className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
//           >
//             <svg
//               className="w-6 h-6 text-green-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//               />
//             </svg>
//           </motion.div>
//           <h2 className="text-xl font-bold text-gray-900">
//             {session?.user?.teamName || "Team"}
//           </h2>
//         </motion.div>

//         {/* Navigation */}
//         <nav className="flex-1 space-y-2">
//           {navigation.map((item) => (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
//                 isActive(item.href)
//                   ? "bg-green-100 text-green-600 shadow-sm"
//                   : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//               }`}
//             >
//               <motion.div
//                 whileHover={{ scale: 1.2, rotate: 5 }}
//                 className={`w-8 h-8 flex items-center justify-center rounded-full ${
//                   isActive(item.href) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 <item.icon className="h-5 w-5" />
//               </motion.div>
//               {item.name}
//               {isActive(item.href) && (
//                 <motion.div
//                   layoutId="activeIndicator"
//                   className="absolute left-0 w-1 h-6 bg-green-500 rounded-r"
//                 />
//               )}
//             </Link>
//           ))}
//         </nav>

//         {/* Logout */}
//         <motion.div
//           initial={{ y: 10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.6 }}
//           className="pt-4 border-t border-gray-200 mt-auto"
//         >
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-100 hover:text-red-600 rounded-xl w-full transition-all duration-300"
//           >
//             <motion.div
//               whileHover={{ scale: 1.2, rotate: -5 }}
//               className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100"
//             >
//               <PowerIcon className="h-5 w-5" />
//             </motion.div>
//             Logout
//           </button>
//         </motion.div>
//       </motion.aside>

//       {/* Mobile Bottom Navigation */}
//       <motion.div
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6 }}
//         className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-t-3xl shadow-2xl lg:hidden backdrop-blur-md border-t border-green-500/30"
//       >
//         {navigation.map((item) => (
//           <Link
//             key={item.name}
//             href={item.href}
//             className={`flex flex-col items-center text-xs font-medium transition-all duration-300 ease-in-out ${
//               isActive(item.href) ? "text-white" : "text-white/70"
//             }`}
//           >
//             <motion.div
//               whileHover={{ scale: 1.2 }}
//               whileTap={{ scale: 0.9 }}
//               className={`p-3 rounded-xl transition-all duration-300 ease-in-out ${
//                 isActive(item.href) ? "bg-white/20" : "hover:bg-white/10"
//               }`}
//             >
//               <item.icon
//                 className={`h-6 w-6 transition-all duration-300 ${
//                   isActive(item.href) ? "text-white" : "text-white/70"
//                 }`}
//               />
//             </motion.div>
//             <motion.span
//               initial={{ opacity: 0, y: 5 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: 0.2 }}
//               className={`mt-1 text-[10px] transition-all duration-300 ${
//                 isActive(item.href) ? "text-white font-semibold" : "text-white/50"
//               }`}
//             >
//               {item.name}
//             </motion.span>
//             {isActive(item.href) && (
//               <motion.div
//                 layoutId="mobileActiveIndicator"
//                 className="absolute bottom-0 w-12 h-1 bg-white rounded-t"
//               />
//             )}
//           </Link>
//         ))}
//         <motion.button
//           whileHover={{ scale: 1.2 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleLogout}
//           className="flex flex-col items-center text-xs text-red-300 hover:text-red-200 transition-all duration-300 ease-in-out"
//         >
//           <motion.div
//             whileHover={{ rotate: 10 }}
//             className="p-3 rounded-xl hover:bg-red-500/20 transition-all duration-300"
//           >
//             <PowerIcon className="h-6 w-6" />
//           </motion.div>
//           <span className="mt-1 text-[10px] text-red-300">Logout</span>
//         </motion.button>
//       </motion.div>
//     </>
//   );
// };

// export default UserSidebar;

"use client";

import { useState } from "react";
import { Menu, X, Home, Users, Activity, FileText, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";


const menuItems = [
  { label: "Dashboard", href: "/team-panel", icon: Home },
  { label: "Team Members", href: "/team-panel/manage-contestants", icon: Users },
  // { label: "Submit Programs", href: "/team-panel/add-item", icon: Activity },
  // { label: "Program Status", href: "/team-panel/programs", icon: FileText },
  // { label: "Results", href: "/team-panel/results", icon: FileText },
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
        className={`fixed top-0 left-0 w-64 z-40 bg-gradient-to-b from-indigo-600 to-purple-700 text-white transition-transform duration-300 ease-in-out transform overflow-y-auto
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
