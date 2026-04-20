'use client';

import { useEffect, useState } from 'react';
import { getAssetUrl } from '@/config/assets';

export default function LanguageSwitcher({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    // Load locale from localStorage
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
  }, []);

  const changeLocale = (newLocale: string) => {
    localStorage.setItem('locale', newLocale);
    setLocale(newLocale);
    window.location.reload();
  };

  const isLight = variant === 'light';
  const containerClass = isLight
    ? 'flex items-center gap-1 bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur-sm rounded-full px-1.5 py-1 border border-gray-300/50'
    : 'flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-1';

  return (
    <div className={containerClass}>
      <button
        onClick={() => changeLocale('es')}
        className={`transition-all flex items-center justify-center ${
          locale === 'es' ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-75'
        }`}
        title="Español"
        style={{ width: '24px', height: '18px' }}
      >
        <img
          src={getAssetUrl('/assets/presentation1/spainFlagPres.png')}
          alt="Spain Flag"
          className="w-full h-full object-contain"
          style={{ borderRadius: '2px' }}
        />
      </button>
      <button
        onClick={() => changeLocale('en')}
        className={`transition-all flex items-center justify-center ${
          locale === 'en' ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-75'
        }`}
        title="English"
        style={{ width: '24px', height: '18px' }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 24 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="5.33" fill="#012169" />
          <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
          <rect y="10.67" width="24" height="5.33" fill="#C8102E" />
          <rect x="0" y="0" width="9.6" height="16" fill="#012169" />
          <path
            d="M0 0L24 8M24 8L0 16M9.6 0L14.4 16M0 8L24 8"
            stroke="#FFFFFF"
            strokeWidth="2.67"
          />
          <path
            d="M0 0L24 8M24 8L0 16M9.6 0L14.4 16M0 8L24 8"
            stroke="#C8102E"
            strokeWidth="1.33"
          />
        </svg>
      </button>
    </div>
  );
}

