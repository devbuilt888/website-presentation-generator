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
        <img
          src={getAssetUrl('/@public/engflagsvg.png')}
          alt="UK flag"
          className="w-full h-full object-contain"
          style={{ borderRadius: '2px' }}
        />
      </button>
    </div>
  );
}

