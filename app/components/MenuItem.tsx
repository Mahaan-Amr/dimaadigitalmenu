'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MenuItem as MenuItemType } from '../types/menu';
import { motion } from 'framer-motion';

// Enhanced animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.5 
    } 
  },
  hover: { 
    y: -8, 
    scale: 1.03, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 10
    } 
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

const imageVariants = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};

interface MenuItemProps {
  item: MenuItemType;
  currentLanguage: 'en' | 'fa';
}

function formatPrice(price: string, language: 'en' | 'fa'): string {
  if (language === 'fa') {
    return `${price} تومان`;
  }
  return `${price} Toman`;
}

export default function MenuItem({ item, currentLanguage }: MenuItemProps) {
  const [imageError, setImageError] = useState(false);

  // Handle case where item might not have content in the current language
  const itemName = item.name?.[currentLanguage] || '';
  const itemDescription = item.description?.[currentLanguage] || '';
  const itemPrice = item.price?.[currentLanguage] || '';

  // Skip rendering if item doesn't have a name in the current language
  if (!itemName) {
    return null;
  }

  // Safely render image or use default
  const renderImage = () => {
    if (imageError || !item.image || item.image.trim() === '') {
      return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">No image available</span>
        </div>
      );
    }

    // For local uploads, use regular img tag
    if (item.image.startsWith('/uploads/')) {
      return (
        <motion.img
          variants={imageVariants}
          src={item.image}
          alt={itemName}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      );
    }

    // For other images, use Next.js Image component
    return (
      <motion.div variants={imageVariants} className="relative h-full w-full">
        <Image
          src={item.image}
          alt={itemName}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          unoptimized
        />
      </motion.div>
    );
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      layoutId={`menu-item-${item.id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform-gpu"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {renderImage()}
        
        {!item.isAvailable && (
          <motion.div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span 
              className="text-white font-medium px-4 py-2 bg-red-500 rounded-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 15 
              }}
            >
              {currentLanguage === 'fa' ? 'ناموجود' : 'Not Available'}
            </motion.span>
          </motion.div>
        )}
      </div>
      
      <div className="p-4">
        <motion.h3 
          className="text-lg font-semibold text-gray-900 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {itemName}
        </motion.h3>
        
        <motion.p 
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {itemDescription}
        </motion.p>
        
        <motion.div 
          className="mt-2 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <motion.span 
            className="text-lg font-bold text-primary-600 dark:text-primary-400"
            whileHover={{ scale: 1.05 }}
          >
            {formatPrice(itemPrice, currentLanguage)}
          </motion.span>
          
          <motion.span 
            className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {item.calories} cal
          </motion.span>
        </motion.div>
        
      </div>
    </motion.div>
  );
} 