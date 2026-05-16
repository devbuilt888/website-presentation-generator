'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTranslations } from 'next-intl';
import { presentations } from '@/data/presentations';
import ForestPresentationViewer from '@/components/ForestPresentationViewer';

/** Same forest night tutorial as `/presentations/forest-night-journey` and the dashboard tutorial card. */
const LANDING_TUTORIAL_ID = 'forest-night-journey' as const;

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const tutorialPresentation = useMemo(
    () => presentations.find((p) => p.id === LANDING_TUTORIAL_ID),
    [],
  );

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto" />
          <p className="mt-4 text-slate-400 text-sm">{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  if (!tutorialPresentation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <p className="text-red-400 text-center text-sm">Tutorial content is not available.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="relative z-20 border-b border-white/10 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900/90 px-4 py-5 text-center shadow-lg sm:py-6">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{t('title')}</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {t('subtitle')}
        </p>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-slate-400 sm:text-sm">
          {t('tutorialLead')}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:from-indigo-500 hover:to-purple-500"
          >
            {tNav('signup')}
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {tNav('login')}
          </Link>
          <Link
            href={`/presentations/${LANDING_TUTORIAL_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-emerald-500/40 px-4 py-2 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-500/10"
          >
            {t('openTutorialNewTab')}
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <Link href="/editor" className="text-slate-400 underline-offset-2 hover:text-white hover:underline">
            {t('editorCardTitle')}
          </Link>
          <span className="text-slate-600" aria-hidden>
            ·
          </span>
          <Link
            href="/presentations"
            className="text-slate-400 underline-offset-2 hover:text-white hover:underline"
          >
            {t('presentationsCardTitle')}
          </Link>
        </div>
      </header>

      <main className="relative min-h-0 w-full flex-1">
        <ForestPresentationViewer presentation={tutorialPresentation} embedded />
      </main>

      <footer className="border-t border-white/5 bg-slate-950 py-3 text-center text-xs text-slate-500">
        {t('footerTech')}
      </footer>
    </div>
  );
}
