'use client';

import { useState } from 'react';
import MenuSection from '../components/MenuSection';
import CategoryBar from '../components/CategoryBar';
import { Language } from '../types/common';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { MenuSection as MenuSectionType, MenuCategory } from '../types/menu';

interface ClientPageProps {
  initialMenuItems: MenuSectionType[];
  lang: Language;
}

export default function ClientPage({ initialMenuItems, lang }: ClientPageProps) {
  const [menuItems] = useState<MenuSectionType[]>(initialMenuItems);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');

  const sections = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(section => section.category === selectedCategory);

  const categories = Array.from(new Set(menuItems.map(item => item.category))) as MenuCategory[];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-center" />
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          currentLanguage={lang}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32"
      >
        <AnimatePresence mode="wait">
          {sections.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-64"
            >
              <p className="text-gray-500 dark:text-gray-400">
                No menu items available
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {sections.map(section => (
                <MenuSection
                  key={section.category}
                  section={section}
                  currentLanguage={lang}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
} 