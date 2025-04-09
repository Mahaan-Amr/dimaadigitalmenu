'use client';

import { useEffect, useState } from 'react';
import MenuItem from './MenuItem';
import type { MenuSection as MenuSectionType, Category } from '../types/menu';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface MenuSectionProps {
  section: MenuSectionType;
  currentLanguage: 'en' | 'fa';
}

export default function MenuSection({ section, currentLanguage }: MenuSectionProps) {
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  // Fetch category data when component mounts
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

  // Format category name for display
  const formatCategoryName = (categoryId: string): string => {
    // Find the category in our data
    const category = categoryData.find(cat => cat.id === categoryId);
    
    if (category) {
      return category.name[currentLanguage];
    }
    
    // Otherwise, format the custom category name as a fallback
    if (currentLanguage === 'en') {
      return categoryId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return categoryId; // Fallback for Farsi
  };

  // Safely get section items, ensuring it's an array
  const items = Array.isArray(section.items) ? section.items : [];

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10
      }
    }
  };

  const gridVariants = {
    open: { 
      height: "auto",
      opacity: 1,
      transition: { 
        staggerChildren: 0.07, 
        delayChildren: 0.1,
        duration: 0.3 
      }
    },
    closed: { 
      height: 0,
      opacity: 0,
      transition: { 
        staggerChildren: 0.05, 
        staggerDirection: -1,
        duration: 0.3 
      }
    }
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      className="py-8 border-b border-gray-200 dark:border-gray-700 last:border-0"
    >
      <motion.div
        layout
        className="flex items-center justify-between mb-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.h2
          variants={headerVariants}
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          {formatCategoryName(section.category)}
        </motion.h2>
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500 dark:text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={gridVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                variants={{
                  open: { 
                    opacity: 1, 
                    y: 0,
                    transition: { type: "spring", stiffness: 300, damping: 24 }
                  },
                  closed: { opacity: 0, y: 20 }
                }}
                custom={index}
              >
                <MenuItem item={item} currentLanguage={currentLanguage} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
} 