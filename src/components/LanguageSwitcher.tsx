'use client';

import { useEffect, useState } from 'react';
import { getAssetUrl } from '@/config/assets';
import { defaultLocale, locales, type Locale } from '@/i18n/constants';

function normalizeStoredLocale(raw: string | null): Locale {
  if (raw && (locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return defaultLocale;
}

/** Bandera de España (franjas horizontales rojo-amarillo-rojo). */
function FlagSpain({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={className}
      width={24}
      height={16}
      aria-hidden
    >
      <rect width="30" height="5" fill="#c60b1e" />
      <rect y="5" width="30" height="10" fill="#ffc400" />
      <rect y="15" width="30" height="5" fill="#c60b1e" />
    </svg>
  );
}

/** English flag from Supabase `assets` bucket: `general-assets/engflagsvg.png` (path via getAssetUrl). */
function FlagEnglish({ className }: { className?: string }) {
  return (
    <img
      src={getAssetUrl('assets/general-assets/engflagsvg.png')}
      alt=""
      width={24}
      height={16}
      className={`block object-cover ${className ?? ''}`}
      loading="lazy"
      decoding="async"
      aria-hidden
    />
  );
}

export default function LanguageSwitcher({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const [locale, setLocale] = useState<string>(defaultLocale);

  useEffect(() => {
    setLocale(normalizeStoredLocale(localStorage.getItem('locale')));
  }, []);

  const changeLocale = (newLocale: string) => {
    if (!(locales as readonly string[]).includes(newLocale)) return;
    localStorage.setItem('locale', newLocale);
    setLocale(newLocale);
    window.location.reload();
  };

  const isLight = variant === 'light';
  const containerClass = isLight
    ? 'flex items-center gap-1.5 bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-300/50'
    : 'flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1';

  return (
    <div className={containerClass} role="group" aria-label="Idioma">
      <button
        type="button"
        onClick={() => changeLocale('es')}
        className={`transition-all flex items-center justify-center rounded-sm overflow-hidden ring-1 ring-black/10 ${
          locale === 'es' ? 'opacity-100 scale-110 ring-2 ring-indigo-500' : 'opacity-60 hover:opacity-90'
        }`}
        title="Español"
        aria-pressed={locale === 'es'}
      >
        <FlagSpain className="block" />
      </button>
      <button
        type="button"
        onClick={() => changeLocale('en')}
        className={`transition-all flex items-center justify-center rounded-sm overflow-hidden ring-1 ring-black/10 ${
          locale === 'en' ? 'opacity-100 scale-110 ring-2 ring-indigo-500' : 'opacity-60 hover:opacity-90'
        }`}
        title="English"
        aria-pressed={locale === 'en'}
      >
        <FlagEnglish className="block" />
      </button>
    </div>
  );
}
