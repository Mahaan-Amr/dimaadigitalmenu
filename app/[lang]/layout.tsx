import { Language } from '../types/common';
import { notFound } from 'next/navigation';
import Providers from '../components/Providers';
import { LANGUAGES } from '../config/languages';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Language }>;
}) {
  // Await and validate language parameter
  const { lang } = await params;
  if (!LANGUAGES.includes(lang)) {
    notFound();
  }

  return (
    <div dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <Providers lang={lang}>{children}</Providers>
    </div>
  );
} 