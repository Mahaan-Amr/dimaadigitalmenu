import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { MenuSection } from '@/app/types/menu';

const DATA_FILE = path.join(process.cwd(), 'data', 'menu.json');
const CATEGORY_FILE = path.join(process.cwd(), 'data', 'categories.json');

// Interface for the category with bilingual names
interface Category {
  id: string;
  name: {
    en: string;
    fa: string;
  };
}

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  console.log('[Categories API] Ensuring data directory exists:', dir);
  try {
    await fs.access(dir);
    console.log('[Categories API] Data directory exists');
  } catch {
    console.log('[Categories API] Creating data directory');
    await fs.mkdir(dir, { recursive: true });
  }
}

// Initialize the categories data file if it doesn't exist
async function initializeCategoriesData() {
  console.log('[Categories API] Checking categories data file:', CATEGORY_FILE);
  try {
    await fs.access(CATEGORY_FILE);
    console.log('[Categories API] Categories data file exists');
  } catch {
    console.log('[Categories API] Creating default categories file');
    await ensureDataDir();
    
    // Get the existing categories from menu.json
    let categoryIds = ['breakfast', 'hot-coffee', 'cold-coffee'];
    try {
      const menuData = await fs.readFile(DATA_FILE, 'utf-8');
      const parsedMenu = JSON.parse(menuData);
      if (parsedMenu.sections && Array.isArray(parsedMenu.sections)) {
        categoryIds = parsedMenu.sections.map((section: { category: string }) => section.category);
      }
    } catch (err) {
      console.error('[Categories API] Error reading menu data:', err);
    }
    
    // Convert simple categories to bilingual format with default translations
    const categories: Category[] = categoryIds.map(id => ({
      id,
      name: {
        en: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
        fa: convertToFarsi(id)
      }
    }));
    
    // Create default categories file with ordered categories
    const initialData = {
      categories: categories,
      predefinedCategories: [
        'breakfast',
        'hot-coffee',
        'cold-coffee',
        'mocktails',
        'smoothies',
        'milkshakes',
        'hot-drinks',
        'cold-brews',
        'herbal-tea',
        'cake-desserts',
      ]
    };
    
    await fs.writeFile(CATEGORY_FILE, JSON.stringify(initialData, null, 2));
    console.log('[Categories API] Created categories file with data:', JSON.stringify(initialData, null, 2));
  }
}

// Helper function to convert English category names to Farsi placeholders
function convertToFarsi(categoryId: string): string {
  const translations: Record<string, string> = {
    'breakfast': 'صبحانه',
    'hot-coffee': 'قهوه گرم',
    'cold-coffee': 'قهوه سرد',
    'mocktails': 'موکتیل',
    'smoothies': 'اسموتی',
    'milkshakes': 'میلک شیک',
    'hot-drinks': 'نوشیدنی گرم',
    'cold-brews': 'دم سرد',
    'herbal-tea': 'دمنوش',
    'cake-desserts': 'کیک و دسر'
  };

  return translations[categoryId] || categoryId;
}

// GET - Fetch all categories
export async function GET() {
  console.log('[Categories API] GET request received');
  try {
    await initializeCategoriesData();
    const data = await fs.readFile(CATEGORY_FILE, 'utf-8');
    const categoriesData = JSON.parse(data);
    
    console.log('[Categories API] Returning categories:', categoriesData);
    return NextResponse.json(categoriesData);
  } catch (error) {
    console.error('[Categories API] Error getting categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Update categories (create, update order)
export async function POST(request: Request) {
  console.log('[Categories API] POST request received');
  try {
    const { categories } = await request.json();
    console.log('[Categories API] Updating categories:', categories);

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Invalid categories format, expected an array' },
        { status: 400 }
      );
    }

    await initializeCategoriesData();
    
    // Read existing data to preserve predefinedCategories
    const currentData = await fs.readFile(CATEGORY_FILE, 'utf-8');
    const currentCategories = JSON.parse(currentData);
    
    // Update categories while keeping predefined list
    const updatedData = {
      categories: categories,
      predefinedCategories: currentCategories.predefinedCategories
    };
    
    await fs.writeFile(CATEGORY_FILE, JSON.stringify(updatedData, null, 2));
    console.log('[Categories API] Successfully updated categories');
    
    // Update the menu.json file to ensure all categories exist
    try {
      const menuData = await fs.readFile(DATA_FILE, 'utf-8');
      const menu = JSON.parse(menuData);
      
      // Filter sections to only include ones that are in the categories array
      const existingSections = menu.sections || [];
      const existingCategoryIds = existingSections.map((section: MenuSection) => section.category);
      
      // Get the category IDs from the categories array
      const categoryIds = categories.map((category: Category) => category.id);
      
      // Add any new categories that don't exist in the menu
      const sectionsToAdd = categoryIds
        .filter(id => !existingCategoryIds.includes(id))
        .map(id => ({ category: id, items: [] }));
      
      // Combine existing sections with new ones for missing categories
      const updatedSections = [...existingSections, ...sectionsToAdd];
      
      // Sort sections based on the order in categories array
      const sortedSections = updatedSections.sort((a: MenuSection, b: MenuSection) => {
        const indexA = categoryIds.indexOf(a.category);
        const indexB = categoryIds.indexOf(b.category);
        
        // If a category is not in the categories array, put it at the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        
        return indexA - indexB;
      });
      
      // Write the updated menu data back to the file
      await fs.writeFile(DATA_FILE, JSON.stringify({ sections: sortedSections }, null, 2));
      console.log('[Categories API] Updated menu.json with new category order');
    } catch (menuError) {
      console.error('[Categories API] Error updating menu.json:', menuError);
      // Still return success for the categories update
    }
    
    return NextResponse.json({ success: true, categories: updatedData.categories });
  } catch (error) {
    console.error('[Categories API] Error updating categories:', error);
    return NextResponse.json(
      { error: 'Failed to update categories' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a category
export async function DELETE(request: Request) {
  console.log('[Categories API] DELETE request received');
  try {
    const { categoryId } = await request.json();
    console.log('[Categories API] Deleting category:', categoryId);

    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid category format, expected a category ID string' },
        { status: 400 }
      );
    }

    await initializeCategoriesData();
    
    // Read existing categories
    const data = await fs.readFile(CATEGORY_FILE, 'utf-8');
    const categoriesData = JSON.parse(data);
    
    // Check if category is predefined (can't be deleted)
    if (categoriesData.predefinedCategories.includes(categoryId)) {
      return NextResponse.json(
        { error: 'Cannot delete a predefined category' },
        { status: 400 }
      );
    }
    
    // Remove the category
    const updatedCategories = categoriesData.categories.filter((cat: Category) => cat.id !== categoryId);
    
    // Write updated categories
    const updatedData = {
      categories: updatedCategories,
      predefinedCategories: categoriesData.predefinedCategories
    };
    
    await fs.writeFile(CATEGORY_FILE, JSON.stringify(updatedData, null, 2));
    console.log('[Categories API] Successfully deleted category');
    
    // Also update the menu.json file to remove this category
    try {
      const menuData = await fs.readFile(DATA_FILE, 'utf-8');
      const menu = JSON.parse(menuData);
      
      // Remove the section with the deleted category
      const updatedSections = (menu.sections || []).filter((section: MenuSection) => section.category !== categoryId);
      
      // Write back to file
      await fs.writeFile(DATA_FILE, JSON.stringify({ sections: updatedSections }, null, 2));
      console.log('[Categories API] Updated menu.json to remove deleted category');
    } catch (menuError) {
      console.error('[Categories API] Error updating menu.json:', menuError);
      // Still return success for the category deletion
    }
    
    return NextResponse.json({ success: true, categories: updatedData.categories });
  } catch (error) {
    console.error('[Categories API] Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 