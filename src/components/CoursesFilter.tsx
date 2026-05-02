"use client";

import { Search } from 'lucide-react';

interface FilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
}

export default function CoursesFilter({
  categories,
  activeCategory,
  onCategoryChange,
  onSearchChange
}: FilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Categories */}
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        <button
          onClick={() => onCategoryChange('All')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === 'All'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          All Courses
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === category
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full md:w-80">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search courses..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
        />
      </div>
    </div>
  );
}
