export type MenuCategory = 
  | 'breakfast'
  | 'hot-coffee'
  | 'cold-coffee'
  | 'mocktails'
  | 'smoothies'
  | 'milkshakes'
  | 'hot-drinks'
  | 'cold-brews'
  | 'herbal-tea'
  | 'cake-desserts'
  | 'all';

export interface MenuItem {
  id: string;
  name: {
    en: string;
    fa: string;
  };
  description: {
    en: string;
    fa: string;
  };
  price: {
    en: number;
    fa: number;
  };
  ingredients: {
    en: string[];
    fa: string[];
  };
  calories: number;
  category: MenuCategory;
  image: string;
  isAvailable: boolean;
}

export interface MenuSection {
  category: MenuCategory;
  items: MenuItem[];
} 