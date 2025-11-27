'use client';

import { useState, useMemo } from 'react';
import { Presentation } from '@/data/presentations';
import { getAssetUrl } from '@/config/assets';
import { saveUserResponse, logStoreLinkClick } from '@/lib/services/instances';
import { useMobileTapNavigation, isInputSlide } from '@/hooks/useMobileTapNavigation';

// CSS-based Pattern Background Component
function PatternBackgroundCSS() {
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
        @keyframes patternScrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-${scrollDistance}px);
          }
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
          animation-name: patternScrollUp;
          animation-duration: 6000s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          padding: ${padding}px;
          will-change: transform;
        }
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
        <div className="pattern-grid">
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
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  // Define the slide flow based on answers
  const getNextSlide = (currentSlideId: string, answer?: any): number => {
    const slideMap: Record<string, any> = {
      'slide-1': 1, // Always go to question
      'slide-2': (answer: string) => {
        // "¿Conoces tu balance de omega 3 / 6?"
        if (answer === 'Sí') return 2; // Go to input slide
        if (answer === 'No') return 5; // Go to apology slide
        return 1;
      },
      'slide-3-input': () => {
        // Check if balanced (Omega 3 = 1, Omega 6 = 3)
        const o3 = parseFloat(omega3);
        const o6 = parseFloat(omega6);
        if (o3 === 1 && o6 === 3) {
          return 4; // Go to balanced/congratulations slide
        } else {
          return 3; // Go to unbalanced slide
        }
      },
      'slide-4-unbalanced': 6, // Go to video 1
      'slide-5-balanced': 6, // Go to video 1
      'slide-6-apology': 6, // Go to video 1
      'slide-7-video1': 7, // Go to question "¿Le gustaría saber su nivel?"
      'slide-8-question': 8, // Go to video 2 (regardless of answer)
      'slide-9-video2': 9, // Go to final slide
      'slide-10-final': 9, // Stay on final
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

  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
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
      className="w-full h-screen flex items-center justify-center overflow-hidden relative"
    >
      {/* Pattern Background - Always visible */}
      <PatternBackgroundCSS />
      
      {/* Content Container */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-6">
        {/* Slide 1: Introduction with Play Button */}
        {currentSlide.id === 'slide-1' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-6xl font-bold mb-6 drop-shadow-lg">
              {currentSlide.title}
            </h1>
            <h2 className="text-3xl mb-4 text-purple-200">
              {currentSlide.subtitle}
            </h2>
            <p className="text-2xl mb-12 text-purple-100">
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
          </div>
        )}

        {/* Slide 2: Yes/No Question - Do you know your balance? */}
        {currentSlide.id === 'slide-2' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-12 drop-shadow-lg">
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
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
              {currentSlide.title}
            </h1>
            <h2 className="text-2xl mb-12 text-purple-200">
              {currentSlide.subtitle}
            </h2>
            
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-2xl font-semibold mb-3">Omega 3</label>
                <input
                  type="number"
                  value={omega3}
                  onChange={(e) => setOmega3(e.target.value)}
                  className="w-full px-6 py-4 text-2xl text-gray-900 rounded-xl border-4 border-purple-300 focus:border-purple-500 focus:outline-none"
                  placeholder="Ejemplo: 1"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-2xl font-semibold mb-3">Omega 6</label>
                <input
                  type="number"
                  value={omega6}
                  onChange={(e) => setOmega6(e.target.value)}
                  className="w-full px-6 py-4 text-2xl text-gray-900 rounded-xl border-4 border-purple-300 focus:border-purple-500 focus:outline-none"
                  placeholder="Ejemplo: 3"
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
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg text-yellow-300">
              {currentSlide.title}
            </h1>
            <p className="text-2xl mb-12 text-purple-100 max-w-2xl mx-auto">
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

        {/* Slide 5: Perfect Balance + Health Concerns */}
        {currentSlide.id === 'slide-5-balanced' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg text-green-300">
              {currentSlide.title}
            </h1>
            <h2 className="text-2xl mb-6 text-purple-200">
              {currentSlide.subtitle}
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              {currentSlide.content}
            </p>
            
            <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {currentSlide.questions && currentSlide.questions[0].options.map((concern, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleConcern(concern)}
                  className={`px-4 py-3 text-sm font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                    selectedConcerns.includes(concern)
                      ? 'bg-purple-600 text-white scale-105'
                      : 'bg-white text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  {selectedConcerns.includes(concern) && '✓ '}
                  {concern}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 6: Apology Message */}
        {currentSlide.id === 'slide-6-apology' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
              {currentSlide.title}
            </h1>
            <h2 className="text-3xl mb-4 text-purple-200">
              {currentSlide.subtitle}
            </h2>
            <p className="text-2xl mb-12 text-purple-100">
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
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-4xl font-bold mb-8 drop-shadow-lg">
              {currentSlide.title}
            </h1>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-12 mb-8 border-2 border-indigo-400/50">
              <div className="aspect-video rounded-xl overflow-hidden">
                <iframe
                  width="800"
                  height="450"
                  src="https://www.zinzinoplay.com/embedded/assets/86"
                  title="Balance Concept explained - ES"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
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
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-12 drop-shadow-lg">
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
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
              {currentSlide.title}
            </h1>
            <p className="text-2xl mb-8 text-purple-200">
              {currentSlide.subtitle}
            </p>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-12 mb-8 border-2 border-indigo-400/50">
              <div className="aspect-video rounded-xl overflow-hidden">
                <video
                  src={getAssetUrl('assets/presentation-omega3-6/video2.mp4')}
                  controls
                  className="w-full h-full"
                  style={{ objectFit: 'contain' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
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
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-8 drop-shadow-lg">
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
            
            <p className="mt-8 text-lg text-purple-200 drop-shadow-lg">
              Haz clic para conseguir tu test
            </p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 border border-indigo-400/50 z-20">
        <p className="text-white text-sm">
          Paso {currentSlideIndex + 1} de {presentation.slides.length}
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

