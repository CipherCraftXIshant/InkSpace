import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Flag,
  Search,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import {
  getAdminComments,
  approveAdminComment,
  flagAdminComment,
  deleteAdminComment,
} from '../../utils/storage.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function AdminCommentsPage() {
  useDocumentTitle('Comment Moderation — Admin');
  const [comments, setComments] = useState(() => getAdminComments());
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'Pending' | 'Flagged' | 'Approved'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: comments.length,
      pending: comments.filter((c) => c.status === 'Pending').length,
      flagged: comments.filter((c) => c.status === 'Flagged').length,
      approved: comments.filter((c) => c.status === 'Approved').length,
    };
  }, [comments]);

  // Filtered comments
  const filteredComments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return comments.filter((c) => {
      const matchesSearch =
        !q ||
        c.author.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        c.articleTitle.toLowerCase().includes(q);

      const matchesTab = activeTab === 'all' || c.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [comments, searchQuery, activeTab]);

  const handleApprove = (id) => {
    const updated = approveAdminComment(id);
    setComments(updated);
    setToastMessage('Comment approved and made visible to readers.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleFlag = (id) => {
    const updated = flagAdminComment(id, 'Flagged by Moderator');
    setComments(updated);
    setToastMessage('Comment flagged for editorial violation.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const confirmDelete = () => {
    if (!commentToDelete) return;
    const updated = deleteAdminComment(commentToDelete.id);
    setComments(updated);
    setToastMessage('Comment permanently purged.');
    setCommentToDelete(null);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveTab('all');
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
            COMMUNITY SAFETY
          </p>
          <h1 className="font-serif text-3xl font-medium text-[#121212] dark:text-[#F4F4F6] tracking-tight">
            Comment Moderation
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A1A1AA] mt-1">
            Review reader feedback, approve thoughtful discussions, and eliminate spam or abusive remarks.
          </p>
        </div>

        <div className="text-xs text-[#737373] dark:text-[#A1A1AA] bg-white dark:bg-[#18181B] border border-[#ECECE8] dark:border-[#27272A] px-3 py-1.5 rounded-lg">
          Total Feedback:{' '}
          <strong className="text-[#121212] dark:text-[#F4F4F6] font-semibold">{comments.length}</strong>
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
              placeholder="Search by author, text, or story title..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF9F5] dark:bg-[#202024] border border-[#E5E7EB] dark:border-[#27272A] rounded-lg outline-hidden focus:bg-white dark:focus:bg-[#18181B] focus:border-[#121212] dark:focus:border-white/40 text-[#121212] dark:text-[#F4F4F6] transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Comments', count: tabCounts.all },
              { id: 'Pending', label: 'Pending Review', count: tabCounts.pending },
              { id: 'Flagged', label: 'Flagged / Spam', count: tabCounts.flagged },
              { id: 'Approved', label: 'Approved', count: tabCounts.approved },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#121212] dark:bg-white text-white dark:text-[#121212] shadow-2xs'
                      : 'text-[#525252] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#121212]'
                        : 'bg-[#F4F4F5] dark:bg-[#27272A] text-[#737373] dark:text-[#A1A1AA]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}

            {(searchQuery || activeTab !== 'all') && (
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

      {/* Comments List */}
      {filteredComments.length > 0 ? (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-[#ECECE8] dark:border-[#27272A] shadow-2xs divide-y divide-[#ECECE8] dark:divide-[#27272A]">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 sm:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-[#FAF9F5]/40 dark:hover:bg-[#27272A]/40 transition-colors"
            >
              {/* Comment Content */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#121212] dark:bg-white text-white dark:text-[#121212] flex items-center justify-center font-bold text-[10px]">
                    {comment.author.charAt(0)}
                  </div>
                  <span className="font-semibold text-[#121212] dark:text-[#F4F4F6]">{comment.author}</span>
                  {comment.authorEmail && (
                    <span className="text-[#8A8A8A] dark:text-[#71717A] font-mono text-[11px]">
                      ({comment.authorEmail})
                    </span>
                  )}
                  <span className="text-[#A3A3A3] dark:text-[#71717A]">•</span>
                  <span className="text-[#737373] dark:text-[#A1A1AA]">on story:</span>
                  <Link
                    to={`/blog/${comment.articleSlug}`}
                    className="font-medium text-[#121212] dark:text-[#F4F4F6] hover:underline flex items-center gap-1"
                  >
                    <span>{comment.articleTitle}</span>
                    <ExternalLink className="w-3 h-3 text-[#A3A3A3] dark:text-[#71717A]" />
                  </Link>
                  <span className="text-[#A3A3A3] dark:text-[#71717A]">•</span>
                  <span className="text-[#8A8A8A] dark:text-[#71717A]">{comment.submittedAt}</span>

                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      comment.status === 'Approved'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                        : comment.status === 'Flagged'
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
                    }`}
                  >
                    {comment.status}
                  </span>
                </div>

                {comment.flagReason && (
                  <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 px-2.5 py-1 rounded inline-block">
                    Flag Reason: {comment.flagReason}
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#333333] dark:text-[#D4D4D8] leading-relaxed bg-[#FAF9F5] dark:bg-[#202024] p-3 rounded-lg border border-[#ECECE8] dark:border-[#27272A]">
                  "{comment.content}"
                </p>
              </div>

              {/* Moderation Controls */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-1">
                {comment.status !== 'Approved' && (
                  <button
                    type="button"
                    onClick={() => handleApprove(comment.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50 cursor-pointer transition-colors"
                    title="Approve Comment"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {comment.status !== 'Flagged' && (
                  <button
                    type="button"
                    onClick={() => handleFlag(comment.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 cursor-pointer transition-colors"
                    title="Flag Comment"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Flag</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setCommentToDelete(comment)}
                  className="p-1.5 text-[#8A8A8A] dark:text-[#71717A] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] cursor-pointer transition-colors"
                  title="Delete Comment Permanently"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title={
            activeTab === 'all'
              ? 'No comments found'
              : `Inbox zero for "${activeTab}" comments`
          }
          description={
            searchQuery
              ? `No discussions found matching "${searchQuery}". Reset filters to see all.`
              : 'There are currently no comments pending action in this moderation queue.'
          }
          actionText={searchQuery ? 'Reset Filters' : undefined}
          onAction={searchQuery ? handleResetFilters : undefined}
        />
      )}

      {/* Confirmation Modal for Comment Deletion */}
      {commentToDelete && (
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
                Permanently delete comment?
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed mt-1.5">
                Are you sure you want to remove the comment by{' '}
                <strong className="text-[#121212] dark:text-[#F4F4F6]">{commentToDelete.author}</strong> on{' '}
                <em>"{commentToDelete.articleTitle}"</em>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECECE8] dark:border-[#27272A]">
              <button
                type="button"
                onClick={() => setCommentToDelete(null)}
                className="px-3.5 py-1.5 text-xs text-[#525252] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer shadow-2xs"
              >
                Delete Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
