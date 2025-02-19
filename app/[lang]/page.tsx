import type { Language } from '@/app/types/common';
import type { MenuSection as MenuSectionType } from '@/app/types/menu';
import ClientPage from '@/app/components/ClientPage';

async function getMenuItems(): Promise<MenuSectionType[]> {
  console.log('[Page] Fetching menu items from API');
  const response = await fetch('http://localhost:3000/api/menu', {
    next: { revalidate: 60 }, // Cache for 60 seconds
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
  params: Promise<{ lang: Language }>;
}) {
  console.log('[Page] Starting page render with params:', params);
  
  try {
    const { lang } = await params;
    console.log('[Page] Resolved language:', lang);
    
    const menuItems = await getMenuItems();
    console.log('[Page] Rendering ClientPage with lang:', lang);
    return <ClientPage initialMenuItems={menuItems} lang={lang} />;
  } catch (error) {
    console.error('[Page] Error in page render:', error);
    throw error;
  }
} 