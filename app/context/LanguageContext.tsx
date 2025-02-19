'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Language = 'en' | 'fa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  defaultLanguage,
}: {
  children: ReactNode;
  defaultLanguage: Language;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const setLanguage = (newLang: Language) => {
    // Get the current path segments
    const segments = pathname.split('/').filter(Boolean);
    // Replace the language segment (first segment) with the new language
    segments[0] = newLang;
    // Construct the new path
    const newPath = `/${segments.join('/')}`;
    // Navigate to the new path
    router.push(newPath);
  };

  return (
    <LanguageContext.Provider value={{ language: defaultLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 