'use client';

import { I18nProvider } from '@/i18n/provider';
import { defaultLocale, locales, type Locale } from '@/i18n/constants';
import { ReactNode, useEffect, useState } from 'react';
import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';

type Props = {
  children: ReactNode;
};

const messagesByLocale: Record<Locale, typeof esMessages> = {
  es: esMessages,
  en: enMessages,
};

function normalizeStoredLocale(raw: string | null): Locale {
  if (raw && (locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return defaultLocale;
}

export default function I18nWrapper({ children }: Props) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState(messagesByLocale[defaultLocale]);

  useEffect(() => {
    let stored: Locale = defaultLocale;
    try {
      const raw = localStorage.getItem('locale');
      stored = normalizeStoredLocale(raw);
      if (raw !== null && raw !== stored) {
        localStorage.setItem('locale', stored);
      }
    } catch {
      /* ignore */
    }

    setLocale(stored);
    setMessages(messagesByLocale[stored]);
  }, []);

  return (
    <I18nProvider locale={locale} messages={messages}>
      {children}
    </I18nProvider>
  );
}
