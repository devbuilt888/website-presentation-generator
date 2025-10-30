import { StyleConfig } from '../types';

export const themes = {
  modern: {
    theme: 'modern' as const,
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: '#f8fafc',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingSize: 'large' as const,
    },
    layout: {
      containerWidth: 'wide' as const,
      spacing: 'normal' as const,
    },
  },
  classic: {
    theme: 'classic' as const,
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6',
      background: '#ffffff',
    },
    typography: {
      fontFamily: 'Georgia, serif',
      headingSize: 'medium' as const,
    },
    layout: {
      containerWidth: 'narrow' as const,
      spacing: 'loose' as const,
    },
  },
  minimal: {
    theme: 'minimal' as const,
    colors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#ef4444',
      background: '#ffffff',
    },
    typography: {
      fontFamily: 'Helvetica, Arial, sans-serif',
      headingSize: 'small' as const,
    },
    layout: {
      containerWidth: 'narrow' as const,
      spacing: 'tight' as const,
    },
  },
  creative: {
    theme: 'creative' as const,
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#fef3c7',
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
      headingSize: 'large' as const,
    },
    layout: {
      containerWidth: 'full' as const,
      spacing: 'loose' as const,
    },
  },
} as const;

export const getThemeCSS = (config: StyleConfig) => {
  const { colors, typography, layout } = config;
  
  return `
    :root {
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
      --color-background: ${colors.background};
      --font-family: ${typography.fontFamily};
      --container-width: ${layout.containerWidth === 'full' ? '100%' : layout.containerWidth === 'wide' ? '1200px' : '800px'};
      --spacing: ${layout.spacing === 'tight' ? '1rem' : layout.spacing === 'normal' ? '2rem' : '3rem'};
    }
    
    body {
      font-family: var(--font-family);
      background-color: var(--color-background);
    }
    
    .container {
      max-width: var(--container-width);
      margin: 0 auto;
      padding: 0 var(--spacing);
    }
    
    .section {
      padding: var(--spacing) 0;
    }
    
    .heading-${typography.headingSize} {
      font-size: ${typography.headingSize === 'large' ? '3rem' : typography.headingSize === 'medium' ? '2.5rem' : '2rem'};
      font-weight: bold;
      color: var(--color-primary);
    }
  `;
};
