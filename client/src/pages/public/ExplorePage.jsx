import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, LayoutGrid, List as ListIcon, RotateCcw, ArrowUpDown } from 'lucide-react';
import Container from '../../components/common/Container.jsx';
import BlogCard from '../../components/blog/BlogCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { MOCK_ARTICLES, MOCK_CATEGORIES } from '../../data/mockData.js';

const ITEMS_PER_PAGE = 6;

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'popular'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: 'all', name: 'All Topics' },
    ...MOCK_CATEGORIES.map((c) => ({ id: c.slug, name: c.name })),
  ];

  // Filter and sort articles against mock data
  const processedArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = MOCK_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        article.categorySlug.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        (article.author?.name && article.author.name.toLowerCase().includes(q)) ||
        (article.tags && article.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'popular') {
        const viewsA = a.views || 0;
        const viewsB = b.views || 0;
        return viewsB - viewsA;
      }
      // default: newest
      const timeA = new Date(a.dateTimestamp || a.publishedAt || 0).getTime();
      const timeB = new Date(b.dateTimestamp || b.publishedAt || 0).getTime();
      return timeB - timeA;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(processedArticles.length / ITEMS_PER_PAGE) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [processedArticles, currentPage]);

  const handleCategorySelect = (slug) => {
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSearchChange = (val) => {
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleResetFilters = () => {
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || sortBy !== 'newest';

  return (
    <div className="py-8 sm:py-12">
      <Container size="default">
        {/* Page Header */}
        <div className="border-b border-[#ECECE8] pb-8 mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] mb-1.5">
                EDITORIAL CATALOGUE
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#121212] font-semibold tracking-tight">
                Explore Articles
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#666666]">
                Discover ideas, technical deep-dives, and perspectives from a variety of topics.
              </p>
            </div>

            {/* Search Input & Reset */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search title, tag, author, or excerpt..."
                  enterKeyHint="search"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-lg focus:border-[#121212] focus:ring-1 focus:ring-[#121212] outline-hidden placeholder:text-[#9CA3AF] transition-all"
                />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border border-[#E5E7EB] bg-white rounded-lg hover:bg-[#F9FAFB] text-[#4A4A4A] hover:text-[#121212] cursor-pointer shrink-0 transition-colors"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
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

          {/* Controls Bar: Results Count, Sort Dropdown & Layout Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 text-xs text-[#737373]">
            <p>
              Showing{' '}
              <strong className="text-[#121212] font-semibold">
                {processedArticles.length}
              </strong>{' '}
              {processedArticles.length === 1 ? 'story' : 'stories'}
              {selectedCategory !== 'all' && (
                <span>
                  {' '}in{' '}
                  <span className="text-[#121212] font-medium capitalize">
                    {selectedCategory}
                  </span>
                </span>
              )}
            </p>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
                <label htmlFor="sort-select" className="sr-only">Sort articles</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#E5E7EB] text-xs text-[#121212] rounded-md px-2.5 py-1 outline-hidden focus:border-[#121212] cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-[#E5E7EB] rounded-md bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#121212] text-white'
                      : 'text-[#737373] hover:text-[#121212]'
                  }`}
                  aria-label="List view"
                  title="List view"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#121212] text-white'
                      : 'text-[#737373] hover:text-[#121212]'
                  }`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Results */}
        {paginatedArticles.length > 0 ? (
          <div>
            {viewMode === 'list' ? (
              <div className="divide-y divide-[#ECECE8]">
                {paginatedArticles.map((article) => (
                  <BlogCard
                    key={article.id}
                    article={article}
                    variant="horizontal"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedArticles.map((article) => (
                  <BlogCard
                    key={article.id}
                    article={article}
                    variant="vertical"
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-12 flex items-center justify-center gap-1.5 text-sm font-medium text-[#4A4A4A]">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center font-semibold cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#121212] text-white'
                          : 'bg-white border border-[#E5E7EB] hover:bg-black/5 text-[#525252]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {currentPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-md hover:bg-black/5 text-[#525252] flex items-center justify-center ml-2 cursor-pointer text-xs"
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="No matching stories"
            description={`No articles found matching "${searchQuery}". Try searching for another topic or reset your filters.`}
            actionText="Reset Filters"
            onAction={handleResetFilters}
          />
        )}
      </Container>
    </div>
  );
}
