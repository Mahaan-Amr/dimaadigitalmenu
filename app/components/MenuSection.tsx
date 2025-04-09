'use client';

import MenuItem from './MenuItem';
import type { MenuSection as MenuSectionType } from '../types/menu';
import { motion } from 'framer-motion';

interface MenuSectionProps {
  section: MenuSectionType;
  currentLanguage: 'en' | 'fa';
}

export default function MenuSection({ section, currentLanguage }: MenuSectionProps) {
  // Predefined category names
  const categoryNames = {
    'breakfast': { en: 'Breakfast', fa: 'صبحانه' },
    'hot-coffee': { en: 'Hot Coffee', fa: 'قهوه گرم' },
    'cold-coffee': { en: 'Cold Coffee', fa: 'قهوه سرد' },
    'mocktails': { en: 'Mocktails', fa: 'موکتل‌ها' },
    'smoothies': { en: 'Smoothies', fa: 'اسموتی‌ها' },
    'milkshakes': { en: 'Milkshakes', fa: 'میلک‌شیک‌ها' },
    'hot-drinks': { en: 'Hot Drinks', fa: 'نوشیدنی‌های گرم' },
    'cold-brews': { en: 'Cold Brews', fa: 'دمنوش سرد' },
    'herbal-tea': { en: 'Herbal Tea', fa: 'دمنوش' },
    'cake-desserts': { en: 'Cakes & Desserts', fa: 'کیک و دسر' }
  };

  // Format category name for display
  const formatCategoryName = (category: string): string => {
    // If category exists in predefined names, use those translations
    if (categoryNames[category as keyof typeof categoryNames]?.[currentLanguage]) {
      return categoryNames[category as keyof typeof categoryNames][currentLanguage];
    }
    
    // Otherwise, format the custom category name nicely
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Safely get section items, ensuring it's an array
  const items = Array.isArray(section.items) ? section.items : [];

  return (
    <section>
      <motion.h2
        layout
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {formatCategoryName(section.category)}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} currentLanguage={currentLanguage} />
        ))}
      </div>
    </section>
  );
} 