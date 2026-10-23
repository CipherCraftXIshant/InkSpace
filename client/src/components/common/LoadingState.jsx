import React from 'react';

/**
 * Editorial loading state with subtle shimmer skeletons or a minimal spinner.
 */
export default function LoadingState({
  variant = 'spinner', // 'spinner' | 'cards' | 'article'
  count = 3,
  message = 'Loading...',
  className = '',
}) {
  if (variant === 'spinner') {
    return (
      <div
        className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="w-8 h-8 rounded-full border-2 border-[#121212] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-medium text-[#737373] tracking-wider uppercase">
          {message}
        </p>
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}
        role="status"
        aria-label="Loading content"
      >
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col animate-pulse rounded-lg overflow-hidden border border-[#EBEBEB] bg-white p-4"
          >
            <div className="aspect-16/10 bg-[#E5E5E5] rounded-md mb-4" />
            <div className="h-3 w-20 bg-[#E5E5E5] rounded-full mb-3" />
            <div className="h-5 w-4/5 bg-[#E5E5E5] rounded mb-2" />
            <div className="h-4 w-full bg-[#F0F0F0] rounded mb-4" />
            <div className="mt-auto flex items-center gap-2 pt-3 border-t border-[#F5F5F5]">
              <div className="w-6 h-6 rounded-full bg-[#E5E5E5]" />
              <div className="h-3 w-24 bg-[#E5E5E5] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'article') {
    return (
      <div className={`max-w-3xl mx-auto py-12 animate-pulse ${className}`} role="status">
        <div className="h-4 w-28 bg-[#E5E5E5] rounded-full mb-6" />
        <div className="h-10 w-3/4 bg-[#E5E5E5] rounded mb-4" />
        <div className="h-5 w-2/3 bg-[#F0F0F0] rounded mb-8" />
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-[#E5E5E5]">
          <div className="w-10 h-10 rounded-full bg-[#E5E5E5]" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 bg-[#E5E5E5] rounded" />
            <div className="h-3 w-20 bg-[#F0F0F0] rounded" />
          </div>
        </div>
        <div className="aspect-16/9 bg-[#E5E5E5] rounded-lg mb-8" />
        <div className="space-y-3">
          <div className="h-4 bg-[#F0F0F0] rounded w-full" />
          <div className="h-4 bg-[#F0F0F0] rounded w-11/12" />
          <div className="h-4 bg-[#F0F0F0] rounded w-4/5" />
        </div>
      </div>
    );
  }

  return null;
}
