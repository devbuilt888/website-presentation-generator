'use client';

import { useState } from 'react';
import AdvancedDesignConfig from '../config/AdvancedDesignConfig';
import { advancedThemes } from '../styles/advanced-themes';

interface EnhancedDesignPageProps {
  templateData: any;
  styleConfig: any;
  onStyleChange: (config: any) => void;
  onEffectChange: (effects: any) => void;
}

export default function EnhancedDesignPage({ 
  templateData, 
  styleConfig, 
  onStyleChange, 
  onEffectChange 
}: EnhancedDesignPageProps) {
  const [activeTab, setActiveTab] = useState<'themes' | 'effects' | 'layout' | 'animations'>('themes');
  const [selectedTheme, setSelectedTheme] = useState('glassmorphism');
  const [customEffects, setCustomEffects] = useState({
    blur: 20,
    shadowIntensity: 25,
    borderOpacity: 0.2,
    animationSpeed: 1,
    glowIntensity: 30
  });

  const handleThemeSelect = (themeKey: string) => {
    setSelectedTheme(themeKey);
    const theme = advancedThemes[themeKey as keyof typeof advancedThemes];
    onStyleChange(theme);
  };

  const handleEffectChange = (effects: any) => {
    setCustomEffects(effects);
    onEffectChange(effects);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Advanced Design Studio</h1>
            <div className="flex gap-2">
              {['themes', 'effects', 'layout', 'animations'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Design Controls */}
          <div className="lg:col-span-2">
            {activeTab === 'themes' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Theme Selection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(advancedThemes).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => handleThemeSelect(key)}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${
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
                          <div className="flex gap-2 mb-3">
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
                          <div className="text-xs text-white/50">
                            {theme.layout.containerWidth} • {theme.layout.spacing} spacing
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'effects' && (
              <div className="space-y-6">
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
                        onChange={(e) => handleEffectChange({...customEffects, blur: parseInt(e.target.value)})}
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
                        onChange={(e) => handleEffectChange({...customEffects, shadowIntensity: parseInt(e.target.value)})}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-sm text-white/70 mt-1">{customEffects.shadowIntensity}px</div>
                    </div>

                    <div>
                      <label className="block text-white/90 mb-2">Glow Intensity</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={customEffects.glowIntensity}
                        onChange={(e) => handleEffectChange({...customEffects, glowIntensity: parseInt(e.target.value)})}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-sm text-white/70 mt-1">{customEffects.glowIntensity}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6">
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
            )}

            {activeTab === 'animations' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Animation Effects</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['fade-in', 'slide-up', 'scale-in', 'rotate-in', 'bounce', 'pulse', 'glow', 'float'].map((animation) => (
                      <button
                        key={animation}
                        className="p-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-white capitalize hover:scale-105"
                      >
                        {animation.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-4">Live Preview</h3>
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className="text-white p-6 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%)`,
                    fontFamily: styleConfig.typography.fontFamily,
                    backdropFilter: `blur(${customEffects.blur}px)`,
                    boxShadow: `0 ${customEffects.shadowIntensity}px ${customEffects.shadowIntensity * 2}px rgba(0, 0, 0, 0.3)`,
                  }}
                >
                  <h4 
                    className="font-bold mb-2"
                    style={{
                      fontSize: styleConfig.typography.headingSize === 'large' ? '1.5rem' : 
                               styleConfig.typography.headingSize === 'medium' ? '1.25rem' : '1rem'
                    }}
                  >
                    {templateData.title}
                  </h4>
                  <p className="text-sm mb-4 opacity-90">{templateData.description}</p>
                  {templateData.heroImage && (
                    <img 
                      src={templateData.heroImage} 
                      alt="Hero" 
                      className="mx-auto rounded-lg max-w-32 h-20 object-cover"
                    />
                  )}
                </div>
                
                <div className="p-4 space-y-3" style={{ fontFamily: styleConfig.typography.fontFamily }}>
                  <div>
                    <h5 
                      className="font-semibold mb-1"
                      style={{ color: styleConfig.colors.primary }}
                    >
                      About {templateData.companyName}
                    </h5>
                    <p className="text-sm text-gray-600 line-clamp-2">{templateData.aboutText}</p>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span 
                        className="ml-1"
                        style={{ color: styleConfig.colors.primary }}
                      >
                        {templateData.contactEmail}
                      </span>
                    </div>
                    {templateData.websiteUrl && (
                      <div className="text-sm mt-1">
                        <span className="font-medium text-gray-700">Website:</span>
                        <span 
                          className="ml-1"
                          style={{ color: styleConfig.colors.primary }}
                        >
                          {templateData.websiteUrl}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




