import type { Language } from '../types/common';
import type { MenuSection as MenuSectionType } from '../types/menu';
import ClientPage from '../components/ClientPage';
import React from 'react';

async function getMenuItems(): Promise<MenuSectionType[]> {
  console.log('[Page] Fetching menu items from API');
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
    
  const response = await fetch(`${baseUrl}/api/menu`, {
    cache: 'no-cache',
  });
  
  if (!response.ok) {
    console.error('[Page] Failed to fetch menu items:', response.statusText);
    throw new Error('Failed to fetch menu items');
  }
  
  const data = await response.json();
  console.log('[Page] Successfully fetched menu items:', data.length, 'sections');
  return data;
}

export default async function Page({
  params,
}: {
  params: { lang: Language };
}) {
  console.log('[Page] Starting page render with params:', params);
  
  try {
    const menuItems = await getMenuItems();
    console.log('[Page] Rendering ClientPage with lang:', params.lang);
    return <ClientPage initialMenuItems={menuItems} lang={params.lang} />;
  } catch (error) {
    console.error('[Page] Error in page render:', error);
    throw error;
  }
} 