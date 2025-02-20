'use client';

import { useEffect, useState } from 'react';
import MenuSection from './MenuSection';
import CategoryBar from './CategoryBar';
import { Language } from '../types/common';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { MenuSection as MenuSectionType, MenuCategory } from '../types/menu';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

interface MenuContentProps {
  lang: Language;
}

export default function MenuContent({ lang }: MenuContentProps) {
  const [menuItems, setMenuItems] = useState<MenuSectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setError(null);
        const response = await fetch('/api/menu', {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch menu items';
        console.error('Failed to fetch menu items:', err);
        setError(errorMessage);
        toast.error('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  const sections = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(section => section.category === selectedCategory);

  const categories = Array.from(new Set(menuItems.map(item => item.category))) as MenuCategory[];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-center" />
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        currentLanguage={lang}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
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