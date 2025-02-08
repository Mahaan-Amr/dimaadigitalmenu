'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { MenuItem as MenuItemType } from '../types/menu';
import { motion, AnimatePresence } from 'framer-motion';

// Base64 encoded placeholder image
const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjxwYXRoIGQ9Ik0xNjAgMTIwaDgwdjYwaC04MHoiIGZpbGw9IiM5Y2EzYWYiLz48Y2lyY2xlIGN4PSIxNDAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSIjOWNhM2FmIi8+PHBhdGggZD0iTTEyMCAxODBoMTYwdjIwSDEyMHoiIGZpbGw9IiM5Y2EzYWYiLz48L3N2Zz4=';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

const detailsVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

const ingredientVariants = {
  closed: {
    opacity: 0,
    x: -10,
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function MenuItem({ item }: { item: MenuItemType }) {
  const { language } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <motion.div variants={imageVariants} className="h-full w-full">
          <Image
            src={imageError || !item.image ? defaultImage : item.image}
            alt={item.name[language]}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        </motion.div>
        {!item.isAvailable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"
          >
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-white font-medium px-4 py-2 bg-red-500 rounded-full shadow-lg"
            >
              {language === 'fa' ? 'ناموجود' : 'Not Available'}
            </motion.span>
          </motion.div>
        )}
      </div>
      <div className="p-4">
        <motion.h3
          layout
          className="text-lg font-semibold text-gray-900 dark:text-white"
        >
          {item.name[language]}
        </motion.h3>
        <motion.p
          layout
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {item.description[language]}
        </motion.p>
        <motion.div
          layout
          className="mt-2 flex items-center justify-between"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-lg font-bold text-primary-600 dark:text-primary-400"
          >
            {language === 'fa'
              ? `${item.price.fa.toLocaleString()} تومان`
              : `$${item.price.en.toFixed(2)}`}
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
          >
            {item.calories} cal
          </motion.span>
        </motion.div>
        <motion.button
          layout
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:underline focus:outline-none flex items-center gap-1"
        >
          {language === 'fa' ? 'مواد تشکیل دهنده' : 'Ingredients'}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.button>
        <AnimatePresence>
          {showDetails && (
            <motion.div
              variants={detailsVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="mt-2 overflow-hidden"
            >
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {item.ingredients[language].map((ingredient, index) => (
                  <motion.li
                    key={index}
                    variants={ingredientVariants}
                    className="flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {ingredient}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 