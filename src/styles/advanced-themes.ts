import { StyleConfig } from '../types';

export const advancedThemes = {
  'glassmorphism': {
    theme: 'glassmorphism' as const,
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingSize: 'large' as const,
    },
    layout: {
      containerWidth: 'wide' as const,
      spacing: 'normal' as const,
    },
    effects: {
      backdrop: 'blur(20px)',
      shadows: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      borders: '1px solid rgba(255, 255, 255, 0.2)',
      gradients: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    }
  },
  'neomorphism': {
    theme: 'neomorphism' as const,
    colors: {
      primary: '#e0e0e0',
      secondary: '#f0f0f0',
      accent: '#6366f1',
      background: '#f5f5f5',
    },
    typography: {
      fontFamily: 'Poppins, sans-serif',
      headingSize: 'large' as const,
    },
    layout: {
      containerWidth: 'wide' as const,
      spacing: 'normal' as const,
    },
    effects: {
      shadows: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
      borders: 'none',
      gradients: 'linear-gradient(145deg, #f0f0f0, #cacaca)',
    }
  },
  'cyberpunk': {
    theme: 'cyberpunk' as const,
    colors: {
      primary: '#00ff88',
      secondary: '#ff0080',
      accent: '#00ffff',
      background: '#0a0a0a',
    },
    typography: {
      fontFamily: 'Orbitron, monospace',
      headingSize: 'large' as const,
    },
    layout: {
      containerWidth: 'full' as const,
      spacing: 'tight' as const,
    },
    effects: {
      shadows: '0 0 20px #00ff88, 0 0 40px #00ff88',
      borders: '2px solid #00ff88',
      gradients: 'linear-gradient(45deg, #ff0080, #00ff88)',
      animations: 'pulse, glow, neon'
    }
  },
  'minimal-dark': {
    theme: 'minimal-dark' as const,
    colors: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      accent: '#6366f1',
      background: '#000000',
    },
    typography: {
      fontFamily: 'Helvetica, Arial, sans-serif',
      headingSize: 'medium' as const,
    },
    layout: {
      containerWidth: 'narrow' as const,
      spacing: 'loose' as const,
    },
    effects: {
      shadows: 'none',
      borders: '1px solid #333333',
      gradients: 'none',
    }
  },
  'gradient-mesh': {
    theme: 'gradient-mesh' as const,
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#45b7d1',
      background: 'radial-gradient(circle at 20% 80%, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #feca57 100%)',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      headingSize: 'large' as const,
    },
    layout: {
      containerWidth: 'full' as const,
      spacing: 'loose' as const,
    },
    effects: {
      shadows: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      borders: 'none',
      gradients: 'complex mesh gradients',
      animations: 'floating, morphing'
    }
  }
} as const;

export const getAdvancedThemeCSS = (config: any) => {
  const { colors, typography, layout, effects } = config;
  
  return `
    :root {
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
      --color-background: ${colors.background};
      --font-family: ${typography.fontFamily};
      --container-width: ${layout.containerWidth === 'full' ? '100%' : layout.containerWidth === 'wide' ? '1400px' : '800px'};
      --spacing: ${layout.spacing === 'tight' ? '1rem' : layout.spacing === 'normal' ? '2rem' : '4rem'};
      --backdrop-blur: ${effects.backdrop || 'none'};
      --shadow-primary: ${effects.shadows || 'none'};
      --border-style: ${effects.borders || 'none'};
      --gradient-bg: ${effects.gradients || 'none'};
    }
    
    body {
      font-family: var(--font-family);
      background: var(--color-background);
      overflow-x: hidden;
    }
    
    .container {
      max-width: var(--container-width);
      margin: 0 auto;
      padding: 0 var(--spacing);
    }
    
    .section {
      padding: var(--spacing) 0;
    }
    
    .glass-effect {
      background: var(--gradient-bg);
      backdrop-filter: var(--backdrop-blur);
      border: var(--border-style);
      box-shadow: var(--shadow-primary);
    }
    
    .neomorphic {
      background: var(--color-background);
      box-shadow: var(--shadow-primary);
      border: var(--border-style);
    }
    
    .cyber-glow {
      box-shadow: var(--shadow-primary);
      border: var(--border-style);
      animation: ${effects.animations?.includes('glow') ? 'glow 2s ease-in-out infinite alternate' : 'none'};
    }
    
    @keyframes glow {
      from { box-shadow: 0 0 20px var(--color-primary); }
      to { box-shadow: 0 0 30px var(--color-primary), 0 0 40px var(--color-primary); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes floating {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `;
};




