'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';
import AdminOnboarding from '../../components/AdminOnboarding';
import { MenuItem, MenuSection, MenuCategory, PREDEFINED_CATEGORIES } from '../../types/menu';

// Interface for category with bilingual names
interface Category {
  id: string;
  name: {
    en: string;
    fa: string;
  };
}

const emptyMenuItem: MenuItem = {
  id: '',
  category: 'hot-coffee',
  name: { fa: '', en: '' },
  description: { fa: '', en: '' },
  ingredients: { fa: [], en: [] },
  calories: 0,
  price: { fa: '', en: '' },
  image: '',
  isAvailable: true,
  onlyShowIn: undefined
};

// Start with predefined categories, but allow for adding custom ones
const initialCategories: Category[] = PREDEFINED_CATEGORIES.map(id => ({
  id,
  name: {
    en: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
    fa: id // Default placeholder, will be replaced from API
  }
}));

export default function AdminPage() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState<{id: string, name: {en: string, fa: string}}>({
    id: '',
    name: { en: '', fa: '' }
  });
  const [draggingCategory, setDraggingCategory] = useState<string | null>(null);
  const [predefinedCategories, setPredefinedCategories] = useState<string[]>([...PREDEFINED_CATEGORIES]);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
    
    // Check if we should show onboarding
    const hasSeenOnboarding = localStorage.getItem('adminOnboardingCompleted') === 'true';
    setShowOnboarding(!hasSeenOnboarding);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
      
      if (data.predefinedCategories && Array.isArray(data.predefinedCategories)) {
        setPredefinedCategories(data.predefinedCategories);
      }
    } catch (error) {
      console.error('[Admin] Failed to fetch categories:', error);
      // Fall back to predefined categories
      setCategories(initialCategories);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('[Admin] Failed to fetch menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedItem({ ...emptyMenuItem, id: Date.now().toString() });
    setIsEditing(true);
  };

  const handleSave = async (item: MenuItem) => {
    try {
      console.log('[Admin] Saving menu item:', JSON.stringify(item, null, 2));
      
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Admin] Server error response:', errorData);
        throw new Error(`Failed to save menu item: ${response.status} ${response.statusText}`);
      }

      await fetchMenuItems();
      setIsEditing(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('[Admin] Error saving menu item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('[Admin] Attempting to delete item with ID:', id);
      
      const response = await fetch('/api/menu', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      console.log('[Admin] Delete response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Admin] Delete error response:', errorData);
        throw new Error(`Failed to delete menu item: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('[Admin] Delete success response:', result);
      
      await fetchMenuItems();
      alert('Item deleted successfully');
    } catch (error) {
      console.error('[Admin] Error deleting menu item:', error);
      console.error('[Admin] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      alert('Failed to delete item. Please check console for details.');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleAddCategory = async () => {
    if (
      newCategory.name.en.trim() && 
      newCategory.name.fa.trim() && 
      !categories.some(cat => cat.id === newCategory.id.trim() || 
                              cat.name.en.toLowerCase() === newCategory.name.en.toLowerCase().trim())
    ) {
      // Generate a slug ID from the English name if not provided
      const categoryId = newCategory.id.trim() || 
                        newCategory.name.en.toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[^a-z0-9-]/g, '');
      
      // Create new category object
      const categoryToAdd: Category = {
        id: categoryId,
        name: {
          en: newCategory.name.en.trim(),
          fa: newCategory.name.fa.trim()
        }
      };
      
      // Add the new category to our local state
      const updatedCategories = [...categories, categoryToAdd];
      setCategories(updatedCategories);
      
      // Reset the input fields
      setNewCategory({
        id: '',
        name: { en: '', fa: '' }
      });
      
      // Save to the API
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categories: updatedCategories }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update categories: ${response.status} ${response.statusText}`);
        }
        
        // Refresh categories from API
        await fetchCategories();
        await fetchMenuItems();
      } catch (error) {
        console.error('[Admin] Failed to save categories:', error);
      }
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    // Check if the category is a predefined one
    if (predefinedCategories.includes(categoryId)) {
      // Don't allow removing predefined categories
      return;
    }
    
    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.status} ${response.statusText}`);
      }
      
      // Remove the category from local state
      setCategories(prev => prev.filter(category => category.id !== categoryId));
      
      // Refresh data
      await fetchCategories();
      await fetchMenuItems();
    } catch (error) {
      console.error('[Admin] Failed to delete category:', error);
    }
  };

  const handleReorderCategories = async (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: updatedCategories }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reorder categories: ${response.status} ${response.statusText}`);
      }
      
      await fetchMenuItems();
    } catch (error) {
      console.error('[Admin] Failed to reorder categories:', error);
      // Revert to previous state if failed
      await fetchCategories();
    }
  };

  const handleDragStart = (categoryId: string) => {
    setDraggingCategory(categoryId);
  };

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    
    if (!draggingCategory || draggingCategory === categoryId) {
      return;
    }
    
    // Move the category in the array
    const updatedCategories = [...categories];
    const draggedIndex = updatedCategories.findIndex(cat => cat.id === draggingCategory);
    const targetIndex = updatedCategories.findIndex(cat => cat.id === categoryId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedCategory] = updatedCategories.splice(draggedIndex, 1);
      updatedCategories.splice(targetIndex, 0, draggedCategory);
      setCategories(updatedCategories);
    }
  };

  const handleDragEnd = () => {
    if (draggingCategory) {
      handleReorderCategories(categories);
      setDraggingCategory(null);
    }
  };

  const handleIngredientsChange = (
    lang: 'en' | 'fa',
    value: string,
    item: MenuItem
  ) => {
    const ingredients = value.split(',').map((i) => i.trim());
    setSelectedItem({
      ...item,
      ingredients: {
        ...item.ingredients,
        [lang]: ingredients,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {showOnboarding && <AdminOnboarding onClose={() => setShowOnboarding(false)} />}
      
      {/* Category Management Modal */}
      <AnimatePresence>
        {isManagingCategories && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Manage Categories
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add New Category
                </label>
                <div className="space-y-3">
                  {/* Optional category ID (slug) */}
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Category ID (optional - will be generated from English name)
                    </label>
                    <input
                      type="text"
                      value={newCategory.id}
                      onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="e.g. hot-coffee, cake-desserts"
                    />
                  </div>
                  
                  {/* English name input */}
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      English Name
                    </label>
                    <input
                      type="text"
                      value={newCategory.name.en}
                      onChange={(e) => setNewCategory({
                        ...newCategory, 
                        name: {...newCategory.name, en: e.target.value}
                      })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Hot Coffee"
                    />
                  </div>
                  
                  {/* Farsi name input */}
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Farsi Name
                    </label>
                    <input
                      type="text"
                      value={newCategory.name.fa}
                      onChange={(e) => setNewCategory({
                        ...newCategory,
                        name: {...newCategory.name, fa: e.target.value}
                      })}
                      dir="rtl"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="قهوه گرم"
                    />
                  </div>
                  
                  <button
                    onClick={handleAddCategory}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    disabled={!newCategory.name.en.trim() || !newCategory.name.fa.trim()}
                  >
                    Add Category
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Current Categories <span className="text-sm text-gray-500">(Drag to reorder)</span>
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      draggable
                      onDragStart={() => handleDragStart(category.id)}
                      onDragOver={(e) => handleDragOver(e, category.id)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center justify-between p-2 rounded-md ${
                        draggingCategory === category.id 
                          ? 'bg-blue-100 dark:bg-blue-900' 
                          : 'bg-gray-50 dark:bg-gray-700'
                      } cursor-grab`}
                    >
                      <span className="text-gray-700 dark:text-gray-300 flex items-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 mr-2 text-gray-400" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <div className="flex flex-col">
                          <span>{category.name.en}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">{category.name.fa}</span>
                        </div>
                        {predefinedCategories.includes(category.id) && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </span>
                      {!predefinedCategories.includes(category.id) && (
                        <button
                          onClick={() => handleRemoveCategory(category.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove category"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setIsManagingCategories(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Menu Administration
            </h1>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateNew}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add New Item
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsManagingCategories(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Manage Categories
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowOnboarding(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                راهنما
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Logout
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isEditing && selectedItem && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                {/* Language visibility section */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
                  <h3 className="text-lg font-semibold mb-2">مشخص کردن زبان های نمایش</h3>
                  <p className="text-gray-700 mb-4">
                    تعیین کنید این آیتم در کدام منو(ها) نمایش داده شود. اگر فقط یک گزینه را انتخاب کنید، آیتم فقط در آن زبان نمایش داده می‌شود.
                  </p>
                  
                  <div className="flex space-x-8 space-x-reverse">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showInEnglish"
                        checked={!selectedItem.onlyShowIn || selectedItem.onlyShowIn.includes('en')}
                        onChange={(e) => {
                          const showInFarsi = !selectedItem.onlyShowIn || selectedItem.onlyShowIn.includes('fa');
                          const showInEnglish = e.target.checked;
                          
                          let onlyShowIn: ('en' | 'fa')[] | undefined = undefined;
                          
                          if (showInEnglish && showInFarsi) {
                            // Show in both languages
                            onlyShowIn = undefined;
                          } else if (showInEnglish) {
                            // Show only in English
                            onlyShowIn = ['en'];
                          } else if (showInFarsi) {
                            // Show only in Farsi
                            onlyShowIn = ['fa'];
                          } else {
                            // Default to both if none selected
                            onlyShowIn = undefined;
                          }
                          
                          setSelectedItem({
                            ...selectedItem,
                            onlyShowIn
                          });
                        }}
                        className="ml-2 w-5 h-5"
                      />
                      <label htmlFor="showInEnglish" className="text-base font-medium">
                        نمایش در منوی انگلیسی
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showInFarsi"
                        checked={!selectedItem.onlyShowIn || selectedItem.onlyShowIn.includes('fa')}
                        onChange={(e) => {
                          const showInEnglish = !selectedItem.onlyShowIn || selectedItem.onlyShowIn.includes('en');
                          const showInFarsi = e.target.checked;
                          
                          let onlyShowIn: ('en' | 'fa')[] | undefined = undefined;
                          
                          if (showInEnglish && showInFarsi) {
                            // Show in both languages
                            onlyShowIn = undefined;
                          } else if (showInEnglish) {
                            // Show only in English
                            onlyShowIn = ['en'];
                          } else if (showInFarsi) {
                            // Show only in Farsi
                            onlyShowIn = ['fa'];
                          } else {
                            // Default to both if none selected
                            onlyShowIn = undefined;
                          }
                          
                          setSelectedItem({
                            ...selectedItem,
                            onlyShowIn
                          });
                        }}
                        className="ml-2 w-5 h-5"
                      />
                      <label htmlFor="showInFarsi" className="text-base font-medium">
                        نمایش در منوی فارسی
                      </label>
                    </div>
                  </div>
                  
                  {(!selectedItem.onlyShowIn || (selectedItem.onlyShowIn.includes('en') && selectedItem.onlyShowIn.includes('fa'))) && (
                    <div className="mt-2 text-purple-700 text-sm font-medium py-1 px-2 bg-purple-50 rounded-md inline-block">
                      این آیتم در هر دو منوی فارسی و انگلیسی نمایش داده می‌شود
                    </div>
                  )}
                  
                  {selectedItem.onlyShowIn && selectedItem.onlyShowIn.length === 1 && selectedItem.onlyShowIn[0] === 'en' && (
                    <div className="mt-2 text-blue-700 text-sm font-medium py-1 px-2 bg-blue-50 rounded-md inline-block">
                      این آیتم فقط در منوی انگلیسی نمایش داده می‌شود
                    </div>
                  )}
                  
                  {selectedItem.onlyShowIn && selectedItem.onlyShowIn.length === 1 && selectedItem.onlyShowIn[0] === 'fa' && (
                    <div className="mt-2 text-green-700 text-sm font-medium py-1 px-2 bg-green-50 rounded-md inline-block">
                      این آیتم فقط در منوی فارسی نمایش داده می‌شود
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <select
                        value={selectedItem.category}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            category: e.target.value as MenuCategory,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name.en} / {category.name.fa}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name (English)
                      </label>
                      <input
                        type="text"
                        value={selectedItem.name.en}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            name: { ...selectedItem.name, en: e.target.value },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description (English)
                      </label>
                      <textarea
                        value={selectedItem.description.en}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            description: {
                              ...selectedItem.description,
                              en: e.target.value,
                            },
                          })
                        }
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ingredients (English, comma-separated)
                      </label>
                      <textarea
                        value={selectedItem.ingredients.en.join(', ')}
                        onChange={(e) =>
                          handleIngredientsChange('en', e.target.value, selectedItem)
                        }
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price (USD)
                      </label>
                      <input
                        type="text"
                        value={selectedItem.price.en}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            price: { ...selectedItem.price, en: e.target.value },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name (Farsi)
                      </label>
                      <input
                        type="text"
                        value={selectedItem.name.fa}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            name: { ...selectedItem.name, fa: e.target.value },
                          })
                        }
                        dir="rtl"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description (Farsi)
                      </label>
                      <textarea
                        value={selectedItem.description.fa}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            description: {
                              ...selectedItem.description,
                              fa: e.target.value,
                            },
                          })
                        }
                        dir="rtl"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ingredients (Farsi, comma-separated)
                      </label>
                      <textarea
                        value={selectedItem.ingredients.fa.join('، ')}
                        onChange={(e) =>
                          handleIngredientsChange('fa', e.target.value, selectedItem)
                        }
                        dir="rtl"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price (Toman)
                      </label>
                      <input
                        type="text"
                        value={selectedItem.price.fa}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            price: { ...selectedItem.price, fa: e.target.value },
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Calories
                      </label>
                      <input
                        type="number"
                        value={selectedItem.calories}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            calories: parseInt(e.target.value) || 0,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image
                  </label>
                  <ImageUpload
                    currentImage={selectedItem.image}
                    onImageUpload={(url) =>
                      setSelectedItem({ ...selectedItem, image: url })
                    }
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedItem.isAvailable}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Item is available
                    </span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedItem(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSave(selectedItem)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 space-y-6"
            >
              {sections.map((section) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {section.category}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {section.items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.name.en} / {item.name.fa}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description.en}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedItem(item);
                              setIsEditing(true);
                            }}
                            className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name.en}" / "${item.name.fa}"?`);
                              if (confirmDelete) {
                                console.log('[Admin UI] Delete button clicked for item:', item.id);
                                handleDelete(item.id);
                              }
                            }}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 