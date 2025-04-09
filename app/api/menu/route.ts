import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { 
  MenuItem, 
  MenuSection, 
  MenuSectionType
} from '@/app/types/menu';

const DATA_FILE = path.join(process.cwd(), 'data', 'menu.json');

async function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  console.log('[API] Ensuring data directory exists:', dir);
  try {
    await fs.access(dir);
    console.log('[API] Data directory exists');
  } catch {
    console.log('[API] Creating data directory');
    await fs.mkdir(dir, { recursive: true });
  }
}

async function initializeMenuData() {
  console.log('[API] Checking menu data file:', DATA_FILE);
  try {
    await fs.access(DATA_FILE);
    console.log('[API] Menu data file exists');
  } catch {
    console.log('[API] Creating empty menu data file');
    await ensureDataDir();
    const initialData = {
      sections: [
        {
          category: 'hot-coffee',
          items: []
        },
        {
          category: 'cold-coffee',
          items: []
        },
        {
          category: 'breakfast',
          items: []
        }
      ]
    };
    console.log('[API] Writing initial data:', JSON.stringify(initialData, null, 2));
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Helper function to filter menu items based on language
function filterMenuItemsByLanguage(sections: MenuSection[], language: 'en' | 'fa' = 'en'): MenuSectionType[] {
  return sections.map((section) => {
    const filteredItems = section.items.filter((item: MenuItem) => {
      // Check if item should only be shown in specific languages
      if (item.onlyShowIn && !item.onlyShowIn.includes(language)) {
        return false;
      }
      
      // Check if item has content for the requested language
      if (
        (!item.name || !item.name[language]) &&
        (!item.description || !item.description[language]) &&
        (!item.ingredients || !item.ingredients[language])
      ) {
        return false;
      }
      
      return true;
    });
    
    return {
      category: section.category,
      items: filteredItems
    };
  });
}

export async function GET(request: Request) {
  console.log('[API] GET request received');
  try {
    // Get language from query parameter
    const url = new URL(request.url);
    const langParam = url.searchParams.get('lang') || 'en';
    const language = (langParam === 'en' || langParam === 'fa') ? langParam : 'en';
    console.log('[API] Requested language:', language);
    
    await initializeMenuData();
    console.log('[API] Reading menu data file');
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    console.log('[API] Raw file contents:', data);
    
    const parsedData = JSON.parse(data);
    console.log('[API] Parsed data:', JSON.stringify(parsedData, null, 2));
    
    const { sections } = parsedData;
    console.log('[API] Extracted sections:', {
      count: sections.length,
      categories: sections.map((s: MenuSection) => s.category),
      itemCounts: sections.map((s: MenuSection) => ({
        category: s.category,
        itemCount: s.items.length,
        items: s.items.map((item: MenuItem) => 
          item.name && typeof item.name.en === 'string' ? item.name.en : item.id
        )
      }))
    });
    
    // Filter items based on language
    const filteredSections = filterMenuItemsByLanguage(sections, language);
    console.log(`[API] Filtered sections for language ${language}:`, {
      count: filteredSections.length,
      itemCounts: filteredSections.map(s => ({
        category: s.category,
        itemCount: s.items.length
      }))
    });
    
    return NextResponse.json(filteredSections);
  } catch (error) {
    console.error('[API] Error getting menu items:', error);
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to fetch menu items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('[API] POST request received');
  try {
    const item = await request.json();
    console.log('[API] Saving menu item:', JSON.stringify(item, null, 2));

    await initializeMenuData();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const { sections } = JSON.parse(data);

    let section = sections.find((s: MenuSection) => s.category === item.category);
    if (!section) {
      console.log('[API] Creating new section for category:', item.category);
      section = { category: item.category, items: [] };
      sections.push(section);
    }

    const itemIndex = section.items.findIndex((i: MenuItem) => i.id === item.id);
    if (itemIndex >= 0) {
      console.log('[API] Updating existing item at index:', itemIndex);
      section.items[itemIndex] = item;
    } else {
      console.log('[API] Adding new item to section');
      section.items.push(item);
    }

    await fs.writeFile(DATA_FILE, JSON.stringify({ sections }, null, 2));
    console.log('[API] Successfully saved menu item');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error saving menu item:', error);
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to save menu item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  console.log('[API] DELETE request received');
  try {
    const body = await request.json();
    console.log('[API] DELETE request body:', JSON.stringify(body, null, 2));
    
    const { id } = body;
    if (!id) {
      console.error('[API] Delete error: No ID provided');
      return NextResponse.json(
        { error: 'Missing menu item ID' },
        { status: 400 }
      );
    }
    
    console.log('[API] Deleting menu item with ID:', id);

    await initializeMenuData();
    console.log('[API] Reading menu data file');
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    
    let parsedData;
    try {
      parsedData = JSON.parse(data);
      console.log('[API] Successfully parsed menu data');
    } catch (parseError) {
      console.error('[API] Error parsing menu data:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse menu data file' },
        { status: 500 }
      );
    }
    
    const { sections } = parsedData;
    console.log('[API] Total sections before deletion:', sections.length);
    
    let itemFound = false;
    let removedFromCategory = '';
    
    sections.forEach((section: MenuSection) => {
      const initialLength = section.items.length;
      section.items = section.items.filter((item: MenuItem) => {
        const shouldKeep = item.id !== id;
        if (!shouldKeep) {
          itemFound = true;
          removedFromCategory = section.category;
        }
        return shouldKeep;
      });
      
      if (section.items.length < initialLength) {
        console.log('[API] Removed item from section:', section.category);
      }
    });
    
    if (!itemFound) {
      console.log('[API] Warning: Item with ID', id, 'not found in any section');
    }

    const nonEmptySections = sections.filter(
      (section: MenuSection) => section.items.length > 0
    );
    console.log('[API] Remaining sections after deletion:', nonEmptySections.length);
    
    const updatedData = { sections: nonEmptySections };
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2));
      console.log('[API] Successfully wrote updated menu data to file');
    } catch (writeError) {
      console.error('[API] Error writing updated menu data:', writeError);
      return NextResponse.json(
        { error: 'Failed to save menu data' },
        { status: 500 }
      );
    }
    
    console.log('[API] Successfully deleted menu item:', {
      id,
      itemFound,
      removedFromCategory,
      beforeSectionCount: sections.length,
      afterSectionCount: nonEmptySections.length
    });
    
    return NextResponse.json({ 
      success: true,
      details: {
        id,
        itemFound,
        removedFromCategory
      }
    });
  } catch (error) {
    console.error('[API] Error deleting menu item:', error);
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Failed to delete menu item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 