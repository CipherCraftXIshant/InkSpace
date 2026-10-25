import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminSidebar({ onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Posts Moderation', path: '/admin/posts', icon: FileText },
    { name: 'Comments Moderation', path: '/admin/comments', icon: MessageSquare },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-full bg-[#FFFFFF] dark:bg-[#18181B] border-r border-[#ECECE8] dark:border-[#27272A] flex flex-col justify-between select-none transition-colors">
      <div>
        {/* Header */}
        <div className="h-16 px-6 border-b border-[#ECECE8] dark:border-[#27272A] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif font-bold text-xl text-[#121212] dark:text-white">InkSpace</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded">
              Admin
            </span>
          </Link>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white rounded-md"
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
                      ? 'bg-[#121212] dark:bg-white text-white dark:text-[#121212] shadow-2xs'
                      : 'text-[#4A4A4A] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white hover:bg-[#F8F8F6] dark:hover:bg-[#27272A]'
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
      <div className="p-4 border-t border-[#ECECE8] dark:border-[#27272A] space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white hover:bg-[#F8F8F6] dark:hover:bg-[#27272A] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Public Site</span>
        </Link>

        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-[#737373] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white hover:bg-[#F8F8F6] dark:hover:bg-[#27272A] transition-colors"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Author Dashboard</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
