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

export type LanguageText = {
  en: string;
  fa: string;
};

export type LanguageArrayText = {
  en: string[];
  fa: string[];
};

export type OptionalLanguageText = {
  en?: string;
  fa?: string;
};

export type OptionalLanguageArrayText = {
  en?: string[];
  fa?: string[];
};

export type Price = {
  en: string;
  fa: string;
};

export type MenuItemType = {
  id: string;
  category: string;
  name: LanguageText;
  description: LanguageText;
  ingredients: LanguageArrayText;
  calories: number;
  price: Price;
  image: string;
  isAvailable: boolean;
};

export type LanguageSpecificMenuItem = {
  id: string;
  category: string;
  name: OptionalLanguageText;
  description: OptionalLanguageText;
  ingredients: OptionalLanguageArrayText;
  calories: number;
  price: Price;
  image: string;
  isAvailable: boolean;
  onlyShowIn?: ('en' | 'fa')[];
};

export type MenuSectionType = {
  category: string;
  items: MenuItemType[];
};

export type FlexibleMenuSectionType = {
  category: string;
  items: LanguageSpecificMenuItem[];
};

export type MenuType = {
  sections: MenuSectionType[];
};

export type FlexibleMenuType = {
  sections: FlexibleMenuSectionType[];
};

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
    en: string;
    fa: string;
  };
  ingredients: {
    en: string[];
    fa: string[];
  };
  calories: number;
  category: MenuCategory;
  image: string;
  isAvailable: boolean;
  onlyShowIn?: ('en' | 'fa')[];
}

export interface MenuSection {
  category: MenuCategory;
  items: MenuItem[];
} 