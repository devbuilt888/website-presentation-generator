'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useState, useEffect } from 'react';

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

// Hook to get and set locale
export function useLocale() {
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    // Load locale from localStorage or default to 'en'
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
  }, []);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    // Reload to apply new locale
    window.location.reload();
  };

  return { locale, changeLocale };
}

