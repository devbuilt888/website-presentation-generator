'use client';

import { useTranslation } from '@/hooks/useTranslation';

/**
 * Hook to get translated presentation content
 * This hook works without requiring the next-intl context
 */
export function usePresentationTranslation(presentationId: string) {
  const { isSpanish } = useTranslation();

  const translateSlide = (slideId: string, field: 'title' | 'subtitle' | 'content', originalText: string): string => {
    // For now, just return original text
    // Translation will be handled by the translateText function which uses the old translation system
    // This hook is kept for future enhancement when full i18n is integrated
    
    // Return original text - translations are handled elsewhere
    return originalText;
  };

  return { translateSlide };
}

/**
 * Translate presentation slide content based on locale
 */
export function translatePresentationContent(
  presentationId: string,
  slideId: string,
  field: 'title' | 'subtitle' | 'content',
  originalText: string,
  locale: string
): string {
  // For now, return original text
  // This will be enhanced with the translation system
  return originalText;
}

