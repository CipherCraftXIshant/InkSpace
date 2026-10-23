import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Editorial section header with serif title and optional 'View all' action link.
 */
export default function SectionHeading({
  title,
  eyebrow,
  description,
  actionText,
  actionHref,
  className = '',
  align = 'left',
  titleSize = 'default', // 'default' | 'large' | 'small'
}) {
  const titleSizes = {
    small: 'text-xl sm:text-2xl',
    default: 'text-2xl sm:text-3xl',
    large: 'text-3xl sm:text-4xl lg:text-5xl',
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 ${
        align === 'center' ? 'text-center items-center' : ''
      } ${className}`}
    >
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold tracking-widest text-[#737373] uppercase mb-2">
            {eyebrow}
          </p>
        )}
        <h2
          className={`font-serif font-medium text-[#121212] tracking-tight leading-tight ${
            titleSizes[titleSize] || titleSizes.default
          }`}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm sm:text-base text-[#666666] max-w-2xl font-normal leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionText && actionHref && (
        <Link
          to={actionHref}
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#121212] hover:text-[#525252] transition-colors shrink-0 self-start sm:self-end pb-1 border-b border-transparent hover:border-[#121212]"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
