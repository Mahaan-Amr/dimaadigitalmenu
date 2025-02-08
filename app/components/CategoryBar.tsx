'use client';

import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import type { MenuCategory } from '../types/menu';

const categoryTranslations = {
  'cold-brews': { en: 'Cold Brews', fa: 'دمنوش سرد' },
  'cake-desserts': { en: 'Cake & Desserts', fa: 'کیک و دسر' },
  'hot-coffee': { en: 'Hot Coffee Based', fa: 'نوشیدنی‌های گرم قهوه' },
  'cold-coffee': { en: 'Cold Coffee Based', fa: 'نوشیدنی‌های سرد قهوه' },
  'herbal-tea': { en: 'Herbal Tea', fa: 'دمنوش' },
  'hot-drinks': { en: 'Hot Drinks', fa: 'نوشیدنی‌های گرم' },
  mocktails: { en: 'Mocktails & Cold Drinks', fa: 'موکتل و نوشیدنی‌های سرد' },
  smoothies: { en: 'Smoothies', fa: 'اسموتی' },
  milkshakes: { en: 'Milk Shakes', fa: 'میلک‌شیک' },
  'food-salad': { en: 'Food & Salad', fa: 'غذا و سالاد' },
  breakfast: { en: 'Breakfast', fa: 'صبحانه' },
  'panini-sandwiches': { en: 'Panini & Sandwiches', fa: 'پنینی و ساندویچ' },
};

interface CategoryBarProps {
  categories: MenuCategory[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

export default function CategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) {
  const { language } = useLanguage();

  const scrollToCategory = (category: string) => {
    onSelectCategory(category);
    const element = document.getElementById(category);
    if (element) {
      const header = document.querySelector('header') as HTMLElement | null;
      const headerHeight = header?.offsetHeight || 0;
      const categoryBar = document.querySelector('.category-bar') as HTMLElement | null;
      const categoryBarHeight = categoryBar?.offsetHeight || 0;
      const top = element.offsetTop - headerHeight - categoryBarHeight - 20;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="category-bar sticky top-16 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto flex space-x-2 py-4 scrollbar-hide">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => scrollToCategory(category)}
              className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {categoryTranslations[category][language]}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
} 