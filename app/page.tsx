'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import CategoryBar from './components/CategoryBar';
import type { MenuSection as MenuSectionType } from './types/menu';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
  </div>
);

export default function Home() {
  const { language } = useLanguage();
  const [sections, setSections] = useState<MenuSectionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Set RTL direction for Farsi
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setError(null);
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setSections(data);
        // Set the first category as selected by default
        if (data.length > 0) {
          setSelectedCategory(data[0].category);
        }
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        setError('Failed to load menu items. Please try again later.');
        toast.error('Failed to load menu items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const categories = sections.map(section => section.category);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Toaster position="top-center" />
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSpinner />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-64"
            >
              <p className="text-red-500 dark:text-red-400">{error}</p>
            </motion.div>
          ) : sections.length === 0 ? (
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
              key="content"
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-12"
            >
              {sections.map((section) => (
                <motion.div
                  key={section.category}
                  id={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <MenuSection section={section} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
