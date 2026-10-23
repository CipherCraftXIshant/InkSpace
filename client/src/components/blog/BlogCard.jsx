import React from 'react';
import { Link } from 'react-router-dom';
import CategoryBadge from '../common/CategoryBadge.jsx';

/**
 * Editorial BlogCard supporting multiple layouts:
 * - 'featured': Main large article in the featured showcase
 * - 'compact': Right-column thumbnail + title list
 * - 'vertical': Classic card grid (Popular Articles)
 * - 'horizontal': Rich editorial card for Explore and search lists
 */
export default function BlogCard({
  article,
  variant = 'vertical', // 'featured' | 'compact' | 'vertical' | 'horizontal'
  className = '',
}) {
  if (!article) return null;

  const {
    slug,
    title,
    excerpt,
    category,
    categorySlug,
    coverImage,
    date,
    readTime,
    author,
  } = article;

  const articleUrl = `/blog/${slug}`;

  // 1. Featured Large Card
  if (variant === 'featured') {
    return (
      <article
        className={`group flex flex-col justify-between h-full bg-transparent ${className}`}
      >
        <Link to={articleUrl} className="block overflow-hidden rounded-xl mb-5 bg-[#F0F0ED]">
          <img
            src={coverImage}
            alt={title}
            className="w-full aspect-16/10 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />
        </Link>

        <div>
          <div className="mb-2">
            <CategoryBadge slug={categorySlug}>{category}</CategoryBadge>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#121212] font-medium leading-snug tracking-tight mb-3 group-hover:text-[#4A4A4A] transition-colors">
            <Link to={articleUrl}>{title}</Link>
          </h3>

          {excerpt && (
            <p className="text-sm sm:text-base text-[#666666] leading-relaxed mb-4 line-clamp-2">
              {excerpt}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-[#8A8A8A] font-normal">
            <span>{date}</span>
            <span>•</span>
            <span>{readTime}</span>
            {author && (
              <>
                <span>•</span>
                <span>By {author.name}</span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  // 2. Compact List Card (Thumbnail on left)
  if (variant === 'compact') {
    return (
      <article
        className={`group flex items-center gap-4 sm:gap-5 py-3.5 first:pt-0 last:pb-0 ${className}`}
      >
        <Link
          to={articleUrl}
          className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-lg bg-[#F0F0ED]"
        >
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        <div className="flex flex-col justify-center min-w-0 flex-1">
          <h4 className="font-serif text-base sm:text-lg text-[#121212] font-medium leading-snug line-clamp-2 mb-2 group-hover:text-[#525252] transition-colors">
            <Link to={articleUrl}>{title}</Link>
          </h4>

          <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
            <span>{date}</span>
            <span>•</span>
            <span>{readTime}</span>
          </div>
        </div>
      </article>
    );
  }

  // 3. Horizontal Editorial Card (Explore page)
  if (variant === 'horizontal') {
    return (
      <article
        className={`group flex flex-col md:flex-row gap-5 md:gap-7 items-start py-6 border-b border-[#EBEBEB] last:border-b-0 ${className}`}
      >
        <Link
          to={articleUrl}
          className="w-full md:w-64 lg:w-72 aspect-16/10 md:aspect-3/2 shrink-0 overflow-hidden rounded-lg bg-[#F0F0ED]"
        >
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        <div className="flex flex-col justify-between flex-1 h-full py-0.5">
          <div>
            <div className="mb-2">
              <CategoryBadge slug={categorySlug}>{category}</CategoryBadge>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl text-[#121212] font-medium leading-snug tracking-tight mb-2 group-hover:text-[#525252] transition-colors">
              <Link to={articleUrl}>{title}</Link>
            </h3>

            {excerpt && (
              <p className="text-sm text-[#666666] leading-relaxed mb-4 line-clamp-2 sm:line-clamp-3">
                {excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
            <span>{date}</span>
            <span>•</span>
            <span>{readTime}</span>
            {author && (
              <>
                <span>•</span>
                <span>By {author.name}</span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  // 4. Default Vertical Card (Popular Articles grid)
  return (
    <article className={`group flex flex-col h-full ${className}`}>
      <Link
        to={articleUrl}
        className="block overflow-hidden rounded-xl mb-4 bg-[#F0F0ED]"
      >
        <img
          src={coverImage}
          alt={title}
          className="w-full aspect-4/3 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-col flex-1">
        <div className="mb-2">
          <CategoryBadge slug={categorySlug}>{category}</CategoryBadge>
        </div>

        <h3 className="font-serif text-lg sm:text-xl text-[#121212] font-medium leading-snug tracking-tight mb-2 group-hover:text-[#525252] transition-colors">
          <Link to={articleUrl}>{title}</Link>
        </h3>

        <div className="mt-auto pt-2 flex items-center gap-2 text-xs text-[#8A8A8A]">
          <span>{date}</span>
          <span>•</span>
          <span>{readTime}</span>
        </div>
      </div>
    </article>
  );
}
