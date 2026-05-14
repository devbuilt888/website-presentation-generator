'use client';

import { useEffect, useState } from 'react';
import { defaultLocale, locales, type Locale } from '@/i18n/constants';

const fallbackT = (key: string) => key;

function normalizeStoredLocale(raw: string | null): Locale {
  if (raw && (locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return defaultLocale;
}

export function useTranslation() {
  const [currentLocale, setCurrentLocale] = useState<string>(defaultLocale);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = normalizeStoredLocale(localStorage.getItem('locale'));
      setCurrentLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale: string) => {
    if (typeof window !== 'undefined') {
      if (!(locales as readonly string[]).includes(newLocale)) return;
      localStorage.setItem('locale', newLocale);
      setCurrentLocale(newLocale);
      window.location.reload();
    }
  };

  return {
    t: fallbackT,
    locale: currentLocale,
    changeLocale,
    isSpanish: currentLocale === 'es',
    isEnglish: currentLocale === 'en',
  };
}
