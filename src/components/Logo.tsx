'use client';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon/Logo Symbol */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-lg blur-lg animate-pulse" />
        
        {/* Main logo shape */}
        <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg border border-indigo-400/50">
          <svg 
            className="w-2/3 h-2/3 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
      </div>
      
      {/* Text */}
      <span className={`font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent ${textSizes[size]}`}>
        PresenT
      </span>
    </div>
  );
}

