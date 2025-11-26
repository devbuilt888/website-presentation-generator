'use client';

import { useTranslations, useLocale as useNextIntlLocale } from 'next-intl';
import { useEffect, useState } from 'react';

export function useTranslation() {
  const t = useTranslations();
  const locale = useNextIntlLocale();
  const [currentLocale, setCurrentLocale] = useState<string>(locale);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || locale;
    setCurrentLocale(savedLocale);
  }, [locale]);

  const changeLocale = (newLocale: string) => {
    localStorage.setItem('locale', newLocale);
    setCurrentLocale(newLocale);
    window.location.reload();
  };

  return {
    t,
    locale: currentLocale,
    changeLocale,
    isSpanish: currentLocale === 'es',
    isEnglish: currentLocale === 'en',
  };
}

