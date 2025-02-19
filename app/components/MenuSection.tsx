'use client';

import MenuItem from './MenuItem';
import type { MenuSection as MenuSectionType } from '../types/menu';
import { motion } from 'framer-motion';

interface MenuSectionProps {
  section: MenuSectionType;
  currentLanguage: 'en' | 'fa';
}

export default function MenuSection({ section, currentLanguage }: MenuSectionProps) {
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

  return (
    <section>
      <motion.h2
        layout
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {categoryNames[section.category as keyof typeof categoryNames]?.[currentLanguage] || section.category}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {section.items.map((item) => (
          <MenuItem key={item.id} item={item} currentLanguage={currentLanguage} />
        ))}
      </div>
    </section>
  );
} 