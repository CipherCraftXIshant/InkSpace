import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from '../../components/common/Container.jsx';
import BlogCard from '../../components/blog/BlogCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { MOCK_CATEGORIES, MOCK_ARTICLES } from '../../data/mockData.js';

export default function CategoryPage() {
  const { category: categorySlug } = useParams();

  const category = MOCK_CATEGORIES.find(
    (c) => c.slug.toLowerCase() === categorySlug?.toLowerCase()
  );

  const articles = MOCK_ARTICLES.filter(
    (a) => a.categorySlug.toLowerCase() === categorySlug?.toLowerCase()
  );

  if (!category) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Category Not Found"
          description="The topic you are looking for does not exist or has been moved."
          actionText="Browse All Topics"
          actionTo="/explore"
        />
      </Container>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Category Header */}
        <div className="border-b border-[#ECECE8] pb-8 mb-10">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#737373] hover:text-[#121212] mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>

          <span className="block text-[11px] font-bold tracking-widest uppercase text-[#737373] mb-2">
            CATEGORY ARCHIVE
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#121212] font-semibold tracking-tight mb-3">
            {category.name}
          </h1>

          <p className="text-sm sm:text-base text-[#666666] max-w-2xl leading-relaxed">
            {category.description}
          </p>

          <div className="mt-4 text-xs font-semibold text-[#8A8A8A]">
            {category.count} published articles
          </div>
        </div>

        {/* Category Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <BlogCard key={article.id} article={article} variant="vertical" />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No ${category.name} stories yet`}
            description="Our writers are currently drafting insightful stories for this topic. Check back soon."
            actionText="Explore Other Topics"
            actionTo="/explore"
          />
        )}
      </Container>
    </div>
  );
}
