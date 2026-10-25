import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Editorial design system Button component.
 * Follows minimal, high-contrast monochrome aesthetics.
 */
export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  rounded = 'md', // 'md' | 'full'
  to,
  href,
  className = '',
  disabled = false,
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#121212] dark:focus-visible:ring-white';

  const variants = {
    primary:
      'bg-[#121212] text-white border border-[#121212] hover:bg-[#2A2A2A] dark:bg-white dark:text-[#121212] dark:border-white dark:hover:bg-zinc-200 active:bg-black shadow-xs',
    secondary:
      'bg-white dark:bg-[#18181B] text-[#121212] dark:text-[#F4F4F6] border border-[#E5E7EB] dark:border-[#27272A] hover:bg-[#F9FAFB] dark:hover:bg-[#27272A] hover:border-[#D1D5DB] dark:hover:border-zinc-500 shadow-2xs',
    outline:
      'bg-transparent text-[#121212] dark:text-[#F4F4F6] border border-[#121212] dark:border-zinc-400 hover:bg-[#121212] hover:text-white dark:hover:bg-white dark:hover:text-[#121212]',
    ghost:
      'bg-transparent text-[#4A4A4A] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10',
    danger:
      'bg-red-600 text-white border border-red-600 hover:bg-red-700 active:bg-red-800 shadow-xs',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  };

  const roundeds = {
    md: 'rounded-md',
    full: 'rounded-full',
  };

  const finalClasses = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${roundeds[rounded] || roundeds.md} ${className}`;

  const content = (
    <>
      {isLoading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      )}
      {!isLoading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={finalClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={finalClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={finalClasses}
      {...props}
    >
      {content}
    </button>
  );
}
