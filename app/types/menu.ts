export type MenuCategory =
  | 'cold-brews'
  | 'cake-desserts'
  | 'hot-coffee'
  | 'cold-coffee'
  | 'herbal-tea'
  | 'hot-drinks'
  | 'mocktails'
  | 'smoothies'
  | 'milkshakes'
  | 'food-salad'
  | 'breakfast'
  | 'panini-sandwiches';

export interface MenuItem {
  id: string;
  category: MenuCategory;
  name: {
    fa: string;
    en: string;
  };
  description: {
    fa: string;
    en: string;
  };
  ingredients: {
    fa: string[];
    en: string[];
  };
  calories: number;
  price: {
    fa: number;
    en: number;
  };
  image: string;
  isAvailable: boolean;
}

export interface MenuSection {
  category: MenuCategory;
  items: MenuItem[];
} 