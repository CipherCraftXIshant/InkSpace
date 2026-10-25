import React from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Palette,
  Coffee,
  Briefcase,
  Compass,
  BookOpen,
  Folder,
} from 'lucide-react';

const ICON_MAP = {
  laptop: Laptop,
  palette: Palette,
  coffee: Coffee,
  briefcase: Briefcase,
  compass: Compass,
  'book-open': BookOpen,
  technology: Laptop,
  design: Palette,
  lifestyle: Coffee,
  business: Briefcase,
  travel: Compass,
  culture: BookOpen,
};

/**
 * Editorial Category Card used in the category ribbon.
 */
export default function CategoryCard({ category, className = '' }) {
  if (!category) return null;

  const IconComponent =
    ICON_MAP[category.icon] ||
    ICON_MAP[category.slug?.toLowerCase()] ||
    Folder;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={`group flex flex-col items-center justify-center p-5 sm:p-6 bg-white dark:bg-[#18181B] rounded-xl border border-[#ECECE8] dark:border-[#27272A] hover:border-[#121212] dark:hover:border-white transition-all duration-200 text-center shadow-2xs hover:shadow-xs ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-[#FAF9F5] dark:bg-[#27272A] flex items-center justify-center text-[#4A4A4A] dark:text-[#D4D4D8] group-hover:text-[#121212] dark:group-hover:text-white group-hover:bg-[#F3F2EE] dark:group-hover:bg-[#3F3F46] transition-colors mb-3">
        <IconComponent className="w-5 h-5 stroke-[1.6]" />
      </div>

      <h4 className="text-sm font-semibold text-[#121212] dark:text-[#F4F4F6] mb-1 group-hover:text-black dark:group-hover:text-white">
        {category.name}
      </h4>

      <p className="text-xs text-[#8A8A8A] dark:text-[#71717A]">
        {category.count} Articles
      </p>
    </Link>
  );
}
