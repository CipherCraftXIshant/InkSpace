import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import Container from '../../components/common/Container.jsx';
import BlogCard from '../../components/blog/BlogCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { MOCK_ARTICLES, MOCK_CATEGORIES } from '../../data/mockData.js';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: 'all', name: 'All' },
    ...MOCK_CATEGORIES.map((c) => ({ id: c.slug, name: c.name })),
  ];

  const filteredArticles = useMemo(() => {
    return MOCK_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        article.categorySlug.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="py-8 sm:py-12">
      <Container size="default">
        {/* Page Header */}
        <div className="border-b border-[#ECECE8] pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#121212] font-semibold tracking-tight">
                Explore Articles
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#666666]">
                Discover ideas and perspectives from a variety of topics.
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  enterKeyHint="search"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-md focus:border-[#121212] focus:ring-1 focus:ring-[#121212] outline-hidden placeholder:text-[#9CA3AF] transition-all"
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium border border-[#E5E7EB] bg-white rounded-md hover:bg-[#F9FAFB] text-[#4A4A4A] cursor-pointer"
                title="Filters"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#121212] text-white shadow-2xs'
                      : 'bg-white text-[#525252] border border-[#E5E7EB] hover:border-[#121212] hover:text-[#121212]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Article Results */}
        {filteredArticles.length > 0 ? (
          <div>
            <div className="divide-y divide-[#ECECE8]">
              {filteredArticles.map((article) => (
                <BlogCard
                  key={article.id}
                  article={article}
                  variant="horizontal"
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="pt-12 flex items-center justify-center gap-1 text-sm font-medium text-[#4A4A4A]">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center font-semibold cursor-pointer transition-colors ${
                    currentPage === page
                      ? 'bg-[#121212] text-white'
                      : 'hover:bg-black/5 text-[#525252]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-2 text-[#9CA3AF]">...</span>
              <button
                type="button"
                onClick={() => setCurrentPage(8)}
                className={`w-8 h-8 rounded-md flex items-center justify-center font-semibold cursor-pointer transition-colors ${
                  currentPage === 8
                    ? 'bg-[#121212] text-white'
                    : 'hover:bg-black/5 text-[#525252]'
                }`}
              >
                8
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, 8))}
                className="px-3 py-1 rounded-md hover:bg-black/5 text-[#525252] flex items-center justify-center ml-2 cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No matching articles"
            description={`No articles found for "${searchQuery}". Try searching for another topic or clear filters.`}
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          />
        )}
      </Container>
    </div>
  );
}
