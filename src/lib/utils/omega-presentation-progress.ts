import { isOmega63RatioHealthy } from '@/lib/utils/omega-balance-ratio';
import type { Presentation } from '@/data/presentations';

/** Slides visited on the "healthy ratio" branch (Sí → input → good video → contact). */
const GOOD_BALANCE_SLIDE_ORDER = [
  'slide-1',
  'slide-2',
  'slide-3-input',
  'slide-5-good-video',
  'slide-6-good-contact',
] as const;

/**
 * Footer progress for omega decks. On the healthy-input path, shows "Paso n de 5" and ends at contact.
 */
export function getOmegaPresentationProgressLabel(
  presentation: Presentation,
  currentSlideIndex: number,
  currentSlideId: string,
  userAnswers: Record<string, unknown>,
): string {
  const full = presentation.slides.length;
  const saidYes = userAnswers['slide-2'] === 'Sí';
  const inputAns = userAnswers['slide-3-input'] as { omega3?: string; omega6?: string } | undefined;

  let committedUnhealthy = false;
  if (inputAns && typeof inputAns === 'object') {
    const o3 = parseFloat(String(inputAns.omega3 ?? ''));
    const o6 = parseFloat(String(inputAns.omega6 ?? ''));
    if (Number.isFinite(o3) && Number.isFinite(o6)) {
      committedUnhealthy = !isOmega63RatioHealthy(o3, o6);
    }
  }

  if (saidYes && !committedUnhealthy) {
    const idx = GOOD_BALANCE_SLIDE_ORDER.indexOf(
      currentSlideId as (typeof GOOD_BALANCE_SLIDE_ORDER)[number],
    );
    if (idx >= 0) {
      return `Paso ${idx + 1} de ${GOOD_BALANCE_SLIDE_ORDER.length}`;
    }
  }

  return `Paso ${currentSlideIndex + 1} de ${full}`;
}
