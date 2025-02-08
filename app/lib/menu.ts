import fs from 'fs/promises';
import path from 'path';
import type { MenuItem, MenuSection } from '../types/menu';

const DATA_FILE = path.join(process.cwd(), 'data', 'menu.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Initialize empty menu data if it doesn't exist
async function initializeMenuData() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify({ sections: [] }));
  }
}

export async function getAllMenuItems(): Promise<MenuSection[]> {
  await initializeMenuData();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data).sections;
}

export async function saveMenuItem(item: MenuItem): Promise<void> {
  await initializeMenuData();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  const { sections } = JSON.parse(data);

  // Find the section for this item's category
  let section = sections.find((s: MenuSection) => s.category === item.category);

  if (!section) {
    // Create new section if it doesn't exist
    section = { category: item.category, items: [] };
    sections.push(section);
  }

  // Update or add the item
  const itemIndex = section.items.findIndex((i: MenuItem) => i.id === item.id);
  if (itemIndex >= 0) {
    section.items[itemIndex] = item;
  } else {
    section.items.push(item);
  }

  await fs.writeFile(DATA_FILE, JSON.stringify({ sections }, null, 2));
}

export async function deleteMenuItem(id: string): Promise<void> {
  await initializeMenuData();
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  const { sections } = JSON.parse(data);

  // Remove the item from its section
  sections.forEach((section: MenuSection) => {
    section.items = section.items.filter((item: MenuItem) => item.id !== id);
  });

  // Remove empty sections
  const nonEmptySections = sections.filter(
    (section: MenuSection) => section.items.length > 0
  );

  await fs.writeFile(
    DATA_FILE,
    JSON.stringify({ sections: nonEmptySections }, null, 2)
  );
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const sections = await getAllMenuItems();
  for (const section of sections) {
    const item = section.items.find((item) => item.id === id);
    if (item) return item;
  }
  return null;
} 