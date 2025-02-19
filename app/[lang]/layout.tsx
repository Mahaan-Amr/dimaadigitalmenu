import { Language } from '../types/common';
import { notFound } from 'next/navigation';
import Providers from '../components/Providers';
import { LANGUAGES } from '../config/languages';
import React from 'react';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Language };
}) {
  // Validate language parameter
  if (!LANGUAGES.includes(params.lang)) {
    notFound();
  }

  return (
    <div dir={params.lang === 'fa' ? 'rtl' : 'ltr'}>
      <Providers lang={params.lang}>{children}</Providers>
    </div>
  );
} 