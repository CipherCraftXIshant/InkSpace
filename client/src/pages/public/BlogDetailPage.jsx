import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Link2,
  Bookmark,
  Heart,
  Check,
  ChevronRight,
} from 'lucide-react';
import Container from '../../components/common/Container.jsx';
import CategoryBadge from '../../components/common/CategoryBadge.jsx';
import BlogCard from '../../components/blog/BlogCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { MOCK_ARTICLES } from '../../data/mockData.js';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Find article by slug, or fallback to first article
  const article = MOCK_ARTICLES.find((a) => a.slug === slug) || MOCK_ARTICLES[0];
  const relatedArticles = MOCK_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!article) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Article Not Found"
          description="The story you are looking for does not exist or has been removed."
          actionText="Browse Articles"
          actionTo="/explore"
        />
      </Container>
    );
  }

  return (
    <article className="py-8 sm:py-12">
      <Container size="default">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#737373] mb-6 overflow-x-auto whitespace-nowrap"
        >
          <Link to="/" className="hover:text-[#121212] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#A3A3A3]" />
          <Link
            to={`/categories/${article.categorySlug}`}
            className="hover:text-[#121212] transition-colors"
          >
            {article.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#A3A3A3]" />
          <span className="text-[#121212] font-medium truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="max-w-4xl mb-10">
          <div className="mb-3">
            <CategoryBadge slug={article.categorySlug} variant="outline">
              {article.category}
            </CategoryBadge>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#121212] font-semibold tracking-tight leading-[1.12] mb-4">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-base sm:text-xl text-[#666666] leading-relaxed mb-6 font-normal">
              {article.subtitle}
            </p>
          )}

          {/* Author Details Bar */}
          <div className="flex items-center justify-between py-4 border-y border-[#ECECE8]">
            <div className="flex items-center gap-3">
              <img
                src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={article.author?.name}
                className="w-10 h-10 rounded-full object-cover border border-[#ECECE8]"
              />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#121212]">
                  By {article.author?.name}
                </p>
                <p className="text-xs text-[#8A8A8A]">
                  {article.date} • {article.readTime}
                </p>
              </div>
            </div>

            {/* Like and Bookmark quick buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className={`p-2 rounded-full border transition-colors cursor-pointer ${
                  liked
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'border-[#ECECE8] text-[#71717A] hover:text-[#121212] hover:bg-black/5'
                }`}
                aria-label="Like story"
                title="Like"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-full border transition-colors cursor-pointer ${
                  bookmarked
                    ? 'bg-black text-white border-black'
                    : 'border-[#ECECE8] text-[#71717A] hover:text-[#121212] hover:bg-black/5'
                }`}
                aria-label="Bookmark story"
                title="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        {/* 3-Column Layout: Social Bar, Main Content, TOC/Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Share Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-28 flex flex-col items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-1">
                Share
              </span>
              <button
                type="button"
                className="p-2 rounded-full border border-[#ECECE8] hover:border-[#121212] hover:bg-black/5 text-[#525252] hover:text-[#121212] transition-colors cursor-pointer"
                aria-label="Share on X"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                type="button"
                className="p-2 rounded-full border border-[#ECECE8] hover:border-[#121212] hover:bg-black/5 text-[#525252] hover:text-[#121212] transition-colors cursor-pointer"
                aria-label="Share on Facebook"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                type="button"
                className="p-2 rounded-full border border-[#ECECE8] hover:border-[#121212] hover:bg-black/5 text-[#525252] hover:text-[#121212] transition-colors cursor-pointer"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-full border border-[#ECECE8] hover:border-[#121212] hover:bg-black/5 text-[#525252] hover:text-[#121212] transition-colors cursor-pointer"
                aria-label="Copy article link"
                title="Copy link"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Link2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Center Main Editorial Body */}
          <div className="lg:col-span-7 prose prose-neutral max-w-none">
            {/* Hero Photo */}
            <div className="rounded-xl overflow-hidden mb-8 border border-[#ECECE8] bg-[#F5F5F0]">
              <img
                src={article.heroImage || article.coverImage}
                alt={article.title}
                className="w-full aspect-16/10 object-cover"
              />
            </div>

            {/* Article Prose */}
            <div className="space-y-6 text-[#262626] text-base sm:text-lg leading-relaxed font-normal">
              <p>
                Web development is constantly evolving, with new technologies and
                frameworks emerging every year. In this post, we explore the key
                trends and tools that are shaping the future of the web.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#121212] pt-4">
                1. The Rise of Modern Frameworks
              </h2>
              <p>
                Frontend tooling has matured from fragmented script bundlers to
                unified compilation engines. Modern teams demand zero-config
                performance, instant hot-module replacement, and strict type
                safety out of the box.
              </p>

              <blockquote className="my-8 border-l-2 border-[#121212] pl-6 py-2 italic font-serif text-xl sm:text-2xl text-[#121212] bg-[#F9F9F7] rounded-r-lg">
                “True craftsmanship in software lies not in how much you can add,
                but in how gracefully you can eliminate friction for the reader.”
              </blockquote>

              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#121212] pt-4">
                2. Developer Experience & Tooling
              </h2>
              <p>
                Toolchains like Vite, Turbopack, and native Rust-based compilers
                have reduced build times from minutes to milliseconds. Developers
                no longer wait for compilation loops; feedback is instantaneous.
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#121212] pt-4">
                3. Performance-First Architectures
              </h2>
              <p>
                Core Web Vitals are no longer an afterthought. With modern web
                capabilities like speculative pre-rendering, responsive image
                formats, and minimal runtime shipping, web apps can feel as snappy
                as native desktop software.
              </p>
            </div>
          </div>

          {/* Right Sidebar: Table of Contents & Recommendations */}
          <div className="lg:col-span-4 space-y-10">
            {/* Table of Contents */}
            <div className="p-6 bg-white rounded-xl border border-[#ECECE8] shadow-2xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#121212] mb-4">
                Table of Contents
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#525252]">
                <li className="hover:text-[#121212] cursor-pointer font-medium text-[#121212]">
                  1. The Rise of Modern Frameworks
                </li>
                <li className="hover:text-[#121212] cursor-pointer">
                  2. Developer Experience
                </li>
                <li className="hover:text-[#121212] cursor-pointer">
                  3. Performance-First
                </li>
                <li className="hover:text-[#121212] cursor-pointer">
                  4. The Role of AI
                </li>
                <li className="hover:text-[#121212] cursor-pointer">
                  5. What's Next?
                </li>
              </ul>
            </div>

            {/* You Might Also Like */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#121212] mb-4">
                You might also like
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <BlogCard key={rel.id} article={rel} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}
