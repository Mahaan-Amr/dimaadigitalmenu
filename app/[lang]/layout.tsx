import '../globals.css'
import type { Metadata } from 'next'
import { LANGUAGES } from '../config/languages'
import type { Language } from '../types/common'
import LocaleLayoutClient from './locale-layout-client'

export const metadata: Metadata = {
  title: 'Dimaa Digital Menu',
  description: 'Digital Menu for Dimaa Restaurant',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Language }>
}) {
  const { lang } = await params;

  if (!LANGUAGES.includes(lang)) {
    throw new Error(`Invalid language: ${lang}`)
  }

  return <LocaleLayoutClient lang={lang}>{children}</LocaleLayoutClient>
} 