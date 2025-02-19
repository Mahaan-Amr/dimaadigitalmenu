'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '../context/LanguageContext';
import Header from './Header';
import { Language } from '../types/common';

interface ClientLayoutProps {
  children: React.ReactNode;
  lang: Language;
}

export default function ClientLayout({ children, lang }: ClientLayoutProps) {
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