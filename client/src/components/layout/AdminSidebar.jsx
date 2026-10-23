import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  FileText,
  MessageSquare,
  ExternalLink,
  LogOut,
  LayoutDashboard,
  X,
} from 'lucide-react';

export default function AdminSidebar({ onClose }) {
  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Posts Moderation', path: '/admin/posts', icon: FileText },
    { name: 'Comments Moderation', path: '/admin/comments', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 h-full bg-[#FFFFFF] border-r border-[#ECECE8] flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="h-16 px-6 border-b border-[#ECECE8] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif font-bold text-xl text-[#121212]">InkSpace</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded">
              Admin
            </span>
          </Link>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1 text-[#71717A] hover:text-[#121212]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#121212] text-white shadow-2xs'
                      : 'text-[#4A4A4A] hover:text-[#121212] hover:bg-[#F8F8F6]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-[#ECECE8] space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-[#737373] hover:text-[#121212] hover:bg-[#F8F8F6] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Public Site</span>
        </Link>

        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-[#737373] hover:text-[#121212] hover:bg-[#F8F8F6] transition-colors"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Author Dashboard</span>
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
