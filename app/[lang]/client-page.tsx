'use client';

import { useState, useEffect } from 'react';
import MenuSection from '../components/MenuSection';
import CategoryBar from '../components/CategoryBar';
import { Language } from '../types/common';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { MenuSection as MenuSectionType, MenuCategory, ALL_CATEGORY } from '../types/menu';

interface ClientPageProps {
  initialMenuItems: MenuSectionType[];
  lang: Language;
}

export default function ClientPage({ initialMenuItems, lang }: ClientPageProps) {
  const [menuItems] = useState<MenuSectionType[]>(initialMenuItems);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>(ALL_CATEGORY);

  // Log initialization for debugging
  useEffect(() => {
    console.log('🔍 ClientPage useEffect for background initialization running');
    
    // Apply background directly to document body and html
    document.body.style.backgroundColor = '#090A0F';
    document.documentElement.style.backgroundColor = '#090A0F';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  // Get color for background based on category
  const getBgColorForCategory = () => {
    switch (selectedCategory) {
      case "coffee-based": return "#664433";
      case "brewing-bar": return "#553322";
      case "smoothies": return "#993333";
      case "milkshakes": return "#553355";
      case "food-and-salad": return "#335533";
      case "cake-desserts": return "#773355";
      case "hot-drinks": return "#885533";
      case "mocktails": return "#335577";
      default: return "#111122";
    }
  };

  // Update background color when category changes
  useEffect(() => {
    // Change background color based on category
    const color = getBgColorForCategory();
    document.body.style.backgroundColor = color;
    document.documentElement.style.backgroundColor = color;
    
    console.log('🎨 Category changed to:', selectedCategory, 'with color:', color);
  }, [selectedCategory, getBgColorForCategory]);

  const sections = selectedCategory === ALL_CATEGORY
    ? menuItems
    : menuItems.filter(section => section.category === selectedCategory);

  const categories = Array.from(new Set(menuItems.map(item => item.category))) as MenuCategory[];

  console.log('⭐ Rendering ClientPage component with pattern and red dot');

  return (
    <main 
      className="min-h-screen overflow-hidden relative"
      style={{ 
        backgroundColor: getBgColorForCategory(),
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* Red indicator for visibility testing */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        width: '50px',
        height: '50px',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        boxShadow: '0 0 30px red',
      }} />

      {/* Toaster and content */}
      <Toaster position="top-center" />
      <div className="fixed top-16 left-0 right-0 z-40 bg-transparent backdrop-blur-sm">
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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10"
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
              <p className="text-gray-400">
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