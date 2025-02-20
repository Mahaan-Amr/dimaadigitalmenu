import type { Language } from '../types/common';
import type { MenuSection as MenuSectionType } from '../types/menu';
import ClientPage from '../components/ClientPage';
import React from 'react';

async function getMenuItems(): Promise<MenuSectionType[]> {
  console.log('[Page] Fetching menu items from API');
  
  try {
    // Use absolute path for API calls
    const response = await fetch('http://localhost:3000/api/menu', {
      cache: 'no-store', // Disable caching to always get fresh data
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('[Page] Failed to fetch menu items:', response.statusText);
      throw new Error('Failed to fetch menu items');
    }
    
    const data = await response.json();
    console.log('[Page] Successfully fetched menu items:', data.length, 'sections');
    return data;
  } catch (error) {
    console.error('[Page] Error fetching menu items:', error);
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
    const menuItems = await getMenuItems();
    console.log('[Page] Rendering ClientPage with lang:', lang);
    return <ClientPage initialMenuItems={menuItems} lang={lang} />;
  } catch (error) {
    console.error('[Page] Error in page render:', error);
    throw error;
  }
} 