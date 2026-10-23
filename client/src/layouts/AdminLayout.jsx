import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, ShieldAlert, ArrowLeft } from 'lucide-react';
import AdminSidebar from '../components/layout/AdminSidebar.jsx';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#FAFAF8] text-[#121212]">
      {/* Desktop Admin Sidebar */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full">
            <AdminSidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#ECECE8] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 text-[#4A4A4A] hover:text-[#121212] rounded-md hover:bg-black/5"
              aria-label="Open admin sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-red-600 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Console
              </span>
              <span className="text-[#A3A3A3]">/</span>
              <span className="text-[#525252]">System Management</span>
            </div>
          </div>

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#525252] hover:text-[#121212] font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
