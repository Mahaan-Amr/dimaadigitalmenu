'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MenuItem as MenuItemType } from '../types/menu';
import { motion } from 'framer-motion';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { y: -5, scale: 1.02, transition: { duration: 0.2 } },
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
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle case where item might not have content in the current language
  const itemName = item.name?.[currentLanguage] || '';
  const itemDescription = item.description?.[currentLanguage] || '';
  const itemIngredients = item.ingredients?.[currentLanguage] || [];
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
        <img
          src={item.image}
          alt={itemName}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      );
    }

    // For other images, use Next.js Image component
    return (
      <Image
        src={item.image}
        alt={itemName}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
        unoptimized
      />
    );
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {renderImage()}
        
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium px-4 py-2 bg-red-500 rounded-full">
              {currentLanguage === 'fa' ? 'ناموجود' : 'Not Available'}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {itemName}
        </h3>
        
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {itemDescription}
        </p>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(itemPrice, currentLanguage)}
          </span>
          
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {item.calories} cal
          </span>
        </div>
        
        {itemIngredients.length > 0 && (
          <>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:underline focus:outline-none flex items-center gap-1"
            >
              {currentLanguage === 'fa' ? 'مواد تشکیل دهنده' : 'Ingredients'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            
            {showDetails && (
              <div className="mt-2">
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  {itemIngredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
} 