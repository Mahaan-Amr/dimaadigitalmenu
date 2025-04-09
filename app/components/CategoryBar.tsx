'use client';

import React, { useEffect, useState } from 'react';
import { MenuCategory, ALL_CATEGORY, Category } from '../types/menu';
import { Language } from '../types/common';

interface CategoryBarProps {
  categories: MenuCategory[];
  selectedCategory: MenuCategory | null;
  onSelectCategory: (category: MenuCategory) => void;
  currentLanguage: Language;
}

// Fallback translations for the "All" category
const allCategoryNames = { en: 'All', fa: 'همه' };

export default function CategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
  currentLanguage,
}: CategoryBarProps) {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  
  // Fetch category data with translations when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          if (data.categories && Array.isArray(data.categories)) {
            setCategoryData(data.categories);
          }
        }
      } catch (error) {
        console.error('Failed to fetch category translations:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Helper function to get the category name in the current language
  const getCategoryName = (categoryId: string): string => {
    // Special case for the "All" category
    if (categoryId === ALL_CATEGORY) {
      return allCategoryNames[currentLanguage];
    }
    
    // Find the category in our data
    const category = categoryData.find(cat => cat.id === categoryId);
    
    if (category) {
      return category.name[currentLanguage];
    }
    
    // Fallback to formatted category id if not found
    return formatCategoryName(categoryId, currentLanguage);
  };

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
        {allCategoryNames[currentLanguage]}
      </button>
      {categories.filter(cat => cat !== ALL_CATEGORY).map((categoryId) => (
        <button
          key={categoryId}
          onClick={() => onSelectCategory(categoryId)}
          className={`flex-none px-6 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap shadow-sm hover:shadow-md ${
            selectedCategory === categoryId
              ? 'bg-primary-600 text-white shadow-primary-200 dark:shadow-primary-900'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {getCategoryName(categoryId)}
        </button>
      ))}
    </div>
  );
}

// Helper function to format category names that aren't in our data
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