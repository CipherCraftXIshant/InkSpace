import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PenTool,
  Bookmark,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';

export default function DashboardSidebar({ onClose }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
    { name: 'My Posts', path: '/dashboard/posts', icon: FileText },
    { name: 'New Post', path: '/dashboard/editor', icon: PenTool },
    { name: 'Bookmarks', path: '/dashboard/bookmarks', icon: Bookmark },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-[#FFFFFF] border-r border-[#ECECE8] flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="h-16 px-6 border-b border-[#ECECE8] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif font-bold text-xl text-[#121212]">InkSpace</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider bg-[#F4F4F5] text-[#525252] px-2 py-0.5 rounded">
              Author
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
          to="/login"
          className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Link>

        {/* User Card */}
        <div className="pt-2 flex items-center gap-3 px-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Alex Morgan"
            className="w-8 h-8 rounded-full object-cover border border-[#ECECE8]"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#121212] truncate">Alex Morgan</p>
            <p className="text-[11px] text-[#8A8A8A] truncate">alex@inkspace.dev</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
