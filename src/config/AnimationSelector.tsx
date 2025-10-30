'use client';

import { AnimationConfig } from '../animations/types';
import { heroAnimations } from '../animations/hero-animations';
import { sectionAnimations } from '../animations/section-animations';

interface AnimationSelectorProps {
  type: 'hero' | 'section';
  config: AnimationConfig;
  onChange: (config: AnimationConfig) => void;
  label: string;
}

export default function AnimationSelector({ type, config, onChange, label }: AnimationSelectorProps) {
  const animations = type === 'hero' ? heroAnimations : sectionAnimations;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="space-y-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Animation Type</label>
          <select
            value={config.type}
            onChange={(e) => onChange({ ...config, type: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(animations).map((key) => (
              <option key={key} value={key}>
                {key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Duration (ms)</label>
            <input
              type="number"
              value={config.duration}
              onChange={(e) => onChange({ ...config, duration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="5000"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Delay (ms)</label>
            <input
              type="number"
              value={config.delay || 0}
              onChange={(e) => onChange({ ...config, delay: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="2000"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Easing</label>
          <select
            value={config.easing}
            onChange={(e) => onChange({ ...config, easing: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ease">Ease</option>
            <option value="ease-in">Ease In</option>
            <option value="ease-out">Ease Out</option>
            <option value="ease-in-out">Ease In Out</option>
            <option value="linear">Linear</option>
            <option value="cubic-bezier(0.4, 0, 0.2, 1)">Cubic Bezier</option>
            <option value="cubic-bezier(0.25, 0.46, 0.45, 0.94)">Ease Out Quart</option>
            <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">Bounce</option>
          </select>
        </div>
      </div>
    </div>
  );
}
