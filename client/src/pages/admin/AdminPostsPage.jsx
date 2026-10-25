import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Star,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import {
  getAdminPosts,
  toggleFeaturePost,
  deleteAdminPost,
} from '../../utils/storage.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function AdminPostsPage() {
  useDocumentTitle('Story Curation — Admin');
  const [posts, setPosts] = useState(() => getAdminPosts());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'featured' | 'Published' | 'Draft' | 'Scheduled'
  const [toastMessage, setToastMessage] = useState('');
  const [postToDelete, setPostToDelete] = useState(null);

  // Filtered stories
  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return posts.filter((post) => {
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.author && post.author.toLowerCase().includes(q)) ||
        (post.category && post.category.toLowerCase().includes(q));

      let matchesStatus = true;
      if (statusFilter === 'featured') {
        matchesStatus = Boolean(post.isFeatured);
      } else if (statusFilter !== 'all') {
        matchesStatus = post.status === statusFilter;
      }

      return matchesSearch && matchesStatus;
    });
  }, [posts, searchQuery, statusFilter]);

  // Toggle Featured status
  const handleToggleFeature = (post) => {
    const updated = toggleFeaturePost(post.id);
    setPosts(updated);
    setToastMessage(
      !post.isFeatured
        ? `"${post.title}" is now featured on the homepage.`
        : `"${post.title}" was unfeatured.`
    );
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Confirm delete story
  const confirmDelete = () => {
    if (!postToDelete) return;
    const updated = deleteAdminPost(postToDelete.id);
    setPosts(updated);
    setToastMessage(`Story "${postToDelete.title}" removed from catalog.`);
    setPostToDelete(null);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-20 right-6 z-50 bg-[#121212] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-white/10 flex items-center gap-2 animate-in fade-in"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ECECE8] dark:border-[#27272A]">
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] dark:text-[#A1A1AA] mb-1">
            CONTENT OVERSIGHT
          </p>
          <h1 className="font-serif text-3xl font-medium text-[#121212] dark:text-[#F4F4F6] tracking-tight">
            Article Management & Curation
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A1A1AA] mt-1">
            Curate homepage features, inspect author publications, and moderate content standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/editor"
            className="px-3.5 py-2 text-xs font-semibold bg-[#121212] dark:bg-white text-white dark:text-[#121212] rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-2xs"
          >
            Create Platform Story
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-[#18181B] p-4 rounded-xl border border-[#ECECE8] dark:border-[#27272A] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#71717A]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by story title, author, or topic..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF9F5] dark:bg-[#202024] border border-[#E5E7EB] dark:border-[#27272A] rounded-lg outline-hidden focus:bg-white dark:focus:bg-[#18181B] focus:border-[#121212] dark:focus:border-white/40 text-[#121212] dark:text-[#F4F4F6] transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Stories' },
              { id: 'featured', label: '★ Featured Only' },
              { id: 'Published', label: 'Published' },
              { id: 'Draft', label: 'Drafts' },
              { id: 'Scheduled', label: 'Scheduled' },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#121212] dark:bg-white text-white dark:text-[#121212] shadow-2xs'
                      : 'text-[#525252] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}

            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 text-[#737373] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white rounded-lg border border-[#E5E7EB] dark:border-[#27272A] hover:bg-[#FAF9F5] dark:hover:bg-[#27272A] cursor-pointer shrink-0"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stories Table */}
      {filteredPosts.length > 0 ? (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-[#ECECE8] dark:border-[#27272A] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF9F5] dark:bg-[#202024] border-b border-[#ECECE8] dark:border-[#27272A] text-[11px] font-semibold text-[#737373] dark:text-[#A1A1AA] uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Feature</th>
                  <th scope="col" className="px-6 py-3.5">Story Title</th>
                  <th scope="col" className="px-6 py-3.5">Author</th>
                  <th scope="col" className="px-6 py-3.5">Category</th>
                  <th scope="col" className="px-6 py-3.5">Status</th>
                  <th scope="col" className="px-6 py-3.5">Readers</th>
                  <th scope="col" className="px-6 py-3.5">Published</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECE8] dark:divide-[#27272A] text-[#121212] dark:text-[#F4F4F6]">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#FAF9F5]/60 dark:hover:bg-[#27272A]/40 transition-colors">
                    {/* Feature / Unfeature Star Control */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(post)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 text-xs ${
                          post.isFeatured
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/50 text-amber-700 dark:text-amber-300 shadow-2xs'
                            : 'border-[#E5E7EB] dark:border-[#27272A] text-[#A3A3A3] dark:text-[#71717A] hover:text-[#121212] dark:hover:text-white hover:border-[#121212] dark:hover:border-white/40'
                        }`}
                        title={post.isFeatured ? 'Click to unfeature' : 'Click to feature on homepage'}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            post.isFeatured ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                        <span className="text-[11px] font-semibold">
                          {post.isFeatured ? 'Featured' : 'Feature'}
                        </span>
                      </button>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 max-w-sm">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="font-serif font-medium text-sm sm:text-base text-[#121212] dark:text-[#F4F4F6] hover:underline block truncate"
                      >
                        {post.title}
                      </Link>
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4 text-[#525252] dark:text-[#A1A1AA] font-medium whitespace-nowrap">
                      {post.author}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-[#525252] dark:text-[#D4D4D8] bg-[#F4F4F5] dark:bg-[#27272A] px-2.5 py-1 rounded-md">
                        {post.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.status === 'Published' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Published</span>
                        </span>
                      )}
                      {post.status === 'Draft' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Draft</span>
                        </span>
                      )}
                      {post.status === 'Scheduled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/50">
                          <span>Scheduled</span>
                        </span>
                      )}
                    </td>

                    {/* Readers / Views */}
                    <td className="px-6 py-4 text-[#525252] dark:text-[#A1A1AA] text-xs whitespace-nowrap">
                      {post.views ? post.views.toLocaleString() : '—'}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-[#737373] dark:text-[#71717A] text-xs whitespace-nowrap">
                      {post.publishedAt}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="p-1.5 text-[#525252] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
                          title="Preview Story on Public Site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setPostToDelete(post)}
                          className="p-1.5 text-[#8A8A8A] dark:text-[#71717A] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer"
                          title="Delete Story Permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No stories match criteria"
          description={
            searchQuery
              ? `No articles found matching "${searchQuery}". Reset filters to view all.`
              : 'No stories available in this category.'
          }
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            className="bg-white dark:bg-[#18181B] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ECECE8] dark:border-[#27272A] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/50">
              <AlertTriangle className="w-5 h-5 stroke-[1.8]" />
            </div>

            <div>
              <h3 className="font-serif text-lg font-medium text-[#121212] dark:text-[#F4F4F6]">
                Delete platform story?
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed mt-1.5">
                Are you sure you want to permanently delete{' '}
                <strong className="text-[#121212] dark:text-[#F4F4F6]">"{postToDelete.title}"</strong>{' '}
                by {postToDelete.author}? This story will be purged from the catalog.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECECE8] dark:border-[#27272A]">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-3.5 py-1.5 text-xs text-[#525252] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer shadow-2xs"
              >
                Delete Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
