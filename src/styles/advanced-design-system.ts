export interface AdvancedDesignSystem {
  // Color System
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    shadow: string;
  };
  
  // Typography System
  typography: {
    fontFamily: string;
    fontWeights: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    lineHeights: {
      tight: number;
      normal: number;
      relaxed: number;
    };
    letterSpacing?: number;
  };
  
  // Spacing System
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  
  // Border Radius System
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  
  // Shadow System
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
  };
  
  // Effects System
  effects: {
    backdropBlur: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    filters: {
      grayscale: string;
      sepia: string;
      blur: string;
      brightness: string;
      contrast: string;
      saturate: string;
    };
    transforms: {
      scale: string;
      rotate: string;
      skew: string;
      translate: string;
    };
  };
  
  // Animation System
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      linear: string;
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
      bounce: string;
      elastic: string;
    };
    keyframes: {
      fadeIn: string;
      slideUp: string;
      slideDown: string;
      slideLeft: string;
      slideRight: string;
      scaleIn: string;
      scaleOut: string;
      rotate: string;
      bounce: string;
      pulse: string;
      shake: string;
    };
  };
  
  // Layout System
  layout: {
    container: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      full: string;
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    grid: {
      columns: number;
      gap: string;
    };
  };
}

export const modernDesignSystem: AdvancedDesignSystem = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#0f172a',
    surface: '#1e293b',
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#64748b',
    },
    border: '#334155',
    shadow: '#000000',
  },
  
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: 0.025,
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  effects: {
    backdropBlur: {
      none: 'blur(0px)',
      sm: 'blur(4px)',
      md: 'blur(8px)',
      lg: 'blur(16px)',
      xl: 'blur(24px)',
    },
    filters: {
      grayscale: 'grayscale(100%)',
      sepia: 'sepia(100%)',
      blur: 'blur(8px)',
      brightness: 'brightness(1.2)',
      contrast: 'contrast(1.2)',
      saturate: 'saturate(1.2)',
    },
    transforms: {
      scale: 'scale(1.05)',
      rotate: 'rotate(5deg)',
      skew: 'skew(5deg)',
      translate: 'translateY(-10px)',
    },
  },
  
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    keyframes: {
      fadeIn: 'fadeIn 0.5s ease-out',
      slideUp: 'slideUp 0.5s ease-out',
      slideDown: 'slideDown 0.5s ease-out',
      slideLeft: 'slideLeft 0.5s ease-out',
      slideRight: 'slideRight 0.5s ease-out',
      scaleIn: 'scaleIn 0.5s ease-out',
      scaleOut: 'scaleOut 0.5s ease-out',
      rotate: 'rotate 0.5s ease-out',
      bounce: 'bounce 0.5s ease-out',
      pulse: 'pulse 0.5s ease-out',
      shake: 'shake 0.5s ease-out',
    },
  },
  
  layout: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      full: '100%',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    grid: {
      columns: 12,
      gap: '1rem',
    },
  },
};

const getFontFamilyCSS = (fontName: string) => {
  const fontMap: { [key: string]: string } = {
    'Inter': 'var(--font-inter), system-ui, sans-serif',
    'Poppins': 'var(--font-poppins), system-ui, sans-serif',
    'Roboto': 'var(--font-roboto), system-ui, sans-serif',
    'Open Sans': 'var(--font-open-sans), system-ui, sans-serif',
    'Lato': 'var(--font-lato), system-ui, sans-serif',
    'Montserrat': 'var(--font-montserrat), system-ui, sans-serif',
  };
  return fontMap[fontName] || `${fontName}, system-ui, sans-serif`;
};

export const generateAdvancedCSS = (system: AdvancedDesignSystem) => {
  return `
    :root {
      /* Color Variables */
      --color-primary: ${system.colors.primary};
      --color-secondary: ${system.colors.secondary};
      --color-accent: ${system.colors.accent};
      --color-background: ${system.colors.background};
      --color-surface: ${system.colors.surface};
      --color-text-primary: ${system.colors.text.primary};
      --color-text-secondary: ${system.colors.text.secondary};
      --color-text-muted: ${system.colors.text.muted};
      --color-border: ${system.colors.border};
      --color-shadow: ${system.colors.shadow};
      
      /* Typography Variables */
      --font-family: ${getFontFamilyCSS(system.typography.fontFamily)};
      --font-weight-light: ${system.typography.fontWeights.light};
      --font-weight-normal: ${system.typography.fontWeights.normal};
      --font-weight-medium: ${system.typography.fontWeights.medium};
      --font-weight-semibold: ${system.typography.fontWeights.semibold};
      --font-weight-bold: ${system.typography.fontWeights.bold};
      
      /* Spacing Variables */
      --spacing-xs: ${system.spacing.xs};
      --spacing-sm: ${system.spacing.sm};
      --spacing-md: ${system.spacing.md};
      --spacing-lg: ${system.spacing.lg};
      --spacing-xl: ${system.spacing.xl};
      --spacing-2xl: ${system.spacing['2xl']};
      --spacing-3xl: ${system.spacing['3xl']};
      --spacing-4xl: ${system.spacing['4xl']};
      
      /* Border Radius Variables */
      --radius-none: ${system.borderRadius.none};
      --radius-sm: ${system.borderRadius.sm};
      --radius-md: ${system.borderRadius.md};
      --radius-lg: ${system.borderRadius.lg};
      --radius-xl: ${system.borderRadius.xl};
      --radius-2xl: ${system.borderRadius['2xl']};
      --radius-full: ${system.borderRadius.full};
      
      /* Shadow Variables */
      --shadow-none: ${system.shadows.none};
      --shadow-sm: ${system.shadows.sm};
      --shadow-md: ${system.shadows.md};
      --shadow-lg: ${system.shadows.lg};
      --shadow-xl: ${system.shadows.xl};
      --shadow-2xl: ${system.shadows['2xl']};
      --shadow-inner: ${system.shadows.inner};
      
      /* Animation Variables */
      --duration-fast: ${system.animations.duration.fast};
      --duration-normal: ${system.animations.duration.normal};
      --duration-slow: ${system.animations.duration.slow};
      
      /* Layout Variables */
      --container-sm: ${system.layout.container.sm};
      --container-md: ${system.layout.container.md};
      --container-lg: ${system.layout.container.lg};
      --container-xl: ${system.layout.container.xl};
      --container-2xl: ${system.layout.container['2xl']};
      --container-full: ${system.layout.container.full};
    }
    
    /* Keyframe Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideLeft {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideRight {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes scaleOut {
      from { transform: scale(1.1); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes rotate {
      from { transform: rotate(-5deg); opacity: 0; }
      to { transform: rotate(0deg); opacity: 1; }
    }
    
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
      40%, 43% { transform: translateY(-10px); }
      70% { transform: translateY(-5px); }
      90% { transform: translateY(-2px); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
      20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
    
    /* Utility Classes */
    .glass-effect {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }
    
    .neumorphic {
      background: var(--color-surface);
      box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .gradient-border {
      position: relative;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
    }
    
    .gradient-border::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 2px;
      background: linear-gradient(45deg, var(--color-primary), var(--color-secondary), var(--color-accent));
      border-radius: inherit;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: xor;
    }
    
    .floating {
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    .glow {
      box-shadow: 0 0 20px var(--color-primary);
    }
    
    .text-glow {
      text-shadow: 0 0 10px var(--color-primary);
    }
  `;
};
