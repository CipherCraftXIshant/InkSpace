import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, Clock } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import CategoryBadge from '../../components/common/CategoryBadge.jsx';
import { MOCK_ARTICLES } from '../../data/mockData.js';
import {
  getBookmarks,
  removeBookmark,
  getAuthorPosts,
} from '../../utils/storage.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function BookmarksPage() {
  useDocumentTitle('Saved Bookmarks');
  const [bookmarkIds, setBookmarkIds] = useState(() => getBookmarks());
  const [toastMessage, setToastMessage] = useState('');

  // Collect all searchable articles from mock catalogue and author's own posts
  const bookmarkedArticles = useMemo(() => {
    const allArticles = [...MOCK_ARTICLES, ...getAuthorPosts()];
    return bookmarkIds
      .map((id) => allArticles.find((a) => a.id === id))
      .filter(Boolean);
  }, [bookmarkIds]);

  const handleRemove = (articleId, title) => {
    const updated = removeBookmark(articleId);
    setBookmarkIds(updated);
    setToastMessage(`Removed "${title}" from your saved stories.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-20 right-6 z-50 bg-[#121212] dark:bg-white text-white dark:text-[#121212] text-xs px-4 py-2.5 rounded-lg shadow-xl border border-white/10 dark:border-black/10 flex items-center gap-2 animate-in fade-in"
          role="status"
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ECECE8] dark:border-[#27272A]">
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] dark:text-[#A1A1AA] mb-1">
            PERSONAL LIBRARY
          </p>
          <h1 className="font-serif text-3xl font-medium text-[#121212] dark:text-[#F4F4F6] tracking-tight">
            Saved Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A1A1AA] mt-1">
            Articles and research essays you have bookmarked for deep reading.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] rounded-lg hover:border-[#121212] dark:hover:border-white text-[#121212] dark:text-[#F4F4F6] transition-colors"
          >
            <span>Explore Catalogue</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#737373] dark:text-[#A1A1AA]" />
          </Link>
        </div>
      </div>

      {/* Bookmarks Grid */}
      {bookmarkedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-[#18181B] rounded-xl border border-[#ECECE8] dark:border-[#27272A] overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <Link
                  to={`/blog/${article.slug}`}
                  className="block aspect-16/10 bg-[#F0F0ED] dark:bg-[#121214] overflow-hidden group"
                >
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </Link>

                <div className="p-5">
                  <div className="mb-2">
                    <CategoryBadge slug={article.categorySlug}>
                      {article.category}
                    </CategoryBadge>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-[#121212] dark:text-[#F4F4F6] mb-2 leading-snug">
                    <Link
                      to={`/blog/${article.slug}`}
                      className="hover:underline"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-[#666666] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-[#FAF9F5] dark:bg-[#121214] border-t border-[#ECECE8] dark:border-[#27272A] flex items-center justify-between text-xs text-[#8A8A8A] dark:text-[#71717A]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#71717A]" />
                  <span>{article.readingTime || article.readTime || '5 min read'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(article.id, article.title)}
                  className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer font-medium transition-colors"
                  title="Remove from bookmarks"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No bookmarked stories yet"
          description="You haven't saved any stories to your library. Explore the public catalog and click the bookmark button on any article to save it for later."
          actionText="Explore Articles"
          actionTo="/explore"
        />
      )}
    </div>
  );
}
