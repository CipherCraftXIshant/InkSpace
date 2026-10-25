import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function ThemeToggle({ className = '', size = 'md' }) {
  const { isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4 sm:w-4.5 sm:h-4.5',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center justify-center rounded-lg border border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#27272A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white cursor-pointer ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {isDark ? (
        <Sun className={`${iconSizes[size] || iconSizes.md} stroke-[1.8] text-amber-400`} />
      ) : (
        <Moon className={`${iconSizes[size] || iconSizes.md} stroke-[1.8] text-[#4A4A4A]`} />
      )}
    </button>
  );
}
