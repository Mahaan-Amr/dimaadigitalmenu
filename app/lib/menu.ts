import { promises as fs } from 'fs';
import path from 'path';
import type { MenuItem, MenuSection } from '../types/menu';

const DATA_FILE = path.join(process.cwd(), 'data', 'menu.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  console.log('[menu] Ensuring data directory exists:', dir);
  try {
    await fs.access(dir);
    console.log('[menu] Data directory exists');
  } catch {
    console.log('[menu] Creating data directory');
    await fs.mkdir(dir, { recursive: true });
  }
}

// Initialize empty menu data if it doesn't exist
async function initializeMenuData() {
  console.log('[menu] Checking menu data file:', DATA_FILE);
  try {
    await fs.access(DATA_FILE);
    console.log('[menu] Menu data file exists');
  } catch {
    console.log('[menu] Creating empty menu data file');
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify({ sections: [] }));
  }
}

export async function getAllMenuItems(): Promise<MenuSection[]> {
  console.log('[menu] Getting all menu items');
  try {
    await initializeMenuData();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const sections = JSON.parse(data).sections;
    console.log('[menu] Successfully retrieved', sections.length, 'menu sections');
    return sections;
  } catch (error) {
    console.error('[menu] Error getting menu items:', error);
    throw error;
  }
}

export async function saveMenuItem(item: MenuItem): Promise<void> {
  console.log('[menu] Saving menu item:', item.id);
  try {
    await initializeMenuData();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const { sections } = JSON.parse(data);

    let section = sections.find((s: MenuSection) => s.category === item.category);
    if (!section) {
      console.log('[menu] Creating new section for category:', item.category);
      section = { category: item.category, items: [] };
      sections.push(section);
    }

    const itemIndex = section.items.findIndex((i: MenuItem) => i.id === item.id);
    if (itemIndex >= 0) {
      console.log('[menu] Updating existing item at index:', itemIndex);
      section.items[itemIndex] = item;
    } else {
      console.log('[menu] Adding new item to section');
      section.items.push(item);
    }

    await fs.writeFile(DATA_FILE, JSON.stringify({ sections }, null, 2));
    console.log('[menu] Successfully saved menu item');
  } catch (error) {
    console.error('[menu] Error saving menu item:', error);
    throw error;
  }
}

export async function deleteMenuItem(id: string): Promise<void> {
  console.log('[menu] Deleting menu item:', id);
  try {
    await initializeMenuData();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const { sections } = JSON.parse(data);

    sections.forEach((section: MenuSection) => {
      const initialLength = section.items.length;
      section.items = section.items.filter((item: MenuItem) => item.id !== id);
      if (section.items.length < initialLength) {
        console.log('[menu] Removed item from section:', section.category);
      }
    });

    const nonEmptySections = sections.filter(
      (section: MenuSection) => section.items.length > 0
    );
    console.log('[menu] Remaining sections:', nonEmptySections.length);

    await fs.writeFile(
      DATA_FILE,
      JSON.stringify({ sections: nonEmptySections }, null, 2)
    );
    console.log('[menu] Successfully deleted menu item');
  } catch (error) {
    console.error('[menu] Error deleting menu item:', error);
    throw error;
  }
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  console.log('[menu] Getting menu item by id:', id);
  try {
    const sections = await getAllMenuItems();
    for (const section of sections) {
      const item = section.items.find((item) => item.id === id);
      if (item) {
        console.log('[menu] Found item in section:', section.category);
        return item;
      }
    }
    console.log('[menu] Item not found');
    return null;
  } catch (error) {
    console.error('[menu] Error getting menu item by id:', error);
    throw error;
  }
} 