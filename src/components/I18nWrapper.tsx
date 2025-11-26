'use client';

import { I18nProvider } from '@/i18n/provider';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
};

export default function I18nWrapper({ children }: Props) {
  const [locale, setLocale] = useState<string>('en');
  const [messages, setMessages] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load locale from localStorage or default to 'en'
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);

    // Load messages for the locale
    const loadMessages = async () => {
      try {
        const module = await import(`../../messages/${savedLocale}.json`);
        setMessages(module.default);
        setLoading(false);
      } catch (error) {
        // Fallback to English if locale file doesn't exist
        try {
          const module = await import(`../../messages/en.json`);
          setMessages(module.default);
          setLocale('en');
          setLoading(false);
        } catch (fallbackError) {
          console.error('Failed to load translation messages:', fallbackError);
          setLoading(false);
        }
      }
    };

    loadMessages();
  }, []);

  if (loading || !messages) {
    return <>{children}</>; // Render without i18n while loading
  }

  return (
    <I18nProvider locale={locale} messages={messages}>
      {children}
    </I18nProvider>
  );
}

