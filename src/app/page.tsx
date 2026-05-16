'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { presentations } from '@/data/presentations';
import ForestPresentationViewer from '@/components/ForestPresentationViewer';

const LANDING_TUTORIAL_ID = 'forest-night-journey' as const;

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
      <div className="flex h-[calc(100dvh-9rem)] min-h-[320px] w-full items-center justify-center bg-black">
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-white/25 border-t-white"
          aria-hidden
        />
      </div>
    );
  }

  if (user) {
    return null;
  }

  if (!tutorialPresentation) {
    return <div className="h-[calc(100dvh-9rem)] min-h-[320px] w-full bg-black" />;
  }

  return (
    <div className="flex h-[calc(100dvh-9rem)] min-h-[320px] w-full flex-col overflow-hidden bg-black">
      <div className="relative min-h-0 flex-1">
        <ForestPresentationViewer
          presentation={tutorialPresentation}
          embedded
          fillHeight
        />
      </div>
    </div>
  );
}
