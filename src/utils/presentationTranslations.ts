'use client';

import { useTranslations } from 'next-intl';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Hook to get translated presentation content
 */
export function usePresentationTranslation(presentationId: string) {
  const t = useTranslations('presentationContent');
  const { isSpanish } = useTranslation();

  const translateSlide = (slideId: string, field: 'title' | 'subtitle' | 'content', originalText: string): string => {
    // Try to get translation from the messages
    try {
      const translationKey = `${presentationId}.${slideId}.${field}`;
      const translated = t(translationKey);
      
      // If translation exists and is different from key, return it
      if (translated && translated !== translationKey) {
        return translated;
      }
    } catch (e) {
      // Translation not found, continue to fallback
    }

    // If Spanish is selected and text is already in Spanish, return as-is
    // If English is selected and text is in Spanish, try to translate
    if (!isSpanish && originalText) {
      // Check if text looks like Spanish (contains common Spanish characters/words)
      const isSpanishText = /[áéíóúñ¿¡]/.test(originalText) || 
                           originalText.includes('¿') || 
                           originalText.includes('¡') ||
                           /(que|de|la|el|en|un|una|es|son|está|están)/i.test(originalText);
      
      if (isSpanishText) {
        // Try to get translation
        try {
          const translationKey = `${presentationId}.${slideId}.${field}`;
          const translated = t(translationKey);
          if (translated && translated !== translationKey) {
            return translated;
          }
        } catch (e) {
          // Fallback to original
        }
      }
    }

    // Return original text if no translation found
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

