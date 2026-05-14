'use client';

import { I18nProvider } from '@/i18n/provider';
import { defaultLocale, locales, type Locale } from '@/i18n/constants';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
};

const defaultMessages = {
  common: { loading: 'Cargando...', error: 'Error', success: 'Éxito' },
  dashboard: {},
  admin: {},
  presentations: {},
  nav: {},
  auth: {},
  templates: {},
  presentationContent: {},
};

function normalizeStoredLocale(raw: string | null): Locale {
  if (raw && (locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return defaultLocale;
}

export default function I18nWrapper({ children }: Props) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<any>(defaultMessages);

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

    const loadMessages = async () => {
      try {
        const mod = await import(`../../messages/${stored}.json`);
        const loaded = mod.default || mod;
        if (loaded && typeof loaded === 'object') {
          setMessages(loaded);
          return;
        }
        throw new Error('Invalid messages');
      } catch (e) {
        console.error('Error loading messages:', e);
        try {
          const esMod = await import(`../../messages/es.json`);
          setMessages(esMod.default || esMod);
          setLocale(defaultLocale);
          try {
            localStorage.setItem('locale', defaultLocale);
          } catch {
            /* ignore */
          }
        } catch {
          try {
            const enMod = await import(`../../messages/en.json`);
            setMessages(enMod.default || enMod);
            setLocale('en');
          } catch {
            /* keep defaultMessages */
          }
        }
      }
    };

    void loadMessages();
  }, []);

  const safeMessages = messages || defaultMessages;

  return (
    <I18nProvider locale={locale} messages={safeMessages}>
      {children}
    </I18nProvider>
  );
}
