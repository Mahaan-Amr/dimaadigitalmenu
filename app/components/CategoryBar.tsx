'use client';

import React from 'react';
import { MenuCategory } from '../types/menu';
import { Language } from '../types/common';

interface CategoryBarProps {
  categories: MenuCategory[];
  selectedCategory: MenuCategory | null;
  onSelectCategory: (category: MenuCategory) => void;
  currentLanguage: Language;
}

const categoryNames: Record<string, Record<Language, string>> = {
  'breakfast': { en: 'Breakfast', fa: 'صبحانه' },
  'hot-coffee': { en: 'Hot Coffee', fa: 'قهوه گرم' },
  'cold-coffee': { en: 'Cold Coffee', fa: 'قهوه سرد' },
  'mocktails': { en: 'Mocktails', fa: 'موکتل‌ها' },
  'smoothies': { en: 'Smoothies', fa: 'اسموتی‌ها' },
  'milkshakes': { en: 'Milkshakes', fa: 'میلک‌شیک‌ها' },
  'hot-drinks': { en: 'Hot Drinks', fa: 'نوشیدنی‌های گرم' },
  'cold-brews': { en: 'Cold Brews', fa: 'دمنوش سرد' },
  'herbal-tea': { en: 'Herbal Tea', fa: 'دمنوش' },
  'cake-desserts': { en: 'Cakes & Desserts', fa: 'کیک و دسر' },
  'all': { en: 'All', fa: 'همه' }
};

export default function CategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
  currentLanguage,
}: CategoryBarProps) {
  return (
    <div className="overflow-x-auto flex space-x-6 py-6 px-6 scrollbar-hide">
      <button
        key="all"
        onClick={() => onSelectCategory('all')}
        className={`flex-none px-6 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap shadow-sm hover:shadow-md ${
          selectedCategory === 'all'
            ? 'bg-primary-600 text-white shadow-primary-200 dark:shadow-primary-900'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        {categoryNames.all[currentLanguage]}
      </button>
      {categories.filter(cat => cat !== 'all').map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`flex-none px-6 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap shadow-sm hover:shadow-md ${
            selectedCategory === category
              ? 'bg-primary-600 text-white shadow-primary-200 dark:shadow-primary-900'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {categoryNames[category]?.[currentLanguage] || category}
        </button>
      ))}
    </div>
  );
} 