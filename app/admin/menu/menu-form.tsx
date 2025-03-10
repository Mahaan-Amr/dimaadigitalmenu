'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageSpecificMenuItem, MenuCategory } from '@/app/types/menu';

const MENU_CATEGORIES: MenuCategory[] = [
  'breakfast',
  'hot-coffee',
  'cold-coffee',
  'mocktails',
  'smoothies',
  'milkshakes',
  'hot-drinks',
  'cold-brews',
  'herbal-tea',
  'cake-desserts'
];

type FormMode = 'add' | 'edit';

const defaultItem: LanguageSpecificMenuItem = {
  id: '',
  category: 'hot-coffee',
  name: {
    en: '',
    fa: ''
  },
  description: {
    en: '',
    fa: ''
  },
  ingredients: {
    en: [],
    fa: []
  },
  calories: 0,
  price: {
    en: '',
    fa: ''
  },
  image: '',
  isAvailable: true
};

interface MenuFormProps {
  itemId?: string;
  mode?: FormMode;
}

export default function MenuForm({ itemId, mode = 'add' }: MenuFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<LanguageSpecificMenuItem>({ ...defaultItem });
  const [ingredientsEn, setIngredientsEn] = useState('');
  const [ingredientsFa, setIngredientsFa] = useState('');
  const [error, setError] = useState('');
  const [showInEnglish, setShowInEnglish] = useState(true);
  const [showInFarsi, setShowInFarsi] = useState(true);

  useEffect(() => {
    if (mode === 'edit' && itemId) {
      fetchMenuItem(itemId);
    }
  }, [mode, itemId]);

  useEffect(() => {
    if (item.ingredients?.en) {
      setIngredientsEn(item.ingredients.en.join(', '));
    }
    if (item.ingredients?.fa) {
      setIngredientsFa(item.ingredients.fa.join(', '));
    }

    // Set language visibility based on item content
    setShowInEnglish(!!item.name?.en);
    setShowInFarsi(!!item.name?.fa);
  }, [item]);

  useEffect(() => {
    // Update onlyShowIn property based on language visibility
    const onlyShowIn: ('en' | 'fa')[] = [];
    if (showInEnglish) onlyShowIn.push('en');
    if (showInFarsi) onlyShowIn.push('fa');

    // Only set onlyShowIn if not showing in both languages
    if (onlyShowIn.length === 1) {
      setItem(prev => ({ ...prev, onlyShowIn }));
    } else {
      // If showing in both languages, remove onlyShowIn property
      setItem(prev => {
        const newItem = { ...prev };
        delete newItem.onlyShowIn;
        return newItem;
      });
    }
  }, [showInEnglish, showInFarsi]);

  const fetchMenuItem = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/menu/${id}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
      } else {
        setError('Failed to fetch menu item.');
      }
    } catch {
      // Error is caught but not used
      setError('An error occurred while fetching the menu item.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    language?: 'en' | 'fa'
  ) => {
    const { name, value } = e.target;

    if (language) {
      // Handle language-specific fields
      setItem(prev => {
        // Create a new object for the language-specific field
        let updatedField;
        
        if (name === 'name' && prev.name) {
          updatedField = { ...prev.name, [language]: value };
        } else if (name === 'description' && prev.description) {
          updatedField = { ...prev.description, [language]: value };
        } else if (name === 'price' && prev.price) {
          updatedField = { ...prev.price, [language]: value };
        } else {
          // Default case
          updatedField = { [language]: value };
        }
        
        return {
          ...prev,
          [name]: updatedField
        };
      });
    } else if (name === 'category') {
      setItem(prev => ({
        ...prev,
        [name]: value as MenuCategory
      }));
    } else if (name === 'calories') {
      setItem(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      // Handle non-language-specific fields
      setItem(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleIngredientsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>, 
    language: 'en' | 'fa'
  ) => {
    const value = e.target.value;
    if (language === 'en') {
      setIngredientsEn(value);
      // Split by comma and trim whitespace
      const ingredients = value.split(',').map(item => item.trim()).filter(Boolean);
      setItem(prev => ({
        ...prev,
        ingredients: {
          ...prev.ingredients,
          en: ingredients
        }
      }));
    } else {
      setIngredientsFa(value);
      const ingredients = value.split(',').map(item => item.trim()).filter(Boolean);
      setItem(prev => ({
        ...prev,
        ingredients: {
          ...prev.ingredients,
          fa: ingredients
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // If id is empty, generate a simple ID
      const submittingItem = {
        ...item,
        id: item.id || `${item.category}-${Date.now()}`
      };

      // Remove empty language fields
      if (!showInEnglish) {
        delete submittingItem.name.en;
        delete submittingItem.description.en;
        delete submittingItem.ingredients.en;
      }

      if (!showInFarsi) {
        delete submittingItem.name.fa;
        delete submittingItem.description.fa;
        delete submittingItem.ingredients.fa;
      }

      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submittingItem),
      });

      if (response.ok) {
        router.push('/admin/menu');
        router.refresh();
      } else {
        setError('Failed to save menu item.');
      }
    } catch {
      // Error is caught but not used
      setError('An error occurred while saving the menu item.');
    } finally {
      setLoading(false);
    }
  };

  // For isAvailable checkbox only
  const handleIsAvailableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem(prev => ({
      ...prev,
      isAvailable: e.target.checked
    }));
  };

  if (loading && mode === 'edit') {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">
        {mode === 'add' ? 'Add New Menu Item' : 'Edit Menu Item'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="md:w-1/2">
          <label className="block text-gray-700 mb-2">ID (Auto-generated if empty)</label>
          <input
            type="text"
            name="id"
            value={item.id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Item ID"
          />
        </div>

        <div className="md:w-1/2">
          <label className="block text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={item.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            {MENU_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Language visibility toggles */}
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
              checked={showInEnglish}
              onChange={e => setShowInEnglish(e.target.checked)}
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
              checked={showInFarsi}
              onChange={e => setShowInFarsi(e.target.checked)}
              className="ml-2 w-5 h-5"
            />
            <label htmlFor="showInFarsi" className="text-base font-medium">
              نمایش در منوی فارسی
            </label>
          </div>
        </div>
        
        {showInEnglish && !showInFarsi && (
          <div className="mt-2 text-blue-700 text-sm font-medium py-1 px-2 bg-blue-50 rounded-md inline-block">
            این آیتم فقط در منوی انگلیسی نمایش داده می‌شود
          </div>
        )}
        
        {!showInEnglish && showInFarsi && (
          <div className="mt-2 text-green-700 text-sm font-medium py-1 px-2 bg-green-50 rounded-md inline-block">
            این آیتم فقط در منوی فارسی نمایش داده می‌شود
          </div>
        )}
        
        {showInEnglish && showInFarsi && (
          <div className="mt-2 text-purple-700 text-sm font-medium py-1 px-2 bg-purple-50 rounded-md inline-block">
            این آیتم در هر دو منوی فارسی و انگلیسی نمایش داده می‌شود
          </div>
        )}
        
        {!showInEnglish && !showInFarsi && (
          <div className="mt-2 text-red-700 text-sm font-medium py-1 px-2 bg-red-50 rounded-md inline-block">
            هشدار: این آیتم در هیچ منویی نمایش داده نمی‌شود
          </div>
        )}
      </div>

      {/* English fields */}
      {showInEnglish && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h2 className="text-xl font-semibold mb-4">English Content</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name (EN)</label>
            <input
              type="text"
              name="name"
              value={item.name?.en || ''}
              onChange={e => handleChange(e, 'en')}
              className="w-full p-2 border rounded"
              placeholder="Item name in English"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description (EN)</label>
            <textarea
              name="description"
              value={item.description?.en || ''}
              onChange={e => handleChange(e, 'en')}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Item description in English"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Ingredients (EN) - Comma separated</label>
            <textarea
              value={ingredientsEn}
              onChange={e => handleIngredientsChange(e, 'en')}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Coffee, Milk, Sugar"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Price (EN)</label>
            <input
              type="text"
              name="price"
              value={item.price?.en || ''}
              onChange={e => handleChange(e, 'en')}
              className="w-full p-2 border rounded"
              placeholder="65000"
            />
          </div>
        </div>
      )}

      {/* Farsi fields */}
      {showInFarsi && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
          <h2 className="text-xl font-semibold mb-4">Farsi Content</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name (FA)</label>
            <input
              type="text"
              name="name"
              value={item.name?.fa || ''}
              onChange={e => handleChange(e, 'fa')}
              className="w-full p-2 border rounded"
              placeholder="نام به فارسی"
              dir="rtl"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description (FA)</label>
            <textarea
              name="description"
              value={item.description?.fa || ''}
              onChange={e => handleChange(e, 'fa')}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="توضیحات به فارسی"
              dir="rtl"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Ingredients (FA) - Comma separated</label>
            <textarea
              value={ingredientsFa}
              onChange={e => handleIngredientsChange(e, 'fa')}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="قهوه، شیر، شکر"
              dir="rtl"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Price (FA)</label>
            <input
              type="text"
              name="price"
              value={item.price?.fa || ''}
              onChange={e => handleChange(e, 'fa')}
              className="w-full p-2 border rounded"
              placeholder="45000"
              dir="rtl"
            />
          </div>
        </div>
      )}

      {/* Common fields */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Common Information</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Calories</label>
          <input
            type="number"
            name="calories"
            value={item.calories}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="0"
            min="0"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Image URL</label>
          <input
            type="text"
            name="image"
            value={item.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={item.isAvailable}
            onChange={handleIsAvailableChange}
            className="mr-2"
          />
          <label htmlFor="isAvailable">Available</label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
} 