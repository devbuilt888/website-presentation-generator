'use client';

import { I18nProvider } from '@/i18n/provider';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
};

// Default fallback messages structure
const defaultMessages = {
  common: { loading: 'Loading...', error: 'Error', success: 'Success' },
  dashboard: {},
  admin: {},
  presentations: {},
  nav: {},
  auth: {},
  templates: {},
  presentationContent: {}
};

export default function I18nWrapper({ children }: Props) {
  const [locale, setLocale] = useState<string>('en');
  const [messages, setMessages] = useState<any>(defaultMessages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load locale from localStorage or default to 'en'
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);

    // Load messages for the locale
    const loadMessages = async () => {
      try {
        const module = await import(`../../messages/${savedLocale}.json`);
        const loadedMessages = module.default || module;
        // Ensure messages have the expected structure
        if (loadedMessages && typeof loadedMessages === 'object') {
          setMessages(loadedMessages);
        } else {
          console.warn('Messages loaded but structure is invalid, using fallback');
          // Load English as fallback
          const enModule = await import(`../../messages/en.json`);
          setMessages(enModule.default || enModule);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading messages:', error);
        // Fallback to English if locale file doesn't exist
        try {
          const module = await import(`../../messages/en.json`);
          const loadedMessages = module.default || module;
          setMessages(loadedMessages);
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

  // Always provide a context with valid structure
  // Merge loaded messages with defaults to ensure all namespaces exist
  const safeMessages = messages || defaultMessages;
  const safeLocale = locale || 'en';

  return (
    <I18nProvider locale={safeLocale} messages={safeMessages}>
      {children}
    </I18nProvider>
  );
}

