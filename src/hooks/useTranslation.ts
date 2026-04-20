'use client';

import { useEffect, useState } from 'react';

// Fallback translation function
const fallbackT = (key: string) => key;

export function useTranslation() {
  const [currentLocale, setCurrentLocale] = useState<string>('en');

  useEffect(() => {
    // Load locale from localStorage
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') || 'en';
      setCurrentLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      setCurrentLocale(newLocale);
      window.location.reload();
    }
  };

  return {
    t: fallbackT, // Components should use useTranslations directly from next-intl when in context
    locale: currentLocale,
    changeLocale,
    isSpanish: currentLocale === 'es',
    isEnglish: currentLocale === 'en',
  };
}

