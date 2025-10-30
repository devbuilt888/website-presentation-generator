'use client';

import { useState, useEffect } from 'react';

interface AnimatedHeroProps {
  title: string;
  description: string;
  heroImage?: string;
}

export default function AnimatedHero({ title, description, heroImage }: AnimatedHeroProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Trigger initial animation
    setTimeout(() => setIsLoaded(true), 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-1500 ease-out ${
        isScrolled 
          ? 'h-20 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
          : 'h-screen bg-gradient-to-r from-blue-600 to-purple-600'
      }`}
    >
      <div className={`flex items-center justify-center h-full transition-all duration-1500 ease-out ${
        isScrolled ? 'scale-30' : 'scale-100'
      }`}>
        <div className="text-center text-white">
          <h1 
            className={`font-bold mb-4 transition-all duration-1500 ease-out ${
              isScrolled 
                ? 'text-2xl mb-0 transform -translate-y-2' 
                : 'text-6xl mb-4'
            }`}
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded 
                ? (isScrolled ? 'translateY(-10px)' : 'translateY(0)') 
                : 'translateY(30px)'
            }}
          >
            {title || 'Your Website Title'}
          </h1>
          
          <p 
            className={`transition-all duration-1500 ease-out ${
              isScrolled 
                ? 'text-sm mb-0 transform -translate-y-1' 
                : 'text-xl mb-8'
            }`}
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded 
                ? (isScrolled ? 'translateY(-5px)' : 'translateY(0)') 
                : 'translateY(30px)',
              transitionDelay: isLoaded ? '0.2s' : '0s'
            }}
          >
            {description || 'Your website description'}
          </p>
          
          {heroImage && (
            <img 
              src={heroImage} 
              alt="Hero" 
              className={`mx-auto rounded-lg shadow-lg transition-all duration-1500 ease-out ${
                isScrolled 
                  ? 'max-w-16 rounded' 
                  : 'max-w-md rounded-lg'
              }`}
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded 
                  ? (isScrolled ? 'scale(0.3)' : 'scale(1)') 
                  : 'translateY(30px)',
                transitionDelay: isLoaded ? '0.4s' : '0s'
              }}
            />
          )}
        </div>
      </div>
      
      {!isScrolled && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 text-sm animate-bounce">
          ↓ Scroll to see the magic happen ↓
        </div>
      )}
    </div>
  );
}
