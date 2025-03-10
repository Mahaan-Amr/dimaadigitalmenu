'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';
import AdminOnboarding from '../../components/AdminOnboarding';
import type { MenuItem, MenuSection, MenuCategory } from '../../types/menu';

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

const categories: MenuCategory[] = [
  'cold-brews',
  'cake-desserts',
  'hot-coffee',
  'cold-coffee',
  'herbal-tea',
  'hot-drinks',
  'mocktails',
  'smoothies',
  'milkshakes',
  'breakfast'
];

export default function AdminPage() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchMenuItems();
    
    // Check if we should show onboarding
    const hasSeenOnboarding = localStorage.getItem('adminOnboardingCompleted') === 'true';
    setShowOnboarding(!hasSeenOnboarding);
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
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
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('Failed to save menu item');
      }

      await fetchMenuItems();
      setIsEditing(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch('/api/menu', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      await fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
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
                          <option key={category} value={category}>
                            {category}
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
                            onClick={() => handleDelete(item.id)}
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