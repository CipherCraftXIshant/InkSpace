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
  Laptop,
  Palette,
  Coffee,
  Briefcase,
  Compass,
  BookOpen,
};

/**
 * Editorial Category Card used in the category ribbon.
 */
export default function CategoryCard({ category, className = '' }) {
  if (!category) return null;

  const IconComponent = ICON_MAP[category.icon] || Folder;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={`group flex flex-col items-center justify-center p-5 sm:p-6 bg-white rounded-xl border border-[#ECECE8] hover:border-[#121212] transition-all duration-200 text-center shadow-2xs hover:shadow-xs ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-[#FAF9F5] flex items-center justify-center text-[#4A4A4A] group-hover:text-[#121212] group-hover:bg-[#F3F2EE] transition-colors mb-3">
        <IconComponent className="w-5 h-5 stroke-[1.6]" />
      </div>

      <h4 className="text-sm font-semibold text-[#121212] mb-1 group-hover:text-black">
        {category.name}
      </h4>

      <p className="text-xs text-[#8A8A8A]">
        {category.count} Articles
      </p>
    </Link>
  );
}
