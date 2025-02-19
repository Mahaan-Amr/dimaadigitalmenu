import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { MenuItem, MenuSection } from '@/app/types/menu';

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
    await fs.writeFile(DATA_FILE, JSON.stringify({ sections: [] }));
  }
}

export async function GET() {
  console.log('[API] GET request received');
  try {
    await initializeMenuData();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const sections = JSON.parse(data).sections;
    console.log('[API] Successfully retrieved', sections.length, 'menu sections');
    return NextResponse.json(sections);
  } catch (error) {
    console.error('[API] Error getting menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('[API] POST request received');
  try {
    const item: MenuItem = await request.json();
    console.log('[API] Saving menu item:', item.id);

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
    return NextResponse.json(
      { error: 'Failed to save menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  console.log('[API] DELETE request received');
  try {
    const { id } = await request.json();
    console.log('[API] Deleting menu item:', id);

    await initializeMenuData();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const { sections } = JSON.parse(data);

    sections.forEach((section: MenuSection) => {
      const initialLength = section.items.length;
      section.items = section.items.filter((item: MenuItem) => item.id !== id);
      if (section.items.length < initialLength) {
        console.log('[API] Removed item from section:', section.category);
      }
    });

    const nonEmptySections = sections.filter(
      (section: MenuSection) => section.items.length > 0
    );
    console.log('[API] Remaining sections:', nonEmptySections.length);

    await fs.writeFile(
      DATA_FILE,
      JSON.stringify({ sections: nonEmptySections }, null, 2)
    );
    console.log('[API] Successfully deleted menu item');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
} 