import React, { useState } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import CategoryBadge from '../../components/common/CategoryBadge.jsx';
import { MOCK_ARTICLES } from '../../data/mockData.js';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState(MOCK_ARTICLES.slice(0, 3));

  const handleRemove = (id) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
          Saved Bookmarks
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          Articles and stories you have bookmarked for future reading.
        </p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl border border-[#ECECE8] overflow-hidden shadow-2xs flex flex-col justify-between"
            >
              <div>
                <Link to={`/blog/${article.slug}`} className="block aspect-16/10 bg-[#F0F0ED]">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-5">
                  <div className="mb-2">
                    <CategoryBadge slug={article.categorySlug}>
                      {article.category}
                    </CategoryBadge>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#121212] mb-2 leading-snug">
                    <Link to={`/blog/${article.slug}`} className="hover:text-[#525252]">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-[#666666] line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 bg-[#FAF9F5] border-t border-[#ECECE8] flex items-center justify-between text-xs text-[#8A8A8A]">
                <span>{article.readTime}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(article.id)}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 cursor-pointer font-medium"
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
          title="No bookmarked stories"
          description="You haven't saved any stories yet. Explore the catalogue and tap the bookmark icon on any story to save it."
          actionText="Explore Articles"
          actionTo="/explore"
        />
      )}
    </div>
  );
}
