'use client';

import { useState, useMemo } from 'react';
import { Presentation } from '@/data/presentations';
import { getAssetUrl } from '@/config/assets';
import { saveUserResponse, logStoreLinkClick } from '@/lib/services/instances';
import { isOmega63RatioHealthy } from '@/lib/utils/omega-balance-ratio';
import { getOmegaPresentationProgressLabel } from '@/lib/utils/omega-presentation-progress';
import { resolvePresentationContactPhone } from '@/lib/utils/presentation-contact-phone';
import PresentationPhoneCopyButton from '@/components/PresentationPhoneCopyButton';
import { useMobileTapNavigation, isInputSlide } from '@/hooks/useMobileTapNavigation';
import VimondHealthProtocolEmbed from '@/components/VimondHealthProtocolEmbed';
import IframeEmbedWithSpinner from '@/components/IframeEmbedWithSpinner';
import VideoFileWithSpinner from '@/components/VideoFileWithSpinner';

// CSS-based Pattern Background Component
function PatternBackgroundCSS({ currentSlideIndex }: { currentSlideIndex: number }) {
  const imageUrls = useMemo(() => [
    getAssetUrl('assets/zinzi-special-assets/balanceOil-one.png'),
    getAssetUrl('assets/zinzi-special-assets/balanceOil-two.png'),
    getAssetUrl('assets/zinzi-special-assets/xtend-one.png'),
  ], []);

  const tilesPerRow = 5; // More tiles per row = smaller images (halved from 10)
  const rowsPerSet = 15; // More rows = smoother scrolling
  const totalRows = rowsPerSet * 3; // 3 sets for seamless looping
  const rowHeight = 120; // Height of each row in pixels (slightly increased)
  const columnGap = 16; // Gap between columns in pixels (doubled for more spacing)
  const rowGap = 48; // Gap between rows in pixels (doubled for much more vertical spacing)
  const padding = 16; // Padding in pixels
  // Calculate set height: rows * rowHeight + (rows - 1) rowGaps + 2 * padding
  const setHeight = rowsPerSet * rowHeight + (rowsPerSet - 1) * rowGap + padding * 2;
  // Total height: totalRows * rowHeight + (totalRows - 1) rowGaps + 2 * padding
  const totalHeight = totalRows * rowHeight + (totalRows - 1) * rowGap + padding * 2;
  const scrollDistance = setHeight; // Distance to scroll (one set height)

  return (
    <>
      <style>{`
        /* Slide 1: Upward scroll */
        @keyframes patternScrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-${scrollDistance}px); }
        }
        /* Slide 2: Downward scroll */
        @keyframes patternScrollDown {
          0% { transform: translateY(-${scrollDistance}px); }
          100% { transform: translateY(0); }
        }
        /* Slide 3: Left to right */
        @keyframes patternScrollRight {
          0% { transform: translateX(-${scrollDistance}px); }
          100% { transform: translateX(0); }
        }
        /* Slide 4: Right to left */
        @keyframes patternScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${scrollDistance}px); }
        }
        /* Slide 5: Diagonal top-left to bottom-right */
        @keyframes patternScrollDiagonal1 {
          0% { transform: translate(-${scrollDistance}px, -${scrollDistance}px); }
          100% { transform: translate(0, 0); }
        }
        /* Slide 6: Diagonal top-right to bottom-left */
        @keyframes patternScrollDiagonal2 {
          0% { transform: translate(${scrollDistance}px, -${scrollDistance}px); }
          100% { transform: translate(0, 0); }
        }
        /* Slide 7: Circular/spiral */
        @keyframes patternScrollCircular {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(${scrollDistance * 0.5}px, -${scrollDistance * 0.5}px) rotate(90deg); }
          50% { transform: translate(0, -${scrollDistance}px) rotate(180deg); }
          75% { transform: translate(-${scrollDistance * 0.5}px, -${scrollDistance * 0.5}px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        /* Slide 8: Horizontal wave */
        @keyframes patternScrollWaveH {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(${scrollDistance * 0.3}px) translateY(-${scrollDistance * 0.2}px); }
          50% { transform: translateX(0) translateY(-${scrollDistance * 0.4}px); }
          75% { transform: translateX(-${scrollDistance * 0.3}px) translateY(-${scrollDistance * 0.2}px); }
        }
        /* Slide 9: Vertical wave */
        @keyframes patternScrollWaveV {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-${scrollDistance * 0.2}px) translateY(-${scrollDistance * 0.3}px); }
          50% { transform: translateX(-${scrollDistance * 0.4}px) translateY(0); }
          75% { transform: translateX(-${scrollDistance * 0.2}px) translateY(${scrollDistance * 0.3}px); }
        }
        /* Slide 10: Slow pulse/zoom */
        @keyframes patternScrollPulse {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-${scrollDistance * 0.2}px) scale(1.05); }
        }
        
        @keyframes rippleWave {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }
        @keyframes rippleWaveStaggered {
          0%, 100% {
            transform: translateX(${100 / tilesPerRow / 2}%) scale(1);
          }
          50% {
            transform: translateX(${100 / tilesPerRow / 2}%) scale(1.3);
          }
        }
        .pattern-bg-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 25%, #ffffff 50%, #f5f6f7 75%, #ffffff 100%);
          background-size: 200% 200%;
          animation: gradientShift 15s ease-in-out infinite;
        }
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .pattern-grid {
          display: grid;
          grid-template-columns: repeat(${tilesPerRow}, 1fr);
          grid-auto-rows: ${rowHeight}px;
          column-gap: ${columnGap}px;
          row-gap: ${rowGap}px;
          width: 100%;
          height: ${totalHeight}px;
          animation-duration: 6000s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          padding: ${padding}px;
          will-change: transform;
        }
        
        /* Different animations based on slide */
        .pattern-grid.slide-0 { animation-name: patternScrollUp; }
        .pattern-grid.slide-1 { animation-name: patternScrollDown; }
        .pattern-grid.slide-2 { animation-name: patternScrollRight; }
        .pattern-grid.slide-3 { animation-name: patternScrollLeft; }
        .pattern-grid.slide-4 { animation-name: patternScrollDiagonal1; }
        .pattern-grid.slide-5 { animation-name: patternScrollDiagonal2; }
        .pattern-grid.slide-6 { animation-name: patternScrollCircular; animation-duration: 8000s; }
        .pattern-grid.slide-7 { animation-name: patternScrollWaveH; animation-duration: 7000s; }
        .pattern-grid.slide-8 { animation-name: patternScrollWaveV; animation-duration: 7000s; }
        .pattern-grid.slide-9 { animation-name: patternScrollPulse; animation-duration: 5000s; }
        .pattern-grid-item {
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0.9;
          filter: 
            brightness(1.05)
            drop-shadow(0 0 8px rgba(0, 0, 0, 0.15))
            drop-shadow(0 0 12px rgba(0, 0, 0, 0.12))
            drop-shadow(0 0 16px rgba(0, 0, 0, 0.1))
            drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))
            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
          animation-duration: 6s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .pattern-grid-item:nth-child(${tilesPerRow}n + 1) {
          margin-left: 0;
        }
      `}</style>
      <div className="pattern-bg-container">
        <div className={`pattern-grid slide-${currentSlideIndex}`}>
          {Array.from({ length: totalRows }).map((_, rowIndex) => 
            Array.from({ length: tilesPerRow }).map((_, colIndex) => {
              const imageIndex = (rowIndex * tilesPerRow + colIndex) % imageUrls.length;
              const isEvenRow = rowIndex % 2 === 1;
              // Calculate diagonal position for ripple wave effect
              // Diagonal = row + column, creates diagonal wave pattern from top-left to bottom-right
              const diagonalPosition = rowIndex + colIndex;
              // Delay based on diagonal position (0.16s per diagonal step for slower wave)
              // Multiple waves by using modulo to create overlapping continuous waves
              const waveDelay = (diagonalPosition * 0.16) % 6;
              const animationName = isEvenRow ? 'rippleWaveStaggered' : 'rippleWave';
              
              return (
                <img
                  key={`pattern-img-${rowIndex}-${colIndex}`}
                  src={imageUrls[imageIndex]}
                  alt={`Product ${imageIndex + 1}`}
                  className="pattern-grid-item"
                  style={{
                    animationName: animationName,
                    animationDelay: `${waveDelay}s`,
                  }}
                  loading="lazy"
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

interface OmegaBalanceNewPresentationViewerProps {
  presentation: Presentation;
  instanceId?: string;
}

export default function OmegaBalanceNewPresentationViewer({ presentation, instanceId }: OmegaBalanceNewPresentationViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [omega3, setOmega3] = useState('');
  const [omega6, setOmega6] = useState('');

  // Define the slide flow based on answers
  const getNextSlide = (currentSlideId: string, answer?: any): number => {
    const slideMap: Record<string, any> = {
      'slide-1': 1, // Always go to question
      'slide-2': (answer: string) => {
        // "¿Conoces tu balance de omega 6 / 3?"
        if (answer === 'Sí') return 2; // Go to input slide
        if (answer === 'No') return 6;
        return 1;
      },
      'slide-3-input': () => {
        const o3 = parseFloat(omega3);
        const o6 = parseFloat(omega6);
        return isOmega63RatioHealthy(o3, o6) ? 4 : 3;
      },
      'slide-4-unbalanced': 7,
      'slide-5-good-video': 5,
      'slide-6-good-contact': 5,
      'slide-6-apology': 7,
      'slide-7-video1': 8,
      'slide-8-question': 9,
      'slide-9-video2': 10,
      'slide-10-final': 10,
    };

    const current = presentation.slides[currentSlideIndex];
    const next = slideMap[current.id];
    
    if (typeof next === 'function') {
      return next(answer);
    }
    return typeof next === 'number' ? next : currentSlideIndex + 1;
  };

  const handleAnswer = async (answer: string) => {
    const currentSlide = presentation.slides[currentSlideIndex];
    setUserAnswers({ ...userAnswers, [currentSlide.id]: answer });
    
    // Save response to database if instanceId is provided
    if (instanceId && currentSlide.title) {
      try {
        await saveUserResponse(instanceId, currentSlide.id, currentSlide.title, answer);
      } catch (error) {
        console.error('Failed to save user response:', error);
      }
    }
    
    const nextIndex = getNextSlide(currentSlide.id, answer);
    setCurrentSlideIndex(nextIndex);
  };

  const handleOmegaSubmit = async () => {
    const currentSlide = presentation.slides[currentSlideIndex];
    const answer = { omega3, omega6 };
    setUserAnswers({ ...userAnswers, [currentSlide.id]: answer });
    
    // Save response to database if instanceId is provided
    if (instanceId && currentSlide.title) {
      try {
        await saveUserResponse(instanceId, currentSlide.id, currentSlide.title, answer);
      } catch (error) {
        console.error('Failed to save user response:', error);
      }
    }
    
    const nextIndex = getNextSlide(currentSlide.id);
    setCurrentSlideIndex(nextIndex);
  };

  const handleContinue = () => {
    const nextIndex = getNextSlide(presentation.slides[currentSlideIndex].id);
    setCurrentSlideIndex(Math.min(nextIndex, presentation.slides.length - 1));
  };

  const currentSlide = presentation.slides[currentSlideIndex];

  // Mobile tap navigation - omega presentations are forward-only
  const isInput = isInputSlide(currentSlide);
  const { containerRef: mobileTapRef } = useMobileTapNavigation({
    onRightTap: () => {
      // Only allow forward navigation, and only if not on input slide
      if (!isInput) {
        const nextIndex = getNextSlide(currentSlide.id);
        if (nextIndex !== currentSlideIndex) {
          setCurrentSlideIndex(nextIndex);
        }
      }
    },
    enabled: true,
    allowBackward: false, // Omega presentations are forward-only
    isInputSlide: isInput,
  });

  return (
    <div 
      ref={mobileTapRef}
      className="w-full h-[100dvh] min-h-0 max-h-[100dvh] flex flex-col overflow-hidden relative"
    >
      {/* Pattern Background - Always visible */}
      <PatternBackgroundCSS currentSlideIndex={currentSlideIndex} />
      
      {/* Content: scroll si la diapositiva es alta (p. ej. video + título) */}
      <div className="relative z-10 flex-1 min-h-0 w-full flex items-start sm:items-center justify-center overflow-y-auto overflow-x-hidden px-3 sm:px-6 pt-1 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))]">
        <div className="w-full min-w-0 max-w-4xl min-h-0 py-2 mx-auto flex flex-col justify-center">
        {/* Slide 1: Introduction with Play Button */}
        {currentSlide.id === 'slide-1' && (
          <div className="text-center text-gray-900 animate-fadeIn">
            <h1 className="text-6xl font-bold mb-6 drop-shadow-lg text-slate-800">
              {currentSlide.title}
            </h1>
            <h2 className="text-3xl mb-4 text-slate-700">
              {currentSlide.subtitle}
            </h2>
            <p className="text-2xl mb-12 text-slate-600">
              {currentSlide.content}
            </p>
            
            {/* Big Play Button */}
            <button
              onClick={() => handleContinue()}
              className="group relative inline-flex items-center justify-center w-32 h-32 bg-white rounded-full hover:scale-110 transition-all duration-300 shadow-2xl"
            >
              <svg
                className="w-16 h-16 text-purple-900 ml-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-slate-700 text-sm animate-pulse">
              <span className="text-2xl leading-none">↑</span>
              <span>Click here</span>
            </div>
          </div>
        )}

        {/* Slide 2: Yes/No Question - Do you know your balance? */}
        {currentSlide.id === 'slide-2' && (
          <div className="text-center text-gray-900 animate-fadeIn">
            <h1 className="text-5xl font-bold mb-12 drop-shadow-lg text-slate-800">
              {currentSlide.title}
            </h1>
            
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => handleAnswer('Sí')}
                className="px-16 py-8 text-3xl font-bold bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Sí
              </button>
              <button
                onClick={() => handleAnswer('No')}
                className="px-16 py-8 text-3xl font-bold bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Slide 3: Input Omega Values */}
        {currentSlide.id === 'slide-3-input' && (
          <div className="text-center text-gray-900 animate-fadeIn">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg text-slate-800">
              {currentSlide.title}
            </h1>
            <h2 className="text-2xl mb-12 text-slate-700">
              {currentSlide.subtitle}
            </h2>
            
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-2xl font-semibold mb-3 text-slate-800">Omega 6</label>
                <input
                  type="number"
                  value={omega6}
                  onChange={(e) => setOmega6(e.target.value)}
                  className="w-full px-6 py-4 text-2xl text-gray-900 rounded-xl border-4 border-purple-300 focus:border-purple-500 focus:outline-none"
                  placeholder="Ejemplo: 3"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-2xl font-semibold mb-3 text-slate-800">Omega 3</label>
                <input
                  type="number"
                  value={omega3}
                  onChange={(e) => setOmega3(e.target.value)}
                  className="w-full px-6 py-4 text-2xl text-gray-900 rounded-xl border-4 border-purple-300 focus:border-purple-500 focus:outline-none"
                  placeholder="Ejemplo: 1"
                  step="0.1"
                />
              </div>
              
              <button
                onClick={handleOmegaSubmit}
                disabled={!omega3 || !omega6}
                className="w-full px-8 py-4 text-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Slide 4: Unbalanced Message */}
        {currentSlide.id === 'slide-4-unbalanced' && (
          <div className="text-center text-gray-900 animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg text-amber-700">
              {currentSlide.title}
            </h1>
            <p className="text-2xl mb-6 text-slate-700 max-w-2xl mx-auto">
              {currentSlide.content}
            </p>
            {currentSlide.contentFooter && (
              <p className="text-xl mb-10 text-slate-600 italic max-w-2xl mx-auto">
                {currentSlide.contentFooter}
              </p>
            )}
            
            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Continuar →
            </button>
          </div>
        )}

        {currentSlide.id === 'slide-5-good-video' && (
          <div className="text-center text-gray-900 animate-fadeIn w-full max-w-4xl mx-auto px-2">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-emerald-700">
              {currentSlide.title}
            </h1>
            <div className="bg-white/90 rounded-2xl p-6 mb-8 border-4 border-purple-300 shadow-lg">
              <VimondHealthProtocolEmbed embedUrl={currentSlide.embedUrl} />
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xl"
            >
              Continuar →
            </button>
          </div>
        )}

        {currentSlide.id === 'slide-6-good-contact' && (() => {
          const contact = resolvePresentationContactPhone(currentSlide.content);
          const telHref = `tel:+1${contact.tel}`;
          const copyText = `+1${contact.tel}`;
          return (
            <div className="text-center text-gray-900 animate-fadeIn max-w-3xl mx-auto px-2">
              <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-slate-800">
                {currentSlide.title}
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={telHref}
                  onClick={async () => {
                    if (instanceId) {
                      try {
                        await logStoreLinkClick(instanceId, telHref, currentSlide.id);
                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }}
                  className="inline-flex items-center gap-3 px-10 py-4 text-2xl font-bold bg-purple-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  <span aria-hidden>📞</span>
                  {contact.display}
                </a>
                <PresentationPhoneCopyButton
                  textToCopy={copyText}
                  className="inline-flex shrink-0 items-center justify-center px-6 py-4 text-lg font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl border-2 border-slate-400 shadow transition-transform"
                />
              </div>
            </div>
          );
        })()}

        {/* Slide 6: Apology Message */}
        {currentSlide.id === 'slide-6-apology' && (
          <div className="text-center text-gray-900 animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg text-slate-800">
              {currentSlide.title}
            </h1>
            <h2 className="text-3xl mb-4 text-slate-700">
              {currentSlide.subtitle}
            </h2>
            <p className="text-2xl mb-12 text-slate-600">
              {currentSlide.content}
            </p>
            
            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 7: Video 1 - Embedded iframe */}
        {currentSlide.id === 'slide-7-video1' && (
          <div className="omega-slide-tight text-center text-gray-900 animate-fadeIn w-full min-w-0">
            <h1 className="text-4xl font-bold mb-8 drop-shadow-lg text-slate-800 max-w-4xl mx-auto px-1">
              {currentSlide.title}
            </h1>
            
            <div className="omega-tight-box bg-black/50 backdrop-blur-sm rounded-2xl p-12 mb-8 border-2 border-indigo-400/50 w-full max-w-full min-w-0 mx-auto">
              <IframeEmbedWithSpinner
                src="https://www.zinzinoplay.com/embedded/assets/86"
                title="Balance Concept explained - ES"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
              />
            </div>
            
            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-400/50"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 8: Question - Would you like to know your level? */}
        {currentSlide.id === 'slide-8-question' && (
          <div className="text-center text-gray-900 animate-fadeIn">
            <h1 className="text-5xl font-bold mb-12 drop-shadow-lg text-slate-800">
              {currentSlide.title}
            </h1>
            
            <div className="flex gap-6 justify-center">
              <button
                onClick={handleContinue}
                className="px-16 py-8 text-3xl font-bold bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Sí
              </button>
              <button
                onClick={handleContinue}
                className="px-16 py-8 text-3xl font-bold bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Slide 9: Video 2 - From Supabase Storage */}
        {currentSlide.id === 'slide-9-video2' && (
          <div className="omega-slide-tight text-center text-gray-900 animate-fadeIn w-full min-w-0">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg text-slate-800 max-w-4xl mx-auto px-1">
              {currentSlide.title}
            </h1>
            <p className="text-2xl mb-8 text-slate-700 max-w-3xl mx-auto px-1">
              {currentSlide.subtitle}
            </p>
            
            <div className="omega-tight-box bg-black/50 backdrop-blur-sm rounded-2xl p-12 mb-8 border-2 border-indigo-400/50 w-full max-w-full min-w-0 mx-auto">
              <VideoFileWithSpinner src={getAssetUrl('assets/presentation-omega3-6/video2.mp4')}>
                Your browser does not support the video tag.
              </VideoFileWithSpinner>
            </div>
            
            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-400/50"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 10: Final - Get Your Test */}
        {currentSlide.id === 'slide-10-final' && (
          <div className="text-center text-gray-900 animate-fadeIn">
            <h1 className="text-5xl font-bold mb-8 drop-shadow-lg text-slate-800">
              {currentSlide.title}
            </h1>
            
            <a
              href={currentSlide.content}
              target="_blank"
              rel="noopener noreferrer"
              onClick={async () => {
                if (instanceId && currentSlide.content) {
                  try {
                    await logStoreLinkClick(instanceId, currentSlide.content, currentSlide.id);
                  } catch (error) {
                    console.error('Failed to log store link click:', error);
                  }
                }
              }}
              className="inline-block px-16 py-6 text-3xl font-bold bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500/90 hover:to-teal-500/90 backdrop-blur-sm text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-400/50"
            >
              {currentSlide.content || 'Obtener Test'}
            </a>
            
            <p className="mt-8 text-lg text-slate-700 drop-shadow-lg">
              Haz clic para conseguir tu test
            </p>
          </div>
        )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="fixed left-1/2 z-20 -translate-x-1/2 bottom-[max(1rem,env(safe-area-inset-bottom))] bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 border-2 border-slate-300 shadow-lg">
        <p className="text-slate-800 text-sm font-semibold">
          {getOmegaPresentationProgressLabel(
            presentation,
            currentSlideIndex,
            currentSlide.id,
            userAnswers,
          )}
        </p>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

