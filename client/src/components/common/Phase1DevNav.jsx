import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Phase 1 Design System Navigator.
 * Floating review tool to easily jump between all 16 required routes and design components.
 */
export default function Phase1DevNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const sections = [
    {
      title: 'Public Pages',
      routes: [
        { label: 'Home', path: '/' },
        { label: 'Explore', path: '/explore' },
        { label: 'Category: Tech', path: '/categories/technology' },
        { label: 'Blog Detail', path: '/blog/the-future-of-web-development' },
        { label: 'Sign In', path: '/login' },
        { label: 'Sign Up', path: '/signup' },
        { label: 'Forgot Password', path: '/forgot-password' },
      ],
    },
    {
      title: 'Author Workspace',
      routes: [
        { label: 'Overview', path: '/dashboard' },
        { label: 'My Posts', path: '/dashboard/posts' },
        { label: 'New Post Editor', path: '/dashboard/editor' },
        { label: 'Edit Post (ID: 1)', path: '/dashboard/editor/post-1' },
        { label: 'Bookmarks', path: '/dashboard/bookmarks' },
        { label: 'Author Settings', path: '/dashboard/settings' },
      ],
    },
    {
      title: 'Admin Console',
      routes: [
        { label: 'Admin Overview', path: '/admin' },
        { label: 'Users Moderation', path: '/admin/users' },
        { label: 'Posts Moderation', path: '/admin/posts' },
        { label: 'Comments Moderation', path: '/admin/comments' },
      ],
    },
    {
      title: 'Fallback',
      routes: [{ label: '404 Page', path: '/non-existent-route' }],
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      <div className="bg-[#121212] text-white rounded-xl shadow-xl border border-white/10 overflow-hidden text-xs max-w-sm">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-3.5 py-2 hover:bg-white/10 transition-colors cursor-pointer gap-3"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2 font-medium">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Phase 1 Quick Navigator</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded font-mono">
              {location.pathname}
            </span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </button>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-3 bg-[#1C1C1E] border-t border-white/10 max-h-80 overflow-y-auto space-y-3">
            {sections.map((section, idx) => (
              <div key={idx}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  {section.title}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {section.routes.map((r) => {
                    const active = location.pathname === r.path;
                    return (
                      <Link
                        key={r.path}
                        to={r.path}
                        onClick={() => setIsOpen(false)}
                        className={`px-2 py-1 rounded text-[11px] truncate transition-colors ${
                          active
                            ? 'bg-white text-[#121212] font-semibold'
                            : 'text-zinc-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {r.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
