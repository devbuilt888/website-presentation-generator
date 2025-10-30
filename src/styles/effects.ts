export interface EffectConfig {
  shadows: 'none' | 'subtle' | 'medium' | 'dramatic';
  borders: 'none' | 'thin' | 'medium' | 'thick';
  gradients: 'none' | 'subtle' | 'vibrant' | 'rainbow';
  blur: 'none' | 'light' | 'medium' | 'heavy';
}

export const effectConfigs = {
  shadows: {
    none: 'none',
    subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    dramatic: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  borders: {
    none: 'none',
    thin: '1px solid rgba(0, 0, 0, 0.1)',
    medium: '2px solid rgba(0, 0, 0, 0.2)',
    thick: '4px solid rgba(0, 0, 0, 0.3)',
  },
  gradients: {
    none: 'none',
    subtle: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    vibrant: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    rainbow: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
  },
  blur: {
    none: 'none',
    light: 'blur(2px)',
    medium: 'blur(5px)',
    heavy: 'blur(10px)',
  },
} as const;

export const getEffectCSS = (config: EffectConfig) => {
  const { shadows, borders, gradients, blur } = config;
  
  return `
    .effect-shadow-${shadows} {
      box-shadow: ${effectConfigs.shadows[shadows]};
    }
    
    .effect-border-${borders} {
      border: ${effectConfigs.borders[borders]};
    }
    
    .effect-gradient-${gradients} {
      background: ${effectConfigs.gradients[gradients]};
    }
    
    .effect-blur-${blur} {
      filter: ${effectConfigs.blur[blur]};
    }
    
    .hero-gradient {
      background: ${effectConfigs.gradients[gradients]};
    }
    
    .card-shadow {
      box-shadow: ${effectConfigs.shadows[shadows]};
      border: ${effectConfigs.borders[borders]};
    }
  `;
};
