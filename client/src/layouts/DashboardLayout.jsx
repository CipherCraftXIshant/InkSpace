import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, Plus, Search } from 'lucide-react';
import DashboardSidebar from '../components/layout/DashboardSidebar.jsx';
import Button from '../components/common/Button.jsx';
import IconButton from '../components/common/IconButton.jsx';
import { getMockAuthUser } from '../utils/storage.js';

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const currentUser = getMockAuthUser() || {
    name: 'Alex Morgan',
    email: 'alex@inkspace.dev',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/posts?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8] text-[#121212]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full">
            <DashboardSidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#ECECE8] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 text-[#4A4A4A] hover:text-[#121212] rounded-md hover:bg-black/5"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#737373]">
              <Link to="/dashboard" className="hover:text-[#121212]">
                Author Portal
              </Link>
              <span>/</span>
              <span className="text-[#121212] font-medium">Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your posts..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-md focus:bg-white focus:border-[#121212] focus:ring-1 focus:ring-[#121212] outline-hidden transition-all"
              />
            </form>

            <IconButton
              icon={Bell}
              label="Notifications"
              variant="ghost"
              size="sm"
            />

            <Button
              to="/dashboard/editor"
              variant="primary"
              size="sm"
              icon={Plus}
              className="hidden sm:inline-flex"
            >
              New Post
            </Button>

            <Link
              to="/dashboard/settings"
              className="shrink-0 group"
              title={`${currentUser.name} — Settings`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB] group-hover:border-[#121212] transition-colors"
              />
            </Link>
          </div>
        </header>

        {/* Dashboard Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
