import { NextResponse } from 'next/server';
import {
  getAllMenuItems,
  saveMenuItem,
  deleteMenuItem,
} from '@/app/lib/menu';
import type { MenuItem } from '@/app/types/menu';

export async function GET() {
  try {
    const items = await getAllMenuItems();
    return NextResponse.json(items);
  } catch (error: unknown) {
    console.error('Failed to fetch menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const item: MenuItem = await request.json();
    await saveMenuItem(item);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Failed to save menu item:', error);
    return NextResponse.json(
      { error: 'Failed to save menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await deleteMenuItem(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Failed to delete menu item:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
} 