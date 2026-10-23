import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Accessible Icon Button for action bars, toolbars, and search triggers.
 */
export default function IconButton({
  icon: Icon,
  label,
  variant = 'ghost', // 'ghost' | 'secondary' | 'outline' | 'primary'
  size = 'md', // 'sm' | 'md' | 'lg'
  to,
  href,
  className = '',
  disabled = false,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#121212]';

  const variants = {
    ghost: 'bg-transparent text-[#4A4A4A] hover:text-[#121212] hover:bg-black/5 active:bg-black/10',
    secondary: 'bg-white text-[#121212] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] shadow-2xs',
    outline: 'bg-transparent text-[#121212] border border-[#E5E7EB] hover:border-[#121212] hover:bg-black/5',
    primary: 'bg-[#121212] text-white hover:bg-[#2A2A2A]',
  };

  const sizes = {
    sm: 'w-7 h-7 p-1',
    md: 'w-9 h-9 p-2',
    lg: 'w-11 h-11 p-2.5',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const finalClasses = `${baseClasses} ${variants[variant] || variants.ghost} ${sizes[size] || sizes.md} ${className}`;

  const content = Icon ? <Icon className={iconSizes[size] || iconSizes.md} aria-hidden="true" /> : null;

  if (to) {
    return (
      <Link to={to} className={finalClasses} aria-label={label} title={label} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={finalClasses} aria-label={label} title={label} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={finalClasses}
      aria-label={label}
      title={label}
      {...props}
    >
      {content}
    </button>
  );
}
