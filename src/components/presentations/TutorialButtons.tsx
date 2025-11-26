'use client';

// Plus Button Component - matches dashboard style
export function PlusButton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer Glow Ring - Pulsing */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`absolute ${size === 'sm' ? 'w-16 h-16' : size === 'md' ? 'w-24 h-24' : 'w-32 h-32'} rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-indigo-500/30 animate-pulse blur-xl`} />
        <div className={`absolute ${size === 'sm' ? 'w-14 h-14' : size === 'md' ? 'w-20 h-20' : 'w-28 h-28'} rounded-full bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-indigo-400/20 animate-pulse blur-lg`} style={{ animationDelay: '0.5s' }} />
      </div>
      
      {/* Animated Background Ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`absolute ${size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24'} rounded-full border-2 border-indigo-400/30 animate-spin-slow`} style={{ animationDuration: '8s' }} />
        <div className={`absolute ${size === 'sm' ? 'w-14 h-14' : size === 'md' ? 'w-20 h-20' : 'w-28 h-28'} rounded-full border border-purple-400/20 animate-spin-slow`} style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
      </div>
      
      {/* Main Button */}
      <div
        className={`relative ${sizeClasses[size]} bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white font-light transition-all duration-300 border-2 border-indigo-400/60 group z-10`}
      >
        <span className="relative z-10 drop-shadow-lg">+</span>
        
        {/* Inner Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
      </div>
    </div>
  );
}

// Batch Import Button Component - matches dashboard style
export function BatchImportButton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]} bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg border border-emerald-500/50 transition-all duration-300`}>
      <span className="mr-2">📥</span>
      <span>Batch Import Contacts</span>
    </div>
  );
}

