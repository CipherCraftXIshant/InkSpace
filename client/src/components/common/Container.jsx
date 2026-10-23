import React from 'react';

/**
 * Centered responsive container component with consistent horizontal padding.
 */
export default function Container({
  children,
  className = '',
  size = 'default', // 'default' (max-w-7xl), 'narrow' (max-w-4xl), 'prose' (max-w-3xl), 'full'
  as: Component = 'div',
  ...props
}) {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    prose: 'max-w-3xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full',
  }[size] || 'max-w-7xl';

  return (
    <Component
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
