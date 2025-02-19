'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '../context/LanguageContext';
import Header from './Header';
import { Language } from '../types/common';

interface ProvidersProps {
  children: React.ReactNode;
  lang: Language;
}

export default function Providers({ children, lang }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={['light', 'dark']}
    >
      <LanguageProvider defaultLanguage={lang}>
        <Header />
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
} 