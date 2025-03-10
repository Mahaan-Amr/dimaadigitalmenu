'use client';

import React from 'react';
import { MenuCategory, ALL_CATEGORY } from '../types/menu';
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
        key={ALL_CATEGORY}
        onClick={() => onSelectCategory(ALL_CATEGORY)}
        className={`flex-none px-6 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap shadow-sm hover:shadow-md ${
          selectedCategory === ALL_CATEGORY
            ? 'bg-primary-600 text-white shadow-primary-200 dark:shadow-primary-900'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        {categoryNames.all?.[currentLanguage] || (currentLanguage === 'fa' ? 'همه' : 'All')}
      </button>
      {categories.filter(cat => cat !== ALL_CATEGORY).map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`flex-none px-6 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap shadow-sm hover:shadow-md ${
            selectedCategory === category
              ? 'bg-primary-600 text-white shadow-primary-200 dark:shadow-primary-900'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {categoryNames[category]?.[currentLanguage] || formatCategoryName(category, currentLanguage)}
        </button>
      ))}
    </div>
  );
}

// Helper function to format category names that aren't in the predefined list
function formatCategoryName(category: string, language: Language): string {
  // For English, capitalize each word and replace hyphens with spaces
  if (language === 'en') {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // For Farsi, just return the category as is (should be translated in the future)
  return category;
} 