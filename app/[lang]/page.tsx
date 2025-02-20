import type { Language } from '../types/common';
import type { MenuSection as MenuSectionType } from '../types/menu';
import ClientPage from '../components/ClientPage';
import React from 'react';
import { headers } from 'next/headers';

async function getMenuItems(): Promise<MenuSectionType[]> {
  console.log('[Page] Fetching menu items from API - Start');
  
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' || host.includes('vercel') ? 'https' : 'http';
    
    const url = `${protocol}://${host}/api/menu`;
    console.log('[Page] Making request to:', url);
    
    const response = await fetch(url, {
      cache: 'no-store', // Disable caching to always get fresh data
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('[Page] Response status:', response.status);
    console.log('[Page] Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('[Page] Failed to fetch menu items:', response.statusText);
      throw new Error(`Failed to fetch menu items: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[Page] Raw API response:', JSON.stringify(data, null, 2));
    
    if (!Array.isArray(data)) {
      console.error('[Page] Invalid data format - expected array, got:', typeof data);
      throw new Error('Invalid data format received from API');
    }
    
    console.log('[Page] Successfully fetched menu items:', {
      sectionsCount: data.length,
      sections: data.map(section => ({
        category: section.category,
        itemsCount: section.items?.length || 0
      }))
    });
    
    return data;
  } catch (error) {
    console.error('[Page] Error fetching menu items:', error);
    console.error('[Page] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Language }>;
}) {
  console.log('[Page] Starting page render with params:', params);
  
  try {
    const { lang } = await params;
    console.log('[Page] Resolved language:', lang);
    
    const menuItems = await getMenuItems();
    console.log('[Page] Menu items fetched successfully:', {
      sectionsCount: menuItems.length,
      categories: menuItems.map(section => section.category)
    });
    
    console.log('[Page] Rendering ClientPage with:', {
      lang,
      menuItemsLength: menuItems.length
    });
    
    return <ClientPage initialMenuItems={menuItems} lang={lang} />;
  } catch (error) {
    console.error('[Page] Error in page render:', error);
    console.error('[Page] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
} 