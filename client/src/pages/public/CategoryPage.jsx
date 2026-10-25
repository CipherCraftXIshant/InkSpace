import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import Container from '../../components/common/Container.jsx';
import BlogCard from '../../components/blog/BlogCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { MOCK_CATEGORIES, MOCK_ARTICLES } from '../../data/mockData.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function CategoryPage() {
  const { category: categorySlug } = useParams();

  const category = MOCK_CATEGORIES.find(
    (c) => c.slug.toLowerCase() === categorySlug?.toLowerCase()
  );

  useDocumentTitle(category ? `${category.name} Stories` : 'Category Not Found');

  const articles = MOCK_ARTICLES.filter(
    (a) => a.categorySlug.toLowerCase() === categorySlug?.toLowerCase()
  );

  const otherCategories = MOCK_CATEGORIES.filter(
    (c) => c.slug.toLowerCase() !== categorySlug?.toLowerCase()
  );

  if (!category) {
    return (
      <Container className="py-20">
        <EmptyState
          icon={Compass}
          title="Category Not Found"
          description={`We couldn't find a topic matching "${categorySlug}". It may have been archived or renamed.`}
          actionText="Browse All Topics"
          actionTo="/explore"
        />
      </Container>
    );
  }

  return (
    <div className="py-8 sm:py-12 space-y-12">
      <Container>
        {/* Category Header */}
        <div className="border-b border-[#ECECE8] pb-8 mb-10">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#737373] hover:text-[#121212] mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>

          <span className="block text-[11px] font-bold tracking-widest uppercase text-[#737373] mb-2">
            CURATED TOPIC ARCHIVE
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#121212] font-semibold tracking-tight mb-3">
            {category.name}
          </h1>

          <p className="text-sm sm:text-base text-[#666666] max-w-2xl leading-relaxed font-normal">
            {category.description}
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-[#8A8A8A]">
            <span>{articles.length} curated stories</span>
            <span>•</span>
            <Link
              to={`/explore?category=${category.slug}`}
              className="text-[#121212] hover:underline"
            >
              Filter in Explore →
            </Link>
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

        {/* Explore Other Topics Strip */}
        <div className="pt-12 border-t border-[#ECECE8]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3] mb-4">
            Explore Other Topics
          </p>
          <div className="flex flex-wrap gap-2.5">
            {otherCategories.map((c) => (
              <Link
                key={c.id}
                to={`/categories/${c.slug}`}
                className="px-3.5 py-1.5 bg-white border border-[#ECECE8] hover:border-[#121212] rounded-full text-xs font-medium text-[#4A4A4A] hover:text-[#121212] transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
