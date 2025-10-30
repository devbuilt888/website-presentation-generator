'use client';

import { StyleConfig } from '../types';
import { themes } from '../styles/themes';

interface ThemeSelectorProps {
  config: StyleConfig;
  onChange: (config: StyleConfig) => void;
}

export default function ThemeSelector({ config, onChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => onChange(theme)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                config.theme === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium capitalize">{key}</div>
              <div className="text-xs text-gray-500 mt-1">
                {theme.typography.fontFamily.split(',')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Colors
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Primary</label>
            <input
              type="color"
              value={config.colors.primary}
              onChange={(e) => onChange({
                ...config,
                colors: { ...config.colors, primary: e.target.value }
              })}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Secondary</label>
            <input
              type="color"
              value={config.colors.secondary}
              onChange={(e) => onChange({
                ...config,
                colors: { ...config.colors, secondary: e.target.value }
              })}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Accent</label>
            <input
              type="color"
              value={config.colors.accent}
              onChange={(e) => onChange({
                ...config,
                colors: { ...config.colors, accent: e.target.value }
              })}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Background</label>
            <input
              type="color"
              value={config.colors.background}
              onChange={(e) => onChange({
                ...config,
                colors: { ...config.colors, background: e.target.value }
              })}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Typography
        </label>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font Family</label>
            <select
              value={config.typography.fontFamily}
              onChange={(e) => onChange({
                ...config,
                typography: { ...config.typography, fontFamily: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Inter, system-ui, sans-serif">Inter</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Helvetica, Arial, sans-serif">Helvetica</option>
              <option value="Poppins, sans-serif">Poppins</option>
              <option value="Roboto, sans-serif">Roboto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Heading Size</label>
            <select
              value={config.typography.headingSize}
              onChange={(e) => onChange({
                ...config,
                typography: { ...config.typography, headingSize: e.target.value as any }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="large">Large</option>
              <option value="medium">Medium</option>
              <option value="small">Small</option>
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Layout
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Container Width</label>
            <select
              value={config.layout.containerWidth}
              onChange={(e) => onChange({
                ...config,
                layout: { ...config.layout, containerWidth: e.target.value as any }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full">Full Width</option>
              <option value="wide">Wide (1200px)</option>
              <option value="narrow">Narrow (800px)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Spacing</label>
            <select
              value={config.layout.spacing}
              onChange={(e) => onChange({
                ...config,
                layout: { ...config.layout, spacing: e.target.value as any }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tight">Tight</option>
              <option value="normal">Normal</option>
              <option value="loose">Loose</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
