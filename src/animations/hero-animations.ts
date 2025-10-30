import { AnimationConfig } from './types';

export const heroAnimations = {
  'slide-up': {
    type: 'slide-up' as const,
    duration: 1500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    delay: 0,
  },
  'fade-in': {
    type: 'fade-in' as const,
    duration: 1000,
    easing: 'ease-out',
    delay: 0,
  },
  'scale-down': {
    type: 'scale-down' as const,
    duration: 1200,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    delay: 0,
  },
  'parallax': {
    type: 'parallax' as const,
    duration: 2000,
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

export const getHeroAnimationCSS = (config: AnimationConfig) => {
  const { type, duration, easing, delay } = config;
  
  const baseStyles = `
    transition: all ${duration}ms ${easing};
    transition-delay: ${delay}ms;
  `;

  switch (type) {
    case 'slide-up':
      return `
        ${baseStyles}
        transform: translateY(0);
        opacity: 1;
      `;
    case 'fade-in':
      return `
        ${baseStyles}
        opacity: 1;
        transform: translateY(0);
      `;
    case 'scale-down':
      return `
        ${baseStyles}
        transform: scale(1);
        opacity: 1;
      `;
    case 'parallax':
      return `
        ${baseStyles}
        transform: translateY(0) scale(1);
        opacity: 1;
      `;
    default:
      return baseStyles;
  }
};

export const getHeroScrollAnimationCSS = (config: AnimationConfig) => {
  const { type, duration, easing } = config;
  
  const baseStyles = `
    transition: all ${duration}ms ${easing};
  `;

  switch (type) {
    case 'slide-up':
      return `
        ${baseStyles}
        height: 80px;
        align-items: center;
      `;
    case 'fade-in':
      return `
        ${baseStyles}
        height: 80px;
        opacity: 0.9;
      `;
    case 'scale-down':
      return `
        ${baseStyles}
        height: 80px;
        transform: scale(0.3);
      `;
    case 'parallax':
      return `
        ${baseStyles}
        height: 80px;
        transform: translateY(-20px) scale(0.3);
      `;
    default:
      return baseStyles;
  }
};
