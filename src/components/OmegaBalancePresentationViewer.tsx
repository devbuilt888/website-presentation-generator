'use client';

import { useState, useEffect } from 'react';
import { Presentation } from '@/data/presentations';
import { getAssetUrl } from '@/config/assets';

interface OmegaBalancePresentationViewerProps {
  presentation: Presentation;
}

export default function OmegaBalancePresentationViewer({ presentation }: OmegaBalancePresentationViewerProps) {
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

  const handleAnswer = (answer: string) => {
    const currentSlide = presentation.slides[currentSlideIndex];
    setUserAnswers({ ...userAnswers, [currentSlide.id]: answer });
    
    const nextIndex = getNextSlide(currentSlide.id, answer);
    setCurrentSlideIndex(nextIndex);
  };

  const handleOmegaSubmit = () => {
    const currentSlide = presentation.slides[currentSlideIndex];
    setUserAnswers({ ...userAnswers, [currentSlide.id]: { omega3, omega6 } });
    
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

  // Breathing gradient animation
  const [gradientColors, setGradientColors] = useState({
    color1: { r: 30, g: 58, b: 138 },   // Deep indigo
    color2: { r: 88, g: 28, b: 135 },   // Rich purple
    color3: { r: 67, g: 56, b: 202 },   // Vibrant indigo
  });

  useEffect(() => {
    // Elegant color palette - sophisticated blues, purples, and indigos
    const colorPalettes = [
      // Palette 1: Deep Ocean
      [
        { r: 30, g: 58, b: 138 },   // Deep indigo
        { r: 88, g: 28, b: 135 },   // Rich purple
        { r: 67, g: 56, b: 202 },   // Vibrant indigo
      ],
      // Palette 2: Twilight
      [
        { r: 55, g: 48, b: 163 },   // Royal blue
        { r: 99, g: 102, b: 241 },  // Indigo
        { r: 79, g: 70, b: 229 },   // Purple-indigo
      ],
      // Palette 3: Midnight
      [
        { r: 37, g: 99, b: 235 },   // Blue
        { r: 124, g: 58, b: 237 },  // Purple
        { r: 67, g: 56, b: 202 },   // Indigo
      ],
      // Palette 4: Deep Space
      [
        { r: 30, g: 64, b: 175 },   // Navy blue
        { r: 109, g: 40, b: 217 },  // Deep purple
        { r: 79, g: 70, b: 229 },   // Indigo-purple
      ],
      // Palette 5: Elegant Dawn
      [
        { r: 67, g: 56, b: 202 },   // Indigo
        { r: 88, g: 28, b: 135 },   // Purple
        { r: 55, g: 48, b: 163 },   // Royal blue
      ],
    ];

    let currentPaletteIndex = 0;
    let targetPaletteIndex = 1;
    let progress = 0;
    const duration = 12000; // 12 seconds per transition - very slow and subtle
    const frameRate = 60; // 60fps for smooth animation
    const step = 1000 / frameRate;

    const animate = () => {
      progress += step;
      
      if (progress >= duration) {
        progress = 0;
        currentPaletteIndex = targetPaletteIndex;
        targetPaletteIndex = (targetPaletteIndex + 1) % colorPalettes.length;
      }

      const t = Math.min(progress / duration, 1);
      // Ease-in-out for smooth, elegant transitions
      const easedT = t < 0.5 
        ? 2 * t * t 
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const currentPalette = colorPalettes[currentPaletteIndex];
      const targetPalette = colorPalettes[targetPaletteIndex];

      setGradientColors({
        color1: {
          r: Math.round(currentPalette[0].r + (targetPalette[0].r - currentPalette[0].r) * easedT),
          g: Math.round(currentPalette[0].g + (targetPalette[0].g - currentPalette[0].g) * easedT),
          b: Math.round(currentPalette[0].b + (targetPalette[0].b - currentPalette[0].b) * easedT),
        },
        color2: {
          r: Math.round(currentPalette[1].r + (targetPalette[1].r - currentPalette[1].r) * easedT),
          g: Math.round(currentPalette[1].g + (targetPalette[1].g - currentPalette[1].g) * easedT),
          b: Math.round(currentPalette[1].b + (targetPalette[1].b - currentPalette[1].b) * easedT),
        },
        color3: {
          r: Math.round(currentPalette[2].r + (targetPalette[2].r - currentPalette[2].r) * easedT),
          g: Math.round(currentPalette[2].g + (targetPalette[2].g - currentPalette[2].g) * easedT),
          b: Math.round(currentPalette[2].b + (targetPalette[2].b - currentPalette[2].b) * easedT),
        },
      });
    };

    const intervalId = setInterval(animate, step);
    return () => clearInterval(intervalId);
  }, []);

  const gradientStyle = {
    background: `linear-gradient(to bottom right, 
      rgb(${gradientColors.color1.r}, ${gradientColors.color1.g}, ${gradientColors.color1.b}), 
      rgb(${gradientColors.color2.r}, ${gradientColors.color2.g}, ${gradientColors.color2.b}), 
      rgb(${gradientColors.color3.r}, ${gradientColors.color3.g}, ${gradientColors.color3.b})
    )`,
    transition: 'background 0.1s ease-out',
  };

  return (
    <div 
      className="w-full h-screen flex items-center justify-center overflow-hidden"
      style={gradientStyle}
    >
      <div className="max-w-4xl w-full mx-auto px-6">
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
            
            <div className="bg-gray-900 rounded-2xl p-12 mb-8 border-4 border-purple-500">
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
              className="px-12 py-4 text-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
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
            
            <div className="bg-gray-900 rounded-2xl p-12 mb-8 border-4 border-purple-500">
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
              className="px-12 py-4 text-2xl font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
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
              className="inline-block px-16 py-6 text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {currentSlide.content || 'Obtener Test'}
            </a>
            
            <p className="mt-8 text-lg text-purple-200">
              Haz clic para conseguir tu test
            </p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
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

