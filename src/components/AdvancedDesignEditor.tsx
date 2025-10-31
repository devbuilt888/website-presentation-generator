'use client';

import { useState } from 'react';
import { AdvancedDesignSystem, modernDesignSystem } from '../styles/advanced-design-system';
import EnhancedLivePreview from './EnhancedLivePreview';

interface TemplateData {
  title?: string;
  description?: string;
  companyName?: string;
  aboutText?: string;
  contactEmail?: string;
  websiteUrl?: string;
  inviteeName?: string;
  inviteeEmail?: string;
  presentationTitle?: string;
  callToAction?: string;
  heroImage?: string;
}

interface EffectConfig {
  blur: number;
  shadowIntensity: number;
  borderOpacity: number;
  animationSpeed: number;
  glowIntensity: number;
  particleCount: number;
  gradientAngle: number;
  noiseIntensity: number;
  morphingSpeed: number;
  holographicIntensity: number;
  animationDelay?: number;
}

interface PresentationSlide {
  id?: string;
  title?: string;
  content?: string;
  backgroundImage?: string;
}

interface AdvancedDesignEditorProps {
  templateData: TemplateData;
  onStyleChange: (config: AdvancedDesignSystem) => void;
  onEffectChange: (effects: EffectConfig) => void;
  onContentChange: (field: string, value: string) => void;
  onImageUpload: (file: File) => void;
  presentationSlides?: PresentationSlide[];
  styleConfig?: AdvancedDesignSystem;
  customEffects?: EffectConfig;
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

interface TabButtonProps {
  tab: 'content' | 'colors' | 'typography' | 'effects' | 'animations' | 'layout';
  label: string;
  icon: string;
}

export default function AdvancedDesignEditor({ 
  templateData, 
  onStyleChange, 
  onEffectChange,
  onContentChange,
  onImageUpload,
  presentationSlides = [],
  styleConfig,
  customEffects
}: AdvancedDesignEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'colors' | 'typography' | 'effects' | 'animations' | 'layout'>('content');
  const [designSystem, setDesignSystem] = useState<AdvancedDesignSystem>(modernDesignSystem);
  const [localCustomEffects, setLocalCustomEffects] = useState<EffectConfig>({
    blur: 20,
    shadowIntensity: 25,
    borderOpacity: 0.2,
    animationSpeed: 1,
    glowIntensity: 30,
    particleCount: 50,
    gradientAngle: 135,
    noiseIntensity: 0.1,
    morphingSpeed: 2,
    holographicIntensity: 0.5
  });

  const [selectedColorHarmony, setSelectedColorHarmony] = useState<string>('Monochromatic');
  const [typographyScale, setTypographyScale] = useState({
    baseFontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0.025
  });
  const [selectedAnimationPreset, setSelectedAnimationPreset] = useState<string>('Smooth');
  const [selectedFont, setSelectedFont] = useState<string>('Inter');
  const [animationPresets] = useState({
    'Smooth': {
      heroAnimation: 'fadeIn',
      sectionAnimation: 'slideUp',
      cardAnimation: 'scaleIn',
      duration: 0.8,
      delay: 0.2
    },
    'Bounce': {
      heroAnimation: 'bounce',
      sectionAnimation: 'bounce',
      cardAnimation: 'bounce',
      duration: 1.2,
      delay: 0.3
    },
    'Slide': {
      heroAnimation: 'slideUp',
      sectionAnimation: 'slideLeft',
      cardAnimation: 'slideRight',
      duration: 0.6,
      delay: 0.1
    },
    'Scale': {
      heroAnimation: 'scaleIn',
      sectionAnimation: 'scaleIn',
      cardAnimation: 'scaleIn',
      duration: 0.7,
      delay: 0.15
    },
    'Fade': {
      heroAnimation: 'fadeIn',
      sectionAnimation: 'fadeIn',
      cardAnimation: 'fadeIn',
      duration: 1.0,
      delay: 0.25
    },
    'Pulse': {
      heroAnimation: 'pulse',
      sectionAnimation: 'pulse',
      cardAnimation: 'pulse',
      duration: 0.9,
      delay: 0.2
    }
  });


  const handleColorChange = (colorType: string, value: string) => {
    const newSystem = { ...designSystem };
    if (colorType.includes('.')) {
      const [parent, child] = colorType.split('.');
      (newSystem.colors as Record<string, Record<string, string> | string>)[parent] = { ...(newSystem.colors as Record<string, Record<string, string> | string>)[parent] as Record<string, string>, [child]: value };
    } else {
      (newSystem.colors as Record<string, string | Record<string, string>>)[colorType] = value;
    }
    setDesignSystem(newSystem);
    onStyleChange(newSystem);
  };

  const handleEffectChange = (key: string, value: number) => {
    const newEffects = { ...localCustomEffects, [key]: value };
    setLocalCustomEffects(newEffects);
    onEffectChange(newEffects);
  };

  const generateColorHarmony = (harmony: string, baseColor: string = '#3b82f6') => {
    // Convert hex to HSL for easier manipulation
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return [h * 360, s * 100, l * 100];
    };

    const hslToHex = (h: number, s: number, l: number) => {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const [h, s, l] = hexToHsl(baseColor);
    
    switch (harmony) {
      case 'Monochromatic':
        return {
          primary: baseColor,
          secondary: hslToHex(h, s * 0.7, l * 0.8),
          accent: hslToHex(h, s * 0.5, l * 1.2)
        };
      case 'Analogous':
        return {
          primary: baseColor,
          secondary: hslToHex((h + 30) % 360, s, l),
          accent: hslToHex((h - 30 + 360) % 360, s, l)
        };
      case 'Complementary':
        return {
          primary: baseColor,
          secondary: hslToHex((h + 180) % 360, s, l),
          accent: hslToHex((h + 180) % 360, s * 0.7, l * 1.1)
        };
      case 'Triadic':
        return {
          primary: baseColor,
          secondary: hslToHex((h + 120) % 360, s, l),
          accent: hslToHex((h + 240) % 360, s, l)
        };
      case 'Tetradic':
        return {
          primary: baseColor,
          secondary: hslToHex((h + 90) % 360, s, l),
          accent: hslToHex((h + 270) % 360, s, l)
        };
      case 'Split Complementary':
        return {
          primary: baseColor,
          secondary: hslToHex((h + 150) % 360, s, l),
          accent: hslToHex((h + 210) % 360, s, l)
        };
      default:
        return {
          primary: baseColor,
          secondary: baseColor,
          accent: baseColor
        };
    }
  };

  const handleColorHarmonyChange = (harmony: string) => {
    setSelectedColorHarmony(harmony);
    const newSystem = { ...designSystem };
    const harmonyColors = generateColorHarmony(harmony, newSystem.colors.primary);
    newSystem.colors.primary = harmonyColors.primary;
    newSystem.colors.secondary = harmonyColors.secondary;
    newSystem.colors.accent = harmonyColors.accent;
    setDesignSystem(newSystem);
    onStyleChange(newSystem);
  };

  const handleTypographyScaleChange = (key: string, value: number) => {
    const newScale = { ...typographyScale, [key]: value };
    setTypographyScale(newScale);
    
    // Update the design system with new typography values
    const newSystem = { ...designSystem };
    if (key === 'baseFontSize') {
      // Update font sizes based on base font size
      const scale = value / 16; // 16 is the default base
      newSystem.typography.fontSizes = {
        xs: `${0.75 * scale}rem`,
        sm: `${0.875 * scale}rem`,
        base: `${1 * scale}rem`,
        lg: `${1.125 * scale}rem`,
        xl: `${1.25 * scale}rem`,
        '2xl': `${1.5 * scale}rem`,
        '3xl': `${1.875 * scale}rem`,
        '4xl': `${2.25 * scale}rem`,
        '5xl': `${3 * scale}rem`
      };
    } else if (key === 'lineHeight') {
      newSystem.typography.lineHeights = {
        tight: value * 0.8,
        normal: value,
        relaxed: value * 1.2
      };
    } else if (key === 'letterSpacing') {
      // Apply letter spacing to the design system
      newSystem.typography.letterSpacing = value;
    }
    setDesignSystem(newSystem);
    onStyleChange(newSystem);
  };

  const handleAnimationPresetChange = (preset: string) => {
    setSelectedAnimationPreset(preset);
    const presetConfig = animationPresets[preset as keyof typeof animationPresets];
    
    // Update custom effects with animation preset
    const newEffects = { 
      ...(customEffects || localCustomEffects), 
      animationSpeed: presetConfig.duration,
      animationDelay: presetConfig.delay
    };
    onEffectChange(newEffects);
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    const newSystem = { ...designSystem };
    newSystem.typography.fontFamily = font;
    setDesignSystem(newSystem);
    onStyleChange(newSystem);
  };

  const handleContentChangeLocal = (field: string, value: string) => {
    onContentChange(field, value);
  };

  const handleImageUploadLocal = (file: File) => {
    onImageUpload(file);
  };


  const ColorPicker = ({ label, value, onChange, className = '' }: ColorPickerProps) => (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-white/90">{label}</label>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-lg cursor-pointer"
        />
        <div className="absolute inset-0 rounded-lg border border-white/30 pointer-events-none" />
      </div>
    </div>
  );

  const SliderControl = ({ label, value, onChange, min, max, step = 1, unit = '' }: SliderControlProps) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-white/90">{label}</label>
        <span className="text-sm text-white/70">{value}{unit}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );

  const TabButton = ({ tab, label, icon }: TabButtonProps) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
        activeTab === tab
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/20 to-pink-600/20 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-full animate-spin" />
      </div>


      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Enhanced Live Preview - Full Width */}
        <div className="mb-12">
          <EnhancedLivePreview
            templateData={templateData}
            styleConfig={styleConfig || designSystem}
            customEffects={customEffects || localCustomEffects}
            presentationSlides={presentationSlides}
            animationPreset={animationPresets[selectedAnimationPreset as keyof typeof animationPresets]}
          />
        </div>
        
        {/* Design Controls */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                <TabButton tab="content" label="Content" icon="📝" />
                <TabButton tab="colors" label="Colors" icon="🎨" />
                <TabButton tab="typography" label="Typography" icon="✍️" />
                <TabButton tab="effects" label="Effects" icon="✨" />
                <TabButton tab="animations" label="Animations" icon="🎬" />
                <TabButton tab="layout" label="Layout" icon="📐" />
              </div>
            </div>

            {/* Content Input */}
            {activeTab === 'content' && (
              <div className="space-y-8">
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Website Content</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Website Title</label>
                        <input
                          type="text"
                          value={templateData.title}
                          onChange={(e) => handleContentChangeLocal('title', e.target.value)}
                          placeholder="Enter your website title"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Description</label>
                        <textarea
                          value={templateData.description}
                          onChange={(e) => handleContentChangeLocal('description', e.target.value)}
                          placeholder="Brief description of your website"
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={templateData.companyName}
                          onChange={(e) => handleContentChangeLocal('companyName', e.target.value)}
                          placeholder="Your company name"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">About Text</label>
                        <textarea
                          value={templateData.aboutText}
                          onChange={(e) => handleContentChangeLocal('aboutText', e.target.value)}
                          placeholder="Tell your story..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Contact Email</label>
                        <input
                          type="email"
                          value={templateData.contactEmail}
                          onChange={(e) => handleContentChangeLocal('contactEmail', e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Website URL</label>
                        <input
                          type="url"
                          value={templateData.websiteUrl}
                          onChange={(e) => handleContentChangeLocal('websiteUrl', e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Presentation Personalization</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Invitee Name</label>
                        <input
                          type="text"
                          value={templateData.inviteeName || 'Miguel'}
                          onChange={(e) => handleContentChangeLocal('inviteeName', e.target.value)}
                          placeholder="Enter invitee name"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Invitee Email</label>
                        <input
                          type="email"
                          value={templateData.inviteeEmail || templateData.contactEmail}
                          onChange={(e) => handleContentChangeLocal('inviteeEmail', e.target.value)}
                          placeholder="Enter invitee email"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Presentation Title</label>
                        <input
                          type="text"
                          value={templateData.presentationTitle || 'Welcome to Our Presentation'}
                          onChange={(e) => handleContentChangeLocal('presentationTitle', e.target.value)}
                          placeholder="Enter presentation title"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Call to Action</label>
                        <input
                          type="text"
                          value={templateData.callToAction || 'Empezar demo'}
                          onChange={(e) => handleContentChangeLocal('callToAction', e.target.value)}
                          placeholder="Enter call to action text"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Hero Image</h3>
                  
                  <div className="space-y-4">
                    {templateData.heroImage ? (
                      <div className="relative">
                        <img 
                          src={templateData.heroImage} 
                          alt="Hero preview" 
                          className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                        />
                        <button
                          onClick={() => handleContentChangeLocal('heroImage', '')}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                        <div className="text-4xl mb-4">📷</div>
                        <p className="text-white/70 mb-4">Upload a hero image for your website</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUploadLocal(file);
                          }}
                          className="hidden"
                          id="hero-image-upload"
                        />
                        <label
                          htmlFor="hero-image-upload"
                          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 cursor-pointer"
                        >
                          Choose Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Color Controls */}
            {activeTab === 'colors' && (
              <div className="space-y-8">
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Color Palette</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ColorPicker
                      label="Primary Color"
                      value={designSystem.colors.primary}
                      onChange={(value: string) => handleColorChange('primary', value)}
                    />
                    <ColorPicker
                      label="Secondary Color"
                      value={designSystem.colors.secondary}
                      onChange={(value: string) => handleColorChange('secondary', value)}
                    />
                    <ColorPicker
                      label="Accent Color"
                      value={designSystem.colors.accent}
                      onChange={(value: string) => handleColorChange('accent', value)}
                    />
                    <ColorPicker
                      label="Background"
                      value={designSystem.colors.background}
                      onChange={(value: string) => handleColorChange('background', value)}
                    />
                    <ColorPicker
                      label="Surface"
                      value={designSystem.colors.surface}
                      onChange={(value: string) => handleColorChange('surface', value)}
                    />
                    <ColorPicker
                      label="Text Primary"
                      value={designSystem.colors.text.primary}
                      onChange={(value: string) => handleColorChange('text.primary', value)}
                    />
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Color Harmony</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Monochromatic', 'Analogous', 'Complementary', 'Triadic'].map((harmony) => (
                      <button
                        key={harmony}
                        onClick={() => handleColorHarmonyChange(harmony)}
                        className={`p-4 rounded-xl border transition-all duration-300 text-white text-center ${
                          selectedColorHarmony === harmony 
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300' 
                            : 'bg-white/10 hover:bg-white/20 border-white/20'
                        }`}
                      >
                        {harmony}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Typography Controls */}
            {activeTab === 'typography' && (
              <div className="space-y-8">
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Font Selection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'].map((font) => (
                      <button
                        key={font}
                        onClick={() => handleFontChange(font)}
                        className={`p-4 rounded-xl border transition-all duration-300 text-white text-center hover:scale-105 ${
                          selectedFont === font 
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300' 
                            : 'bg-white/10 hover:bg-white/20 border-white/20'
                        }`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Typography Scale</h3>
                  <div className="space-y-4">
                    <SliderControl
                      label="Base Font Size"
                      value={typographyScale.baseFontSize}
                      onChange={(value: number) => handleTypographyScaleChange('baseFontSize', value)}
                      min={12}
                      max={24}
                      unit="px"
                    />
                    <SliderControl
                      label="Line Height"
                      value={typographyScale.lineHeight}
                      onChange={(value: number) => handleTypographyScaleChange('lineHeight', value)}
                      min={1}
                      max={2}
                      step={0.1}
                    />
                    <SliderControl
                      label="Letter Spacing"
                      value={typographyScale.letterSpacing}
                      onChange={(value: number) => handleTypographyScaleChange('letterSpacing', value)}
                      min={-0.05}
                      max={0.1}
                      step={0.005}
                      unit="em"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Effects Controls */}
            {activeTab === 'effects' && (
              <div className="space-y-8">
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Visual Effects</h3>
                  <div className="space-y-6">
                    <SliderControl
                      label="Backdrop Blur"
                      value={customEffects.blur}
                      onChange={(value: number) => handleEffectChange('blur', value)}
                      min={0}
                      max={50}
                      unit="px"
                    />
                    <SliderControl
                      label="Shadow Intensity"
                      value={customEffects.shadowIntensity}
                      onChange={(value: number) => handleEffectChange('shadowIntensity', value)}
                      min={0}
                      max={50}
                      unit="px"
                    />
                    <SliderControl
                      label="Glow Intensity"
                      value={customEffects.glowIntensity}
                      onChange={(value: number) => handleEffectChange('glowIntensity', value)}
                      min={0}
                      max={100}
                      unit="%"
                    />
                    <SliderControl
                      label="Gradient Angle"
                      value={customEffects.gradientAngle}
                      onChange={(value: number) => handleEffectChange('gradientAngle', value)}
                      min={0}
                      max={360}
                      unit="°"
                    />
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Advanced Effects</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Glassmorphism', 'Neumorphism', 'Holographic', 'Particle', 'Morphing', 'Noise', 'Glitch', 'Hologram'].map((effect) => (
                      <button
                        key={effect}
                        className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-white text-center hover:scale-105"
                      >
                        {effect}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Animation Controls */}
            {activeTab === 'animations' && (
              <div className="space-y-8">
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Animation Presets</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(animationPresets).map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleAnimationPresetChange(preset)}
                        className={`p-4 rounded-xl border transition-all duration-300 text-white text-center hover:scale-105 ${
                          selectedAnimationPreset === preset 
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300' 
                            : 'bg-white/10 hover:bg-white/20 border-white/20'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Animation Settings</h3>
                  <div className="space-y-6">
                    <SliderControl
                      label="Animation Speed"
                      value={customEffects.animationSpeed}
                      onChange={(value: number) => handleEffectChange('animationSpeed', value)}
                      min={0.5}
                      max={3}
                      step={0.1}
                      unit="x"
                    />
                    <SliderControl
                      label="Morphing Speed"
                      value={customEffects.morphingSpeed}
                      onChange={(value: number) => handleEffectChange('morphingSpeed', value)}
                      min={0.5}
                      max={5}
                      step={0.1}
                      unit="x"
                    />
                    <SliderControl
                      label="Particle Count"
                      value={customEffects.particleCount}
                      onChange={(value: number) => handleEffectChange('particleCount', value)}
                      min={10}
                      max={200}
                      unit=""
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Layout Controls */}
            {activeTab === 'layout' && (
              <div className="space-y-8">
                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Layout System</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-white/90 mb-2">Container Width</label>
                      <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white">
                        <option value="sm">Small (640px)</option>
                        <option value="md">Medium (768px)</option>
                        <option value="lg">Large (1024px)</option>
                        <option value="xl">Extra Large (1280px)</option>
                        <option value="2xl">2X Large (1536px)</option>
                        <option value="full">Full Width</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/90 mb-2">Grid Columns</label>
                      <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white">
                        <option value="1">1 Column</option>
                        <option value="2">2 Columns</option>
                        <option value="3">3 Columns</option>
                        <option value="4">4 Columns</option>
                        <option value="6">6 Columns</option>
                        <option value="12">12 Columns</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/90 mb-2">Spacing</label>
                      <select className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white">
                        <option value="tight">Tight</option>
                        <option value="normal">Normal</option>
                        <option value="loose">Loose</option>
                        <option value="xl">Extra Loose</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Responsive Breakpoints</h3>
                  <div className="space-y-4">
                    {['Mobile', 'Tablet', 'Desktop', 'Large Desktop'].map((breakpoint, index) => (
                      <div key={breakpoint} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="text-white">{breakpoint}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/70 text-sm">768px</span>
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Preview Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Settings</h3>
                
                {/* Quick Color Picker */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Primary Color</label>
                    <input
                      type="color"
                      value={designSystem.colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-full h-12 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-lg cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Secondary Color</label>
                    <input
                      type="color"
                      value={designSystem.colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-full h-12 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-lg cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Background</label>
                    <input
                      type="color"
                      value={designSystem.colors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-full h-12 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-lg cursor-pointer"
                    />
                  </div>
                </div>
                
                {/* Quick Effects */}
                <div className="mt-6 space-y-4">
                  <SliderControl
                    label="Blur Effect"
                    value={customEffects.blur}
                    onChange={(value: number) => handleEffectChange('blur', value)}
                    min={0}
                    max={50}
                    unit="px"
                  />
                  
                  <SliderControl
                    label="Shadow Intensity"
                    value={customEffects.shadowIntensity}
                    onChange={(value: number) => handleEffectChange('shadowIntensity', value)}
                    min={0}
                    max={50}
                    unit="px"
                  />
                </div>
                
                {/* Quick Actions */}
                <div className="mt-6 space-y-2">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm">
                    Reset to Default
                  </button>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-sm">
                    Save Preset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Style Settings - Wider and More Stylish */}
        <div className="mt-12">
          <div className="glass-effect rounded-3xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Advanced Style Settings</h2>
                <p className="text-white/70">Fine-tune your design with precision controls</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-white/70">Auto-save enabled</span>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                  Reset to Default
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {/* Color Harmony */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Color Harmony</h3>
                <div className="space-y-3">
                  {['Monochromatic', 'Analogous', 'Complementary', 'Triadic', 'Tetradic', 'Split Complementary'].map((harmony) => (
                    <button
                      key={harmony}
                      onClick={() => handleColorHarmonyChange(harmony)}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 text-white text-left hover:scale-105 ${
                        selectedColorHarmony === harmony 
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300' 
                          : 'bg-white/5 hover:bg-white/10 border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{harmony}</span>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                          <div className="w-3 h-3 rounded-full bg-cyan-500" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Typography Scale */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Typography Scale</h3>
                <div className="space-y-4">
                  <SliderControl
                    label="Base Font Size"
                    value={typographyScale.baseFontSize}
                    onChange={(value: number) => handleTypographyScaleChange('baseFontSize', value)}
                    min={12}
                    max={24}
                    unit="px"
                  />
                  <SliderControl
                    label="Line Height"
                    value={typographyScale.lineHeight}
                    onChange={(value: number) => handleTypographyScaleChange('lineHeight', value)}
                    min={1}
                    max={2}
                    step={0.1}
                  />
                  <SliderControl
                    label="Letter Spacing"
                    value={typographyScale.letterSpacing}
                    onChange={(value: number) => handleTypographyScaleChange('letterSpacing', value)}
                    min={-0.05}
                    max={0.1}
                    step={0.005}
                    unit="em"
                  />
                </div>
              </div>
              
              {/* Visual Effects */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Visual Effects</h3>
                <div className="space-y-4">
                  <SliderControl
                    label="Backdrop Blur"
                    value={customEffects.blur}
                    onChange={(value: number) => handleEffectChange('blur', value)}
                    min={0}
                    max={50}
                    unit="px"
                  />
                  <SliderControl
                    label="Shadow Intensity"
                    value={customEffects.shadowIntensity}
                    onChange={(value: number) => handleEffectChange('shadowIntensity', value)}
                    min={0}
                    max={50}
                    unit="px"
                  />
                  <SliderControl
                    label="Glow Intensity"
                    value={customEffects.glowIntensity}
                    onChange={(value: number) => handleEffectChange('glowIntensity', value)}
                    min={0}
                    max={100}
                    unit="%"
                  />
                </div>
              </div>
              
              {/* Animation Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Animation Settings</h3>
                <div className="space-y-4">
                  <SliderControl
                    label="Animation Speed"
                    value={customEffects.animationSpeed}
                    onChange={(value: number) => handleEffectChange('animationSpeed', value)}
                    min={0.5}
                    max={3}
                    step={0.1}
                    unit="x"
                  />
                  <SliderControl
                    label="Morphing Speed"
                    value={customEffects.morphingSpeed}
                    onChange={(value: number) => handleEffectChange('morphingSpeed', value)}
                    min={0.5}
                    max={5}
                    step={0.1}
                    unit="x"
                  />
                  <SliderControl
                    label="Particle Count"
                    value={customEffects.particleCount}
                    onChange={(value: number) => handleEffectChange('particleCount', value)}
                    min={10}
                    max={200}
                    unit=""
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/25">
                  Save Preset
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/25">
                  Export CSS
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/25">
                  Share Design
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-orange-500/25">
                  Preview Full Screen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
}
