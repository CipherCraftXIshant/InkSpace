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
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#121212]';

  const variants = {
    primary:
      'bg-[#121212] text-white border border-[#121212] hover:bg-[#2A2A2A] active:bg-black shadow-xs',
    secondary:
      'bg-white text-[#121212] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] active:bg-[#F3F4F6] shadow-2xs',
    outline:
      'bg-transparent text-[#121212] border border-[#121212] hover:bg-[#121212] hover:text-white active:bg-black',
    ghost:
      'bg-transparent text-[#4A4A4A] hover:text-[#121212] hover:bg-black/5 active:bg-black/10',
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
