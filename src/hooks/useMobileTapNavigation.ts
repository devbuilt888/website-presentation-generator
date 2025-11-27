'use client';

import { useEffect, useRef, useState } from 'react';

interface UseMobileTapNavigationOptions {
  onLeftTap?: () => void;
  onRightTap?: () => void;
  enabled?: boolean;
  allowBackward?: boolean;
  isInputSlide?: boolean;
}

/**
 * Hook for mobile tap navigation on left/right screen halves
 * Only works on mobile devices
 */
export function useMobileTapNavigation({
  onLeftTap,
  onRightTap,
  enabled = true,
  allowBackward = true,
  isInputSlide = false,
}: UseMobileTapNavigationOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !enabled || isInputSlide) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (!containerRef.current) return;

      const touch = e.touches[0];
      const containerRect = containerRef.current.getBoundingClientRect();
      const touchX = touch.clientX - containerRect.left;
      const containerWidth = containerRect.width;
      const halfWidth = containerWidth / 2;

      // Determine if tap is on left or right half
      if (touchX < halfWidth) {
        // Left half - go to previous slide (if allowed)
        if (allowBackward && onLeftTap) {
          e.preventDefault();
          onLeftTap();
        }
      } else {
        // Right half - go to next slide
        if (onRightTap) {
          e.preventDefault();
          onRightTap();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [isMobile, enabled, isInputSlide, allowBackward, onLeftTap, onRightTap]);

  return { containerRef, isMobile };
}

/**
 * Check if a slide is an input slide (requires user interaction)
 */
export function isInputSlide(slide: any): boolean {
  if (!slide) return false;

  // Check slide type
  const inputTypes = ['quiz', 'questionnaire'];
  if (inputTypes.includes(slide.type)) {
    return true;
  }

  // Check if slide ID indicates input
  const inputSlideIds = [
    'slide-2', // Yes/No question
    'slide-3-input', // Omega input
    'slide-8-question', // Question slide
  ];

  if (inputSlideIds.includes(slide.id)) {
    return true;
  }

  // Check if slide has questions
  if (slide.questions && slide.questions.length > 0) {
    return true;
  }

  return false;
}

/**
 * Check if a presentation only allows forward navigation
 */
export function isForwardOnlyPresentation(presentationId: string): boolean {
  const forwardOnlyPresentations = [
    'omega-balance',
    'omega-balance-space',
    'omega-balance-plus',
    'omega-balance-new',
  ];

  return forwardOnlyPresentations.includes(presentationId);
}

