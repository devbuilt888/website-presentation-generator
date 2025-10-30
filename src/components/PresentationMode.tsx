'use client';

import { useState, useEffect, useRef } from 'react';
import { TemplateData, StyleConfig } from '../types';
import { generateSpectacularPresentationHTML } from './SpectacularPresentation';

interface PresentationModeProps {
  templateData: TemplateData;
  styleConfig: StyleConfig;
  customEffects: any;
  presentationSlides: any[];
  isFullscreen: boolean;
  orientation: 'portrait' | 'landscape';
}

export default function PresentationMode({ 
  templateData, 
  styleConfig, 
  customEffects, 
  presentationSlides,
  isFullscreen, 
  orientation 
}: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  
  const slides = presentationSlides;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoPlay && isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 100 / (slides[currentSlide].duration / 100);
          if (newProgress >= 100) {
            setCurrentSlide(prev => (prev + 1) % slides.length);
            return 0;
          }
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlay, isPlaying, currentSlide, slides]);

  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [showControls]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setIsAutoPlay(true);
    } else {
      setIsAutoPlay(false);
    }
  };

  const handleSlideChange = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
    setProgress(0);
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const renderSlide = () => {
    switch (slides[currentSlide].id) {
      case 'hero':
        return (
          <div 
            className="w-full h-full flex items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(${customEffects.gradientAngle}deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%)`,
              fontFamily: styleConfig.typography.fontFamily,
            }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full animate-spin" />
            </div>
            
            <div className="text-center text-white relative z-10">
              <h1 
                className="text-6xl md:text-8xl font-bold mb-6 animate-fadeIn"
                style={{ 
                  fontSize: styleConfig.typography.headingSize === 'large' ? '6rem' : 
                           styleConfig.typography.headingSize === 'medium' ? '4rem' : '3rem',
                  textShadow: `0 0 20px ${styleConfig.colors.primary}`,
                }}
              >
                {templateData.title}
              </h1>
              <p 
                className="text-xl md:text-2xl mb-8 opacity-90 animate-slideUp"
                style={{ animationDelay: '0.5s' }}
              >
                {templateData.description}
              </p>
              {templateData.heroImage && (
                <div className="animate-scaleIn" style={{ animationDelay: '1s' }}>
                  <img 
                    src={templateData.heroImage} 
                    alt="Hero" 
                    className="mx-auto rounded-2xl max-w-md h-64 object-cover shadow-2xl"
                    style={{
                      boxShadow: `0 25px 50px -12px ${styleConfig.colors.primary}40`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'about':
        return (
          <div 
            className="w-full h-full flex items-center justify-center p-8"
            style={{
              background: styleConfig.colors.background,
              fontFamily: styleConfig.typography.fontFamily,
            }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 
                className="text-5xl md:text-6xl font-bold mb-8 animate-fadeIn"
                style={{ 
                  color: styleConfig.colors.primary,
                  fontSize: styleConfig.typography.headingSize === 'large' ? '4rem' : 
                           styleConfig.typography.headingSize === 'medium' ? '3rem' : '2.5rem',
                }}
              >
                About {templateData.companyName}
              </h2>
              <p 
                className="text-xl md:text-2xl leading-relaxed animate-slideUp"
                style={{ 
                  color: styleConfig.colors.text?.secondary || '#64748b',
                  animationDelay: '0.5s' 
                }}
              >
                {templateData.aboutText}
              </p>
            </div>
          </div>
        );

      case 'features':
        return (
          <div 
            className="w-full h-full flex items-center justify-center p-8"
            style={{
              background: styleConfig.colors.background,
              fontFamily: styleConfig.typography.fontFamily,
            }}
          >
            <div className="max-w-6xl mx-auto">
              <h2 
                className="text-5xl md:text-6xl font-bold mb-12 text-center animate-fadeIn"
                style={{ 
                  color: styleConfig.colors.primary,
                  fontSize: styleConfig.typography.headingSize === 'large' ? '4rem' : 
                           styleConfig.typography.headingSize === 'medium' ? '3rem' : '2.5rem',
                }}
              >
                Amazing Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: '🚀', title: 'Fast Performance', description: 'Lightning-fast loading times and smooth animations' },
                  { icon: '📱', title: 'Responsive Design', description: 'Perfect on all devices and screen sizes' },
                  { icon: '✨', title: 'Modern UI', description: 'Beautiful, contemporary design that impresses' },
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="text-center p-8 rounded-2xl glass-effect animate-scaleIn"
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      background: `linear-gradient(135deg, ${styleConfig.colors.primary}20, ${styleConfig.colors.secondary}20)`,
                      border: `1px solid ${styleConfig.colors.primary}30`,
                    }}
                  >
                    <div className="text-6xl mb-4">{feature.icon}</div>
                    <h3 className="text-2xl font-semibold mb-4" style={{ color: styleConfig.colors.primary }}>
                      {feature.title}
                    </h3>
                    <p className="text-lg" style={{ color: styleConfig.colors.text?.secondary || '#64748b' }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div 
            className="w-full h-full flex items-center justify-center p-8"
            style={{
              background: `linear-gradient(135deg, ${styleConfig.colors.primary}20, ${styleConfig.colors.secondary}20)`,
              fontFamily: styleConfig.typography.fontFamily,
            }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 
                className="text-5xl md:text-6xl font-bold mb-8 animate-fadeIn"
                style={{ 
                  color: styleConfig.colors.primary,
                  fontSize: styleConfig.typography.headingSize === 'large' ? '4rem' : 
                           styleConfig.typography.headingSize === 'medium' ? '3rem' : '2.5rem',
                }}
              >
                Get In Touch
              </h2>
              <div className="space-y-6 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                <div className="text-2xl">
                  <strong style={{ color: styleConfig.colors.primary }}>Email:</strong>
                  <span className="ml-4 text-xl">{templateData.contactEmail}</span>
                </div>
                {templateData.websiteUrl && (
                  <div className="text-2xl">
                    <strong style={{ color: styleConfig.colors.primary }}>Website:</strong>
                    <span className="ml-4 text-xl">{templateData.websiteUrl}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const presentationHTML = generateSpectacularPresentationHTML({
    templateData,
    styleConfig,
    customEffects,
    presentationSlides
  });

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black transition-all duration-500 ${
        orientation === 'portrait' 
          ? 'flex items-center justify-center' 
          : 'w-full h-full'
      }`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      {/* Portrait Mode - Video-like Display */}
      {orientation === 'portrait' && (
        <div className="relative w-full max-w-md mx-auto">
          {/* Video-like Container */}
          <div 
            className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl"
            style={{
              boxShadow: `0 25px 50px -12px ${styleConfig.colors.primary}40`,
            }}
          >
            <iframe
              srcDoc={presentationHTML}
              className="w-full h-full border-0"
              title="Presentation"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          
          {/* Darkened Overlay */}
          <div className="absolute inset-0 bg-black/20 rounded-2xl pointer-events-none" />
        </div>
      )}

      {/* Landscape Mode - Full Screen */}
      {orientation === 'landscape' && (
        <div className="w-full h-full">
          <iframe
            srcDoc={presentationHTML}
            className="w-full h-full border-0"
            title="Presentation"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-300 backdrop-blur-lg"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <div className="text-white text-sm">
                {currentSlide + 1} / {slides.length}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleFullscreen}
                className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-300 backdrop-blur-lg"
              >
                {isFullscreen ? '⤓' : '⤢'}
              </button>
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 pointer-events-auto">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}