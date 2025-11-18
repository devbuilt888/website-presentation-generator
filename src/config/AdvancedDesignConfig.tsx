'use client';

import { useState } from 'react';
import { advancedThemes } from '../styles/advanced-themes';

interface AdvancedDesignConfigProps {
  onThemeChange: (theme: any) => void;
  onEffectChange: (effects: any) => void;
}

export default function AdvancedDesignConfig({ onThemeChange, onEffectChange }: AdvancedDesignConfigProps) {
  const [selectedTheme, setSelectedTheme] = useState('glassmorphism');
  const [customEffects, setCustomEffects] = useState({
    blur: 20,
    shadowIntensity: 25,
    borderOpacity: 0.2,
    animationSpeed: 1,
    particleCount: 50,
    glowIntensity: 30
  });

  const handleThemeSelect = (themeKey: string) => {
    setSelectedTheme(themeKey);
    onThemeChange(advancedThemes[themeKey as keyof typeof advancedThemes]);
  };

  const handleEffectChange = (key: string, value: number) => {
    const newEffects = { ...customEffects, [key]: value };
    setCustomEffects(newEffects);
    onEffectChange(newEffects);
  };

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Advanced Themes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(advancedThemes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => handleThemeSelect(key)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedTheme === key
                  ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/25'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <div className="text-left">
                <div className="text-lg font-semibold text-white capitalize mb-2">
                  {key.replace('-', ' ')}
                </div>
                <div className="text-sm text-white/70 mb-3">
                  {theme.typography.fontFamily.split(',')[0]}
                </div>
                <div className="flex gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Effects */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Visual Effects</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-white/90 mb-2">Backdrop Blur</label>
            <input
              type="range"
              min="0"
              max="50"
              value={customEffects.blur}
              onChange={(e) => handleEffectChange('blur', parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-sm text-white/70 mt-1">{customEffects.blur}px</div>
          </div>

          <div>
            <label className="block text-white/90 mb-2">Shadow Intensity</label>
            <input
              type="range"
              min="0"
              max="50"
              value={customEffects.shadowIntensity}
              onChange={(e) => handleEffectChange('shadowIntensity', parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-sm text-white/70 mt-1">{customEffects.shadowIntensity}px</div>
          </div>

          <div>
            <label className="block text-white/90 mb-2">Border Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={customEffects.borderOpacity}
              onChange={(e) => handleEffectChange('borderOpacity', parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-sm text-white/70 mt-1">{Math.round(customEffects.borderOpacity * 100)}%</div>
          </div>

          <div>
            <label className="block text-white/90 mb-2">Animation Speed</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={customEffects.animationSpeed}
              onChange={(e) => handleEffectChange('animationSpeed', parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-sm text-white/70 mt-1">{customEffects.animationSpeed}x</div>
          </div>

          <div>
            <label className="block text-white/90 mb-2">Glow Intensity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={customEffects.glowIntensity}
              onChange={(e) => handleEffectChange('glowIntensity', parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-sm text-white/70 mt-1">{customEffects.glowIntensity}%</div>
          </div>
        </div>
      </div>

      {/* Animation Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Animation Effects</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['fade-in', 'slide-up', 'scale-in', 'rotate-in', 'bounce', 'pulse', 'glow', 'float'].map((animation) => (
            <button
              key={animation}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-white capitalize"
            >
              {animation.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Layout & Spacing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-white/90 mb-2">Container Width</label>
            <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white">
              <option value="narrow">Narrow (800px)</option>
              <option value="wide">Wide (1200px)</option>
              <option value="full">Full Width</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white/90 mb-2">Spacing</label>
            <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white">
              <option value="tight">Tight</option>
              <option value="normal">Normal</option>
              <option value="loose">Loose</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white/90 mb-2">Content Alignment</label>
            <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}






