import { AnimationConfig } from './types';

export const sectionAnimations = {
  'fade-in': {
    type: 'fade-in' as const,
    duration: 800,
    easing: 'ease-out',
    delay: 0,
  },
  'slide-in-left': {
    type: 'slide-in-left' as const,
    duration: 1000,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
  },
  'slide-in-right': {
    type: 'slide-in-right' as const,
    duration: 1000,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
  },
  'bounce-in': {
    type: 'bounce-in' as const,
    duration: 1200,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    delay: 0,
  },
  'zoom-in': {
    type: 'zoom-in' as const,
    duration: 800,
    easing: 'ease-out',
    delay: 0,
  },
  'none': {
    type: 'none' as const,
    duration: 0,
    easing: 'ease',
    delay: 0,
  },
} as const;

export const getSectionAnimationCSS = (config: AnimationConfig) => {
  const { type, duration, easing, delay } = config;
  
  const baseStyles = `
    opacity: 0;
    transform: translateY(30px);
    transition: all ${duration}ms ${easing};
    transition-delay: ${delay}ms;
  `;

  switch (type) {
    case 'fade-in':
      return `
        ${baseStyles}
        &.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `;
    case 'slide-in-left':
      return `
        ${baseStyles}
        transform: translateX(-50px);
        &.visible {
          opacity: 1;
          transform: translateX(0);
        }
      `;
    case 'slide-in-right':
      return `
        ${baseStyles}
        transform: translateX(50px);
        &.visible {
          opacity: 1;
          transform: translateX(0);
        }
      `;
    case 'bounce-in':
      return `
        ${baseStyles}
        transform: translateY(50px) scale(0.8);
        &.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `;
    case 'zoom-in':
      return `
        ${baseStyles}
        transform: scale(0.8);
        &.visible {
          opacity: 1;
          transform: scale(1);
        }
      `;
    default:
      return baseStyles;
  }
};
