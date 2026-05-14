'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useState, useEffect } from 'react';
import { defaultLocale, locales, type Locale } from '@/i18n/constants';

type Props = {
  children: ReactNode;
  locale: string;
  messages: any;
};

export function I18nProvider({ children, locale, messages }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

function normalizeStoredLocale(raw: string | null): Locale {
  if (raw && (locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return defaultLocale;
}

export function useLocale() {
  const [locale, setLocale] = useState<string>(defaultLocale);

  useEffect(() => {
    const savedLocale = normalizeStoredLocale(
      typeof window !== 'undefined' ? localStorage.getItem('locale') : null
    );
    setLocale(savedLocale);
  }, []);

  const changeLocale = (newLocale: string) => {
    if (!(locales as readonly string[]).includes(newLocale)) return;
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    window.location.reload();
  };

  return { locale, changeLocale };
}
