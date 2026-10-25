import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Heart,
  Calendar,
  AlertTriangle,
  X,
  RotateCcw,
} from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { getAuthorPosts, deleteAuthorPost } from '../../utils/storage.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function DashboardPostsPage() {
  useDocumentTitle('My Posts');
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [posts, setPosts] = useState(() => getAuthorPosts());
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'published' | 'drafts' | 'scheduled'
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [toastMessage, setToastMessage] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: posts.length,
      published: posts.filter((p) => p.status === 'Published').length,
      drafts: posts.filter((p) => p.status === 'Draft').length,
      scheduled: posts.filter((p) => p.status === 'Scheduled').length,
    };
  }, [posts]);

  // Filtered & searched posts
  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return posts.filter((post) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'published' && post.status === 'Published') ||
        (activeTab === 'drafts' && post.status === 'Draft') ||
        (activeTab === 'scheduled' && post.status === 'Scheduled');

      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
        (post.category && post.category.toLowerCase().includes(q));

      return matchesTab && matchesSearch;
    });
  }, [posts, activeTab, searchQuery]);

  // Handle Search Input Change
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('q', val.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams, { replace: true });
  };

  // Open delete dialog
  const promptDelete = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    if (!postToDelete) return;
    const updated = deleteAuthorPost(postToDelete.id);
    setPosts(updated);
    setDeleteModalOpen(false);
    setToastMessage(`"${postToDelete.title}" was deleted.`);
    setPostToDelete(null);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-20 right-6 z-50 bg-[#121212] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-2"
          role="status"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage('')}
            className="text-neutral-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ECECE8]">
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] mb-1">
            STORY MANAGEMENT
          </p>
          <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
            My Posts
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            Organize, draft, and publish your editorial writing.
          </p>
        </div>

        <Button to="/dashboard/editor" variant="primary" size="md" icon={Plus}>
          Create New Post
        </Button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-[#ECECE8] shadow-2xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Stories', count: tabCounts.all },
            { id: 'published', label: 'Published', count: tabCounts.published },
            { id: 'drafts', label: 'Drafts', count: tabCounts.drafts },
            { id: 'scheduled', label: 'Scheduled', count: tabCounts.scheduled },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#121212] text-white shadow-2xs'
                    : 'text-[#525252] hover:text-[#121212] hover:bg-[#FAF9F5]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F4F4F5] text-[#737373]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search posts by title or category..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F5] border border-[#E5E7EB] rounded-lg focus:bg-white focus:border-[#121212] outline-hidden placeholder:text-[#9CA3AF] transition-all"
            />
          </div>

          {(searchQuery || activeTab !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-1.5 text-[#737373] hover:text-[#121212] rounded-lg border border-[#E5E7EB] hover:bg-[#FAF9F5] cursor-pointer"
              title="Reset filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Posts Table */}
      {filteredPosts.length > 0 ? (
        <div className="bg-white rounded-xl border border-[#ECECE8] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF9F5] border-b border-[#ECECE8] text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Story & Excerpt
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Metrics
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Timeline
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECE8] text-[#121212]">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    {/* Title & Excerpt */}
                    <td className="px-6 py-4 max-w-sm">
                      <Link
                        to={`/dashboard/editor/${post.id}`}
                        className="font-serif font-medium text-sm sm:text-base text-[#121212] hover:underline block truncate"
                      >
                        {post.title}
                      </Link>
                      {post.excerpt && (
                        <p className="text-xs text-[#737373] line-clamp-1 mt-0.5">
                          {post.excerpt}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-[#525252] bg-[#F4F4F5] px-2.5 py-1 rounded-md">
                        {post.category || 'General'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.status === 'Published' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Published</span>
                        </span>
                      )}
                      {post.status === 'Draft' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Draft</span>
                        </span>
                      )}
                      {post.status === 'Scheduled' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                          <Calendar className="w-3 h-3 text-sky-600" />
                          <span>Scheduled</span>
                        </span>
                      )}
                    </td>

                    {/* Metrics */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3 text-xs text-[#525252]">
                        <span className="inline-flex items-center gap-1" title="Reader Views">
                          <Eye className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          {post.views ? post.views.toLocaleString() : '—'}
                        </span>
                        <span className="inline-flex items-center gap-1" title="Reader Likes">
                          <Heart className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          {post.likes ? post.likes : '—'}
                        </span>
                      </div>
                    </td>

                    {/* Timeline */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[#737373]">
                      {post.status === 'Scheduled'
                        ? post.scheduledDate || 'Upcoming'
                        : post.updatedAt || post.publishedAt || 'Recently'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/dashboard/editor/${post.id}`}
                          className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-black/5 rounded-md transition-colors"
                          title="Edit Story"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {post.status === 'Published' && (
                          <Link
                            to={`/blog/${post.slug}`}
                            className="p-1.5 text-[#525252] hover:text-[#121212] hover:bg-black/5 rounded-md transition-colors"
                            title="Preview on Public Site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => promptDelete(post)}
                          className="p-1.5 text-[#8A8A8A] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
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
          title="No stories match your criteria"
          description={
            searchQuery
              ? `No articles found matching "${searchQuery}". Try a different search query or reset your tab filters.`
              : `You have no stories under "${activeTab}". Create a new post to get started.`
          }
          actionText={searchQuery ? 'Reset Filters' : 'Create New Story'}
          onAction={searchQuery ? handleResetFilters : undefined}
          actionTo={!searchQuery ? '/dashboard/editor' : undefined}
        />
      )}

      {/* Accessible Confirmation Modal for Deletion */}
      {deleteModalOpen && postToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#ECECE8] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-5 h-5 stroke-[1.8]" />
            </div>

            <div>
              <h2
                id="delete-dialog-title"
                className="font-serif text-xl font-medium text-[#121212]"
              >
                Delete this story?
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mt-1.5">
                Are you sure you want to delete{' '}
                <strong className="text-[#121212]">"{postToDelete.title}"</strong>?
                This action is permanent and will remove the story from your dashboard and public catalog.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECECE8]">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#4A4A4A] hover:text-[#121212] hover:bg-[#FAF9F5] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
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
