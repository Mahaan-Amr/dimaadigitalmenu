'use client';

import { useState, useEffect } from 'react';
import MenuSection from './MenuSection';
import CategoryBar from './CategoryBar';
import { Language } from '../types/common';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { MenuSection as MenuSectionType, MenuCategory } from '../types/menu';
import ParticleBackground from './ParticleBackground';

interface ClientPageProps {
  initialMenuItems: MenuSectionType[];
  lang: Language;
}

export default function ClientPage({ initialMenuItems, lang }: ClientPageProps) {
  console.log('[ClientPage] Initializing with language:', lang);
  console.log('[ClientPage] Initial menu items:', initialMenuItems.length, 'sections');

  const [menuItems] = useState<MenuSectionType[]>(initialMenuItems);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');

  // Apply background styling when the component mounts
  useEffect(() => {
    console.log('[ClientPage] Setting document direction for language:', lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    
    // No longer forcing dark background colors since we're using Tailwind's theme system
    console.log('[ClientPage] Document direction set');
    
    return () => {
      // Cleanup if needed
    };
  }, [lang]);

  const sections = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(section => section.category === selectedCategory);

  console.log('[ClientPage] Filtered sections:', sections.length, 'for category:', selectedCategory);

  const categories = Array.from(new Set(menuItems.map(item => item.category))) as MenuCategory[];
  console.log('[ClientPage] Available categories:', categories);

  return (
    <main className="min-h-screen relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Particle animation background */}
      <ParticleBackground category={selectedCategory} />
      
      <Toaster position="top-center" />
      <div className="fixed top-16 left-0 right-0 z-40 bg-transparent backdrop-blur-sm">
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => {
            console.log('[ClientPage] Category selected:', category);
            setSelectedCategory(category);
          }}
          currentLanguage={lang}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 relative z-10"
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
              className="space-y-24"
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