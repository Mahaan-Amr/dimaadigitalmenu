'use client';

import React from 'react';
import type { Language } from '../types/common';
import ClientLayout from '../components/ClientLayout';

export default function LocaleLayoutClient({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: Language;
}) {
  // Set document language
  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <ClientLayout lang={lang}>
        {children}
      </ClientLayout>
    </div>
  );
} 