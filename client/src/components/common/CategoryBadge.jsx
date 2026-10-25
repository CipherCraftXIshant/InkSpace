import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Editorial Category Badge.
 * Styled with crisp uppercase tracking and minimal borders.
 */
export default function CategoryBadge({
  children,
  slug,
  variant = 'subtle', // 'subtle' | 'outline' | 'dark'
  size = 'sm', // 'xs' | 'sm'
  className = '',
}) {
  const baseClasses =
    'inline-flex items-center font-semibold uppercase tracking-wider transition-colors duration-150';

  const variants = {
    subtle: 'text-[#525252] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white',
    outline: 'border border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#404040] dark:text-[#D4D4D8] hover:border-[#121212] dark:hover:border-white hover:text-[#121212] dark:hover:text-white px-2.5 py-0.5 rounded-full',
    dark: 'bg-[#121212] dark:bg-white text-white dark:text-[#121212] px-2.5 py-0.5 rounded-full',
  };

  const sizes = {
    xs: 'text-[10px] leading-tight',
    sm: 'text-xs leading-none',
  };

  const finalClasses = `${baseClasses} ${variants[variant] || variants.subtle} ${sizes[size] || sizes.sm} ${className}`;

  if (slug) {
    return (
      <Link
        to={`/categories/${slug}`}
        className={finalClasses}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </Link>
    );
  }

  return <span className={finalClasses}>{children}</span>;
}
