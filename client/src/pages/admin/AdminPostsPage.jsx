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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ECECE8]">
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] mb-1">
            CONTENT OVERSIGHT
          </p>
          <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
            Article Management & Curation
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Curate homepage features, inspect author publications, and moderate content standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/editor"
            className="px-3.5 py-2 text-xs font-semibold bg-[#121212] text-white rounded-lg hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            Create Platform Story
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#ECECE8] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by story title, author, or topic..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF9F5] border border-[#E5E7EB] rounded-lg outline-hidden focus:bg-white focus:border-[#121212] transition-colors"
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
                      ? 'bg-[#121212] text-white shadow-2xs'
                      : 'text-[#525252] hover:text-[#121212] hover:bg-[#FAF9F5]'
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
                className="p-1.5 text-[#737373] hover:text-[#121212] rounded-lg border border-[#E5E7EB] hover:bg-[#FAF9F5] cursor-pointer shrink-0"
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
        <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF9F5] border-b border-[#ECECE8] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
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
              <tbody className="divide-y divide-[#ECECE8] text-[#121212]">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#FAF9F5]/60 transition-colors">
                    {/* Feature / Unfeature Star Control */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(post)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 text-xs ${
                          post.isFeatured
                            ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-2xs'
                            : 'border-[#E5E7EB] text-[#A3A3A3] hover:text-[#121212] hover:border-[#121212]'
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
                        className="font-serif font-medium text-sm sm:text-base text-[#121212] hover:underline block truncate"
                      >
                        {post.title}
                      </Link>
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4 text-[#525252] font-medium whitespace-nowrap">
                      {post.author}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-[#525252] bg-[#F4F4F5] px-2.5 py-1 rounded-md">
                        {post.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.status === 'Published' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Published</span>
                        </span>
                      )}
                      {post.status === 'Draft' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Draft</span>
                        </span>
                      )}
                      {post.status === 'Scheduled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                          <span>Scheduled</span>
                        </span>
                      )}
                    </td>

                    {/* Readers / Views */}
                    <td className="px-6 py-4 text-[#525252] text-xs whitespace-nowrap">
                      {post.views ? post.views.toLocaleString() : '—'}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-[#737373] text-xs whitespace-nowrap">
                      {post.publishedAt}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-black/5 rounded-md transition-colors"
                          title="Preview Story on Public Site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setPostToDelete(post)}
                          className="p-1.5 text-[#8A8A8A] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ECECE8] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-5 h-5 stroke-[1.8]" />
            </div>

            <div>
              <h3 className="font-serif text-lg font-medium text-[#121212]">
                Delete platform story?
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mt-1.5">
                Are you sure you want to permanently delete{' '}
                <strong className="text-[#121212]">"{postToDelete.title}"</strong>{' '}
                by {postToDelete.author}? This story will be purged from the catalog.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECECE8]">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-3.5 py-1.5 text-xs text-[#525252] hover:text-[#121212] rounded-md cursor-pointer"
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
