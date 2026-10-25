import React from 'react';
import { FileQuestion } from 'lucide-react';
import Button from './Button.jsx';

/**
 * Editorial Empty State component.
 */
export default function EmptyState({
  icon: Icon = FileQuestion,
  title = 'No stories found',
  description = 'We could not find any stories matching your selection.',
  actionText,
  actionTo,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#F4F4F5] dark:bg-[#202024] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] mb-4">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl text-[#121212] dark:text-[#F4F4F6] font-medium mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#737373] dark:text-[#A1A1AA] leading-relaxed mb-6 font-normal">
        {description}
      </p>
      {actionText && (
        <Button
          variant="secondary"
          size="sm"
          to={actionTo}
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
