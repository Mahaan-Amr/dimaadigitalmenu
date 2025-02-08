'use client';

import { useLanguage } from '../context/LanguageContext';
import type { MenuSection as MenuSectionType } from '../types/menu';
import MenuItem from './MenuItem';
import { motion } from 'framer-motion';

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function MenuSection({ section }: { section: MenuSectionType }) {
  const { language } = useLanguage();

  return (
    <section className="py-8">
      <motion.h2
        initial={{ opacity: 0, x: language === 'fa' ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        className="text-3xl font-bold mb-8 text-gray-900 dark:text-white"
      >
        {categoryTranslations[section.category][language]}
      </motion.h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {section.items.map((menuItem, index) => (
          <motion.div
            key={menuItem.id}
            variants={itemAnimation}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: index * 0.1,
            }}
          >
            <MenuItem item={menuItem} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
} 