'use client';

import { useState, useEffect } from 'react';
import { TemplateData, StyleConfig } from '../types';
import { getAssetUrl } from '@/config/assets';

interface EnhancedLivePreviewProps {
  templateData: TemplateData;
  styleConfig: StyleConfig;
  customEffects: any;
  presentationSlides?: any[];
  animationPreset?: {
    heroAnimation: string;
    sectionAnimation: string;
    cardAnimation: string;
    duration: number;
    delay: number;
  };
}

export default function EnhancedLivePreview({ 
  templateData, 
  styleConfig, 
  customEffects,
  presentationSlides = [],
  animationPreset
}: EnhancedLivePreviewProps) {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);


  const getDeviceDimensions = () => {
    switch (deviceType) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'desktop':
        return { width: '100%', height: '600px' };
      default:
        return { width: '100%', height: '600px' };
    }
  };

  const dimensions = getDeviceDimensions();

  const renderSlide = (slideIndex: number) => {
    if (!presentationSlides || presentationSlides.length === 0) {
      return renderDefaultHero();
    }

    const slide = presentationSlides[slideIndex];
    if (!slide) return renderDefaultHero();

    switch (slide.type) {
      case 'personalized-hero':
        return renderPersonalizedHero(slide);
      case 'animated-hero':
        return renderAnimatedHero(slide);
      case 'hero':
        return renderHero(slide);
      case 'split':
        return renderSplit(slide);
      case 'grid':
        return renderGrid(slide);
      case 'stats':
        return renderStats(slide);
      case 'timeline':
        return renderTimeline(slide);
      case 'testimonials':
        return renderTestimonials(slide);
      case 'questionnaire':
        return renderQuestionnaire(slide);
      case 'contact':
        return renderContact(slide);
      default:
        return renderDefaultHero();
    }
  };

  const renderDefaultHero = () => (
    <div 
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(${customEffects.gradientAngle}deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%)`,
        fontFamily: styleConfig.typography.fontFamily,
        minHeight: deviceType === 'mobile' ? '100vh' : '600px',
        backdropFilter: `blur(${customEffects.blur}px)`,
        boxShadow: `0 ${customEffects.shadowIntensity}px ${customEffects.shadowIntensity * 2}px rgba(0, 0, 0, 0.3)`,
      }}
    >
      <div className="text-center text-white relative z-10 px-6">
        <h1 
          className={`font-bold mb-4 animate-${animationPreset?.heroAnimation || 'fadeIn'}`}
          style={{
            fontSize: deviceType === 'mobile' ? styleConfig.typography.fontSizes?.['3xl'] || '2.5rem' : 
                     deviceType === 'tablet' ? styleConfig.typography.fontSizes?.['4xl'] || '3.5rem' : 
                     styleConfig.typography.fontSizes?.['5xl'] || '4rem',
            color: styleConfig.colors.text?.primary || '#f8fafc',
            textShadow: `0 0 ${customEffects.glowIntensity}px ${styleConfig.colors.primary}`,
            fontFamily: styleConfig.typography.fontFamily,
            fontWeight: styleConfig.typography.fontWeights?.bold || 700,
            lineHeight: styleConfig.typography.lineHeights?.tight || 1.25,
            animationDuration: `${animationPreset?.duration || 0.8}s`,
            animationDelay: `${animationPreset?.delay || 0.2}s`,
          }}
        >
          {templateData.title}
        </h1>
        <p 
          className={`mb-6 opacity-90 animate-${animationPreset?.heroAnimation || 'slideUp'}`}
          style={{ 
            animationDelay: `${(animationPreset?.delay || 0.2) + 0.1}s`,
            animationDuration: `${animationPreset?.duration || 0.8}s`,
            fontSize: deviceType === 'mobile' ? styleConfig.typography.fontSizes?.base || '1rem' : styleConfig.typography.fontSizes?.lg || '1.25rem',
            color: styleConfig.colors.text?.secondary || '#cbd5e1',
            fontFamily: styleConfig.typography.fontFamily,
            fontWeight: styleConfig.typography.fontWeights?.normal || 400,
            lineHeight: styleConfig.typography.lineHeights?.normal || 1.5,
            letterSpacing: `${styleConfig.typography.letterSpacing || 0.025}em`,
          }}
        >
          {templateData.description}
        </p>
        {templateData.heroImage && (
          <div className={`animate-${animationPreset?.cardAnimation || 'scaleIn'}`} style={{ 
            animationDelay: `${(animationPreset?.delay || 0.2) + 0.2}s`,
            animationDuration: `${animationPreset?.duration || 0.8}s`,
          }}>
            <img 
              src={templateData.heroImage} 
              alt="Hero" 
              className="mx-auto rounded-xl shadow-2xl"
              style={{
                maxWidth: deviceType === 'mobile' ? '300px' : deviceType === 'tablet' ? '400px' : '500px',
                height: deviceType === 'mobile' ? '200px' : deviceType === 'tablet' ? '250px' : '300px',
                objectFit: 'cover',
                boxShadow: `0 25px 50px -12px ${styleConfig.colors.primary}40`,
                border: `2px solid ${styleConfig.colors.primary}20`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderPersonalizedHero = (slide: any) => (
    <div 
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: slide.backgroundGif ? 'none' : `linear-gradient(${customEffects.gradientAngle}deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%)`,
        fontFamily: styleConfig.typography.fontFamily,
        minHeight: deviceType === 'mobile' ? '100vh' : '600px',
      }}
    >
      {slide.backgroundGif && (
        <img 
          src={getAssetUrl(slide.backgroundGif)} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        />
      )}
      <div className="absolute inset-0 bg-black/30" style={{ zIndex: 2 }} />
      <div className="text-center text-white relative z-10 px-6">
        <h1 
          className="font-bold mb-4"
          style={{
            fontSize: deviceType === 'mobile' ? '3rem' : deviceType === 'tablet' ? '4rem' : '5rem',
            color: 'white',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
            fontFamily: styleConfig.typography.fontFamily,
            fontWeight: styleConfig.typography.fontWeights?.bold || 700,
          }}
        >
          {slide.title}
        </h1>
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:scale-105 transition-transform">
              {slide.subtitle}
            </button>
            <div className="mt-2 text-sm text-white/80">
              <div className="font-semibold">{slide.userName}</div>
              <div className="text-white/60">{slide.userEmail}</div>
            </div>
          </div>
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <div className="w-0 h-0 border-l-8 border-t-4 border-b-4 border-transparent border-l-white ml-1"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnimatedHero = (slide: any) => (
    <div 
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: slide.backgroundGif ? 'none' : `linear-gradient(${customEffects.gradientAngle}deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%)`,
        fontFamily: styleConfig.typography.fontFamily,
        minHeight: deviceType === 'mobile' ? '100vh' : '600px',
      }}
    >
      {slide.backgroundGif && (
        <img 
          src={getAssetUrl(slide.backgroundGif)} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        />
      )}
      <div className="absolute inset-0 bg-black/30" style={{ zIndex: 2 }} />
      <div className="text-center text-white relative z-10 px-6">
        <h1 
          className="font-bold mb-4"
          style={{
            fontSize: deviceType === 'mobile' ? '3rem' : deviceType === 'tablet' ? '4rem' : '4.5rem',
            color: 'white',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
            fontFamily: styleConfig.typography.fontFamily,
            fontWeight: styleConfig.typography.fontWeights?.bold || 700,
          }}
        >
          {slide.title}
        </h1>
        <h2 
          className="text-xl mb-4 text-white/90 mb-4"
          style={{ fontFamily: styleConfig.typography.fontFamily }}
        >
          {slide.subtitle}
        </h2>
        <p 
          className="text-lg opacity-80"
          style={{ 
            fontFamily: styleConfig.typography.fontFamily,
            lineHeight: styleConfig.typography.lineHeights?.normal || 1.5,
          }}
        >
          {slide.content}
        </p>
      </div>
    </div>
  );

  const renderHero = (slide: any) => renderDefaultHero();

  const renderSplit = (slide: any) => (
    <div 
      className="w-full h-full flex"
      style={{
        fontFamily: styleConfig.typography.fontFamily,
        minHeight: deviceType === 'mobile' ? '100vh' : '600px',
      }}
    >
      <div 
        className="flex-1 flex items-center justify-center"
        style={{
          background: `linear-gradient(${customEffects.gradientAngle}deg, ${styleConfig.colors.primary} 0%, ${styleConfig.colors.secondary} 100%)`,
        }}
      >
        {templateData.heroImage ? (
          <img 
            src={templateData.heroImage} 
            alt="About" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-6xl">🏢</div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center p-8 bg-white">
        <h2 
          className="font-bold mb-4"
          style={{
            fontSize: deviceType === 'mobile' ? '2rem' : '3rem',
            color: '#333',
            fontFamily: styleConfig.typography.fontFamily,
            fontWeight: styleConfig.typography.fontWeights?.bold || 700,
          }}
        >
          {slide.title}
        </h2>
        <p 
          className="text-lg text-gray-600"
          style={{ 
            fontFamily: styleConfig.typography.fontFamily,
            lineHeight: styleConfig.typography.lineHeights?.normal || 1.6,
          }}
        >
          {slide.content}
        </p>
      </div>
    </div>
  );

  const renderGrid = (slide: any) => (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-8"
      style={{
        background: `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)`,
        fontFamily: styleConfig.typography.fontFamily,
        minHeight: deviceType === 'mobile' ? '100vh' : '600px',
      }}
    >
      <h2 
        className="text-center font-bold mb-8"
        style={{
          fontSize: deviceType === 'mobile' ? '2rem' : '3rem',
          color: '#333',
          fontFamily: styleConfig.typography.fontFamily,
          fontWeight: styleConfig.typography.fontWeights?.bold || 700,
        }}
      >
        {slide.title}
      </h2>
      <p className="text-center text-xl mb-8 text-gray-600">{slide.content}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {slide.features?.map((feature: any, index: number) => (
          <div 
            key={index}
            className="text-center p-6 rounded-xl bg-white shadow-lg border border-gray-200"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStats = (slide: any) => (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-8"
      style={{
        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        fontFamily: styleConfig.typography.fontFamily,
        minHeight: deviceType === 'mobile' ? '100vh' : '600px',
      }}
    >
      <h2 
        className="text-center font-bold mb-4 text-white"
        style={{
          fontSize: deviceType === 'mobile' ? '2rem' : '3rem',
          fontFamily: styleConfig.typography.fontFamily,
          fontWeight: styleConfig.typography.fontWeights?.bold || 700,
        }}
      >
        {slide.title}
      </h2>
      <p className="text-center text-xl mb-8 text-white/90">{slide.content}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {slide.stats?.map((stat: any, index: number) => (
          <div 
            key={index}
            className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
            <div className="text-lg text-white/90">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTimeline = (slide: any) => (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-8"
      style={{
        background: `linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)`,
        fontFamily: styleConfig.typography.fontFamily,
        minHeight: deviceType === 'mobile' ? '100vh' : '600px',
      }}
    >
      <h2 
        className="text-center font-bold mb-4"
        style={{
          fontSize: deviceType === 'mobile' ? '2rem' : '3rem',
          color: '#333',
          fontFamily: styleConfig.typography.fontFamily,
          fontWeight: styleConfig.typography.fontWeights?.bold || 700,
        }}
      >
        {slide.title}
      </h2>
      <p className="text-center text-xl mb-8 text-gray-600">{slide.content}</p>
      <div className="w-full max-w-4xl">
        {slide.timeline?.map((item: any, index: number) => (
          <div key={index} className="flex items-start mb-6">
            <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-2"></div>
            <div className="ml-4">
              <div className="text-lg font-bold text-blue-500">{item.year}</div>
              <div className="text-xl font-semibold text-gray-800">{item.title}</div>
              <div className="text-gray-600">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTestimonials = (slide: any) => (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-8"
      style={{
        background: `linear-gradient(135deg, #2c3e50 0%, #34495e 100%)`,
        fontFamily: styleConfig.typography.fontFamily,
        minHeight: deviceType === 'mobile' ? '100vh' : '600px',
      }}
    >
      <h2 
        className="text-center font-bold mb-4 text-white"
        style={{
          fontSize: deviceType === 'mobile' ? '2rem' : '3rem',
          fontFamily: styleConfig.typography.fontFamily,
          fontWeight: styleConfig.typography.fontWeights?.bold || 700,
        }}
      >
        {slide.title}
      </h2>
      <p className="text-center text-xl mb-8 text-white/90">{slide.content}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {slide.testimonials?.map((testimonial: any, index: number) => (
          <div 
            key={index}
            className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
          >
            <div className="text-lg italic text-white mb-4">"{testimonial.quote}"</div>
            <div className="flex items-center">
              <div className="text-2xl mr-3">{testimonial.avatar}</div>
              <div>
                <div className="font-bold text-white">{testimonial.author}</div>
                <div className="text-white/80 text-sm">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestionnaire = (slide: any) => (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-8"
      style={{
        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        fontFamily: styleConfig.typography.fontFamily,
        minHeight: deviceType === 'mobile' ? '100vh' : '600px',
      }}
    >
      <h2 
        className="text-center font-bold mb-4 text-white"
        style={{
          fontSize: deviceType === 'mobile' ? '2rem' : '3rem',
          fontFamily: styleConfig.typography.fontFamily,
          fontWeight: styleConfig.typography.fontWeights?.bold || 700,
        }}
      >
        {slide.title}
      </h2>
      <p className="text-center text-xl mb-8 text-white/90">{slide.content}</p>
      <div className="w-full max-w-2xl">
        {slide.questions?.map((question: any, qIndex: number) => (
          <div key={qIndex} className="mb-8 p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">{question.question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {question.options?.map((option: any, oIndex: number) => (
                <button 
                  key={oIndex}
                  className="p-4 rounded-lg bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-colors"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContact = (slide: any) => (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-8"
      style={{
        background: `linear-gradient(135deg, #2c3e50 0%, #34495e 100%)`,
        fontFamily: styleConfig.typography.fontFamily,
        minHeight: deviceType === 'mobile' ? '100vh' : '600px',
      }}
    >
      <h2 
        className="text-center font-bold mb-4 text-white"
        style={{
          fontSize: deviceType === 'mobile' ? '2rem' : '3rem',
          fontFamily: styleConfig.typography.fontFamily,
          fontWeight: styleConfig.typography.fontWeights?.bold || 700,
        }}
      >
        {slide.title}
      </h2>
      <p className="text-center text-xl mb-8 text-white/90">{slide.content}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
        <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Email</h3>
          <p className="text-white/80">{slide.contactInfo?.email}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Phone</h3>
          <p className="text-white/80">{slide.contactInfo?.phone}</p>
        </div>
        <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Website</h3>
          <p className="text-white/80">{slide.contactInfo?.website}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Preview Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Live Preview</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">Live</span>
          </div>
          {presentationSlides && presentationSlides.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
              <span className="text-sm text-blue-400">
                Slide {currentSlide + 1} of {presentationSlides.length}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Slide Navigation */}
          {presentationSlides && presentationSlides.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentSlide(Math.min(presentationSlides.length - 1, currentSlide + 1))}
                disabled={currentSlide === presentationSlides.length - 1}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
              >
                Next →
              </button>
            </div>
          )}
          
          {/* Device Type Selector */}
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
            {(['mobile', 'tablet', 'desktop'] as const).map((device) => (
              <button
                key={device}
                onClick={() => setDeviceType(device)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                  deviceType === device
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {device === 'mobile' && '📱'}
                {device === 'tablet' && '📱'}
                {device === 'desktop' && '🖥️'}
                <span className="ml-1 capitalize">{device}</span>
              </button>
            ))}
          </div>
          
        </div>
      </div>

      {/* Iframe-like Preview Container */}
      <div className="relative">
        {/* Browser-like Frame */}
        <div className="bg-gray-800 rounded-t-xl border border-gray-700 shadow-2xl">
          {/* Browser Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-700 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="ml-4 px-3 py-1 bg-gray-600 rounded text-xs text-gray-300">
                {templateData.companyName || 'Your Website'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Live Preview</span>
            </div>
          </div>
          
          {/* Preview Content */}
          <div 
            className="relative overflow-hidden bg-white"
            style={{
              width: deviceType === 'desktop' ? '100%' : dimensions.width,
              height: dimensions.height,
              margin: deviceType === 'desktop' ? '0' : '0 auto',
              maxWidth: '100%',
            }}
          >
            {/* Dynamic Slide Content */}
            {renderSlide(currentSlide)}
          </div>
        </div>
        
        {/* Preview Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Auto-refresh enabled</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Responsive preview</span>
            </div>
            {presentationSlides && presentationSlides.length > 1 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {presentationSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? 'bg-white w-6'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/70">
                  {presentationSlides[currentSlide]?.type || 'slide'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
              📤 Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
