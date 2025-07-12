'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Home, Users, User, FileText, Settings } from 'lucide-react';

const menuItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Results', href: '/results', icon: FileText }, 
  { label: 'Team', href: '/team-panel', icon: Users },
  { label: 'Admin', href: '/admin', icon: Settings },     
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-black text-white py-4 rounded-t-3xl shadow-2xl border-t border-gray-800/30"
      >
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center text-xs font-medium transition-all duration-300 ease-in-out ${
              isActive(item.href) ? 'text-white' : 'text-white/70'
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive(item.href) ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <item.icon
                className={`h-6 w-6 transition-all duration-300 ${
                  isActive(item.href) ? 'text-white' : 'text-white/70'
                }`}
              />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`mt-1 text-[10px] transition-all duration-300 ${
                isActive(item.href) ? 'text-white font-semibold' : 'text-white/50'
              }`}
            >
              {item.label}
            </motion.span>
            {isActive(item.href) && (
              <motion.div
                layoutId="mobileActiveIndicator"
                className="absolute bottom-0 w-12 h-1 bg-white rounded-t"
              />
            )}
          </Link>
        ))}
      </motion.div>

      {/* Desktop Sidebar */}
      <div className="hidden sm:block h-screen w-64 z-40 bg-black text-white overflow-y-auto fixed top-0 left-0 lg:sticky lg:top-0 lg:shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-indigo-400 border-opacity-30">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 19l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <h1 className="ml-3 text-xl font-bold">Nooril Noor</h1>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-white bg-opacity-20 text-white font-semibold shadow-inner'
                      : 'text-indigo-100 hover:bg-white/10 hover:text-white'
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
        </nav>

        {/* User Profile */}
      </div>
    </>
  );
}