'use client';

import { useState, useEffect, useRef } from 'react';

// Stable TypeWriter component to avoid resets on parent re-renders
const TypeWriter: React.FC<{ text: string; speed?: number; className?: string }> = ({ text, speed = 18, className }) => {
  const [display, setDisplay] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // reset only when text changes
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDisplay('');
    indexRef.current = 0;
    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplay(prev => {
        const next = text.slice(0, indexRef.current);
        return next;
      });
      if (indexRef.current >= text.length && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [text, speed]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: display.replace(/\n/g, '<br/>') }} />;
};
import { Presentation, PresentationSlide } from '@/data/presentations';

interface PresentationViewerProps {
  presentation: Presentation;
}

export default function PresentationViewer({ presentation }: PresentationViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transition, setTransition] = useState<{ active: boolean; type: 'fade' | 'zoom-fade' | 'checkerboard' | 'fade-white' | 'prezoom'; duration: number }>({ active: false, type: 'fade', duration: 900 });
  const [pendingSlide, setPendingSlide] = useState<number | null>(null);
  
  // Timers for auto-play and progress
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const slideStartRef = useRef<number>(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timers
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    // Reset progress at the start of each slide
    setProgress(0);
    slideStartRef.current = Date.now();

    if (isPlaying && presentation.slides[currentSlide]) {
      const slide = presentation.slides[currentSlide];

      // Schedule precise advance at slide end
      advanceTimeoutRef.current = setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % presentation.slides.length);
      }, slide.duration);

      // Update progress smoothly based on elapsed time
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - slideStartRef.current;
        const pct = Math.min(100, (elapsed / slide.duration) * 100);
        setProgress(pct);
      }, 100);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = null;
      }
    };
  }, [isPlaying, currentSlide, presentation.slides]);

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
  };

  const handleSlideChange = (slideIndex: number) => {
    // Clear timers when changing manually
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    // Run a transition and change the slide at half duration
    const next = (slideIndex + presentation.slides.length) % presentation.slides.length;
    const type = pickTransitionForSlide(next);
    // Shorter default durations; showcase slide-10 prezoom much slower
    const duration = type === 'checkerboard' ? 1000 : type === 'zoom-fade' ? 900 : type === 'prezoom' ? 3500 : 800;
    setTransition({ active: true, type, duration });
    setPendingSlide(next);
    setTimeout(() => {
      setCurrentSlide(next);
      setProgress(0);
      slideStartRef.current = Date.now();
    }, Math.floor(duration / 2));
    setTimeout(() => {
      setTransition(prev => ({ ...prev, active: false }));
    }, duration);
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const startPresentation = () => {
    // From first slide CTA: start playing and jump to next slide
    setIsPlaying(true);
    handleSlideChange((currentSlide + 1) % presentation.slides.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        handleSlideChange((currentSlide + 1) % presentation.slides.length);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleSlideChange((currentSlide - 1 + presentation.slides.length) % presentation.slides.length);
        break;
      case 'Escape':
        if (isFullscreen) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
        break;
    }
  };

  const pickTransitionForSlide = (nextIndex: number): 'fade' | 'zoom-fade' | 'checkerboard' | 'fade-white' | 'prezoom' => {
    // Rotate between transitions deterministically based on index
    // If navigating to slide-10 (index 9), use special prezoom transition
    if ((presentation.slides[nextIndex] as any)?.id === 'slide-10') return 'prezoom';
    const mode = nextIndex % 4;
    if (mode === 0) return 'zoom-fade';
    if (mode === 1) return 'fade';
    if (mode === 2) return 'checkerboard';
    return 'fade-white';
  };

  const renderSlide = (slide: PresentationSlide) => {
    const applyHighlights = (slideId: string, text: string): string => {
      // Map phrases to emphasize per slide
      const rules: Record<string, Array<{ find: RegExp; repl: string }>> = {
        'slide-2': [
          { find: /y sanos/gi, repl: '<strong>y sanos</strong>' },
        ],
        'slide-3': [
          { find: /los problemas de salud/gi, repl: '<strong style="color:#b91c1c">los problemas de salud</strong>' },
          { find: /preguntarse por qué/gi, repl: '<strong>preguntarse por qué</strong>' }
        ],
        'slide-4': [
          { find: /sea tu medicina/gi, repl: '<strong>sea tu medicina</strong>' },
          { find: /tu alimento/gi, repl: '<strong>tu alimento</strong>' }
        ],
        'slide-5': [
          { find: /de la naturaleza/gi, repl: '<strong>de la madre naturaleza</strong>' }
        ],
        'slide-6': [
          { find: /preparados por el ser humano/gi, repl: '<strong>preparados por el ser humano</strong>' }
        ],
        'slide-7': [
          { find: /omega-6 y omega-3/gi, repl: '<strong>omega-6 y omega-3</strong>' }
        ],
        'slide-8': [
          { find: /omega-6 y omega-3/gi, repl: '<strong>omega-6 y omega-3</strong>' }
        ],
        'slide-9': [
          { find: /a las células de nuestro organismo/gi, repl: '<strong>a las células de nuestro organismo</strong>' }
        ],
        'slide-10': [
          { find: /o se encuentra en la zona de riesgo/gi, repl: '<strong>o se encuentra en la zona de riesgo</strong>' }
        ],
        'slide-11': [
          { find: /para conocer sus resultados/gi, repl: '<strong>para conocer sus resultados</strong>' }
        ],
        'slide-12': [
          { find: /Servicios Analíticos VITAS/gi, repl: '<strong>Servicios Analíticos VITAS</strong>' }
        ],
        'slide-13': [
          { find: /1\.500\.000|1,500,000/gi, repl: '<strong>1,500,000</strong>' },
          { find: /en desequilibrio/gi, repl: '<strong>en desequilibrio</strong>' }
        ],
        'slide-14': [
          { find: /resultados personales/gi, repl: '<strong>resultados personales</strong>' }
        ],
        'slide-15': [
          { find: /y siga su proceso|y siga su progreso/gi, repl: '<strong>y siga su progreso</strong>' }
        ],
        'slide-16': [
          { find: /en 120 días|en 120 dias/gi, repl: '<strong>en 120 días</strong>' }
        ],
        'slide-19': [
          { find: /y muy saludable/gi, repl: '<strong>y muy saludable</strong>' }
        ],
        'slide-20': [
          { find: /BalanceOil\+/g, repl: '<strong>BalanceOil+</strong>' }
        ],
        'slide-21': [
          { find: /han sido fabricados de la mejor manera y con el máximo cuidado/gi, repl: '<strong>han sido fabricados de la mejor manera y con el máximo cuidado</strong>' }
        ],
        'slide-22': [
          { find: /ventajas saludables/gi, repl: '<strong>ventajas saludables</strong>' }
        ],
        'slide-24': [
          { find: /recuperan el equilibrio en 120 días|recuperan el equilibrio en 120 dias/gi, repl: '<strong>recuperan el equilibrio en 120 días</strong>' }
        ],
        'slide-25': [
          { find: /el primer paso para sentirse bien, estar en forma y sano/gi, repl: '<strong>el primer paso para sentirse bien, estar en forma y sano</strong>' }
        ],
        'slide-29': [
          { find: /premium/gi, repl: '<strong>premium</strong>' }
        ],
        'slide-33': [
          { find: /sueños realidad|suenos realidad/gi, repl: '<strong>sueños realidad</strong>' }
        ],
        'slide-34': [
          { find: /juntos/gi, repl: '<strong>juntos</strong>' }
        ]
      };
      const r = rules[slideId];
      if (!r) return text;
      let out = text;
      r.forEach(({ find, repl }) => { out = out.replace(find, repl); });
      return out;
    };
    // Per-slide overlay text positions for typewriter
    const textPosition: Record<string, 'top-left' | 'top-right' | 'top-center'> = {
      'slide-2': 'top-left',
      'slide-3': 'top-left',
      'slide-4': 'top-left',
      'slide-5': 'top-left',
      'slide-6': 'top-right',
      'slide-7': 'top-center',
      'slide-8': 'top-left',
      'slide-9': 'top-left',
      'slide-10': 'top-left',
      'slide-11': 'top-left',
      'slide-12': 'top-left',
      'slide-13': 'top-center',
      'slide-14': 'top-left',
      'slide-15': 'top-left',
      'slide-16': 'top-left',
      'slide-18': 'top-center',
      'slide-19': 'top-left',
      'slide-20': 'top-left',
      'slide-21': 'top-center',
      'slide-22': 'top-center',
      'slide-24': 'top-left',
      'slide-25': 'top-left',
      'slide-26': 'top-left',
      'slide-27': 'top-left',
      'slide-28': 'top-left',
      'slide-29': 'top-left',
      'slide-30': 'top-left',
      'slide-31': 'top-left',
      'slide-32': 'top-center',
      'slide-33': 'top-left',
      'slide-34': 'top-left'
    };

    // (TypeWriter moved to top-level for stability)
    // Handle blank slide (slide 7)
    if (!slide.title && !slide.subtitle && !slide.content && !slide.backgroundGif) {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-lg opacity-50">Blank Slide</p>
          </div>
        </div>
      );
    }

    switch (slide.type) {
      case 'personalized-hero': {
        const isFirstSlide = slide.id === 'slide-1';
        if (!isFirstSlide) {
          return (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              {slide.backgroundGif && (
                <img 
                  key={`${slide.id}-${currentSlide}`}
                  src={slide.backgroundGif}
                  alt=""
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="text-center text-white relative z-10 px-6">
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <h2 className="text-2xl mb-4 text-white/90">{slide.subtitle}</h2>
                <p className="text-lg opacity-80 mb-6">{slide.content}</p>
                {slide.userName && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                    <p className="text-lg font-semibold">{slide.userName}</p>
                    <p className="text-sm opacity-80">{slide.userEmail}</p>
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Special cinematic intro for first slide
        return (
          <div className="w-full h-full relative overflow-hidden">
            {/* Cinematic animated background (looping gif) */}
            <div className="absolute inset-0" style={{ zIndex: 1, overflow: 'hidden' }}>
              <div className="hero-camera-layer">
                <video
                  key={`intro-video-${currentSlide}`}
                  src={'/assets/presentation1/image1.mp4'}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{ width: '110%', height: '110%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Light overlay disabled to prioritize smooth video playback */}

            {/* Zinzino logo pop-in (top-left) */}
            <img
              src="/assets/presentation1/zinzinoLogo.png"
              alt="Zinzino Logo"
              className="intro-logo"
              style={{ position: 'absolute', top: 22, left: 28, height: 64, zIndex: 4 }}
            />

            {/* Gradient overlay removed as requested */}

            {/* Removed dim overlay to avoid obscuring the GIF */}

            {/* Content that fades in after camera settles */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
              <div className="flex items-center gap-8 md:gap-12 px-6 intro-content">
                {/* Headline stack (no card; light glow) */}
                <div className="intro-stack">
                  {(() => {
                    const txt = slide.title || '';
                    const parts = txt.split(' ');
                    const last = parts.pop() || '';
                    const first = parts.join(' ');
                    return (
                      <h1 className="intro-title-modern"><span style={{ fontWeight: 300 }}>{first} </span><span style={{ fontWeight: 600 }}>{last}</span></h1>
                    );
                  })()}
                  <h2 className="intro-subtitle-modern">{slide.subtitle}</h2>
                  <p className="intro-copy-modern">{slide.content}</p>
                </div>
                {/* Giant play button */}
                <button onClick={startPresentation} className="giant-play-button modern spin">
                  <svg width="40" height="40" viewBox="0 0 24 24" className="play-icon">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Local styles for cinematic intro */}
            <style>{`
              .hero-camera-layer {
                width: 110%;
                height: 110%;
                position: absolute;
                top: -5%;
                left: -5%;
                animation: cameraZoomOut 1.5s ease-out forwards;
                transform-origin: 55% 45%;
              }

              @keyframes cameraZoomOut {
                0%   { transform: scale(1.06) translate(-0.5%, -0.3%) rotate(0.3deg); }
                60%  { transform: scale(1.02) translate(0.2%, 0.1%) rotate(0.1deg); }
                100% { transform: scale(1.0) translate(0%, 0%) rotate(0deg); }
              }

              .intro-content { 
                opacity: 0; 
                transform: translateY(16px); 
                animation: revealIntro 800ms ease-out 2.2s forwards; 
              }
              @keyframes revealIntro {
                from { opacity: 0; transform: translateY(16px); }
                to   { opacity: 1; transform: translateY(0); }
              }

              /* Logo pop with subtle float */
              .intro-logo {
                opacity: 0;
                transform: translateY(-6px) scale(0.92);
                filter: drop-shadow(0 8px 16px rgba(0,0,0,0.35));
                animation: logoPop 800ms cubic-bezier(.2,.9,.2,1.05) 2s forwards, logoFloat 6s ease-in-out 2.8s infinite alternate;
              }
              @keyframes logoPop {
                0% { opacity: 0; transform: translateY(-6px) scale(0.92); }
                60% { opacity: 1; transform: translateY(0) scale(1.06); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
              }
              @keyframes logoFloat {
                0% { transform: translateY(0) scale(1); }
                100% { transform: translateY(-4px) scale(1.01); }
              }

              /* Modern headline without card, with light glow */
              .intro-stack { max-width: min(48rem, 88vw); }
              .intro-title-modern {
                margin: 0 0 10px 0;
                font-weight: 900;
                font-size: clamp(2.5rem, 7.2vw, 4.5rem);
                letter-spacing: -0.03em;
                color: #0b1220;
                text-shadow: 0 0 18px rgba(255,255,255,0.5), 0 0 36px rgba(255,255,255,0.25);
                animation: titleLift 800ms cubic-bezier(.2,.8,.2,1) 2.1s both;
              }
              .intro-subtitle-modern {
                margin: 0 0 12px 0;
                font-size: clamp(1.25rem, 2.8vw, 1.6rem);
                color: #111827;
                text-shadow: 0 0 12px rgba(255,255,255,0.7), 0 0 28px rgba(255,255,255,0.35);
                animation: fadeSlide 800ms ease 2.35s both;
              }
              .intro-copy-modern {
                margin: 0;
                font-size: clamp(1.05rem, 2.2vw, 1.25rem);
                color: #334155;
                text-shadow: 0 0 10px rgba(255,255,255,0.35);
                animation: fadeSlide 800ms ease 2.45s both;
              }
              @keyframes titleLift { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

              /* Modern animated play button with pulse rings */
              .giant-play-button.modern {
                position: relative;
                width: 120px; height: 120px; border: none; cursor: pointer;
                border-radius: 50%;
                background: conic-gradient(from 140deg, #7c3aed, #3b82f6 40%, #22d3ee 80%, #7c3aed);
                box-shadow: 0 24px 48px rgba(0,0,0,0.35);
                display: flex; align-items: center; justify-content: center;
                transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;
                overflow: visible;
              }
              .giant-play-button.modern.spin { animation: conicSpin 9s linear infinite; }
              @keyframes conicSpin { from { filter: saturate(1); } 50% { filter: saturate(1.1); } to { filter: saturate(1); } }
              .giant-play-button.modern::before, .giant-play-button.modern::after {
                content: '';
                position: absolute; inset: -10px;
                border-radius: 50%;
                background: radial-gradient(circle at center, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%);
                filter: blur(10px);
                opacity: 0; pointer-events: none;
              }
              .giant-play-button.modern::after {
                inset: -18px;
                background: radial-gradient(circle at center, rgba(124,58,237,0.25), rgba(59,130,246,0) 70%);
                animation: pulseRing 2.6s ease-out 3.2s infinite;
              }
              .giant-play-button.modern:hover { transform: scale(1.06); box-shadow: 0 28px 64px rgba(0,0,0,0.45); filter: saturate(1.05); }
              .giant-play-button.modern:active { transform: scale(0.98); }
              @keyframes pulseRing {
                0% { opacity: 0.0; transform: scale(0.9); }
                30% { opacity: 0.6; }
                100% { opacity: 0; transform: scale(1.25); }
              }
              .play-icon { fill: white; filter: drop-shadow(0 2px 10px rgba(0,0,0,0.35)); }

              /* Corner gradient removed */

              /* Light sweep overlay (subtle, from left) */
              .light-overlay { position: absolute; inset: 0; z-index: 2; pointer-events: none; overflow: hidden; display: none; }
            `}</style>
          </div>
        );
      }
      
      case 'animated-hero':
        return (
          <div className="w-full h-full relative overflow-hidden">
            {slide.backgroundGif && (
              <img
                key={`${slide.id}-${currentSlide}`}
                src={slide.backgroundGif}
                alt=""
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            )}
            {(slide as any).id && (slide.title || slide.subtitle || slide.content) && (
              <div className={`absolute z-10 px-6 ${
                textPosition[(slide as any).id] === 'top-left' ? 'left-12 top-12 text-left' :
                textPosition[(slide as any).id] === 'top-right' ? 'right-12 top-12 text-right' :
                'top-12 left-1/2 -translate-x-1/2 text-center'
              }`} style={{ width: '90vw', maxWidth: '90vw' }}>
                {slide.title && (
                  <TypeWriter text={applyHighlights((slide as any).id, slide.title)} className={`text-black ${(slide as any).id === 'slide-1' ? 'overlay-title' : 'overlay-sub'}`} />
                )}
                {slide.subtitle && (
                  <TypeWriter text={applyHighlights((slide as any).id, slide.subtitle)} className="text-black/80 mt-3 overlay-body" />
                )}
                {slide.content && (
                  <TypeWriter text={applyHighlights((slide as any).id, slide.content)} className={`text-black/70 mt-4 ${((slide as any).id === 'slide-3') ? 'overlay-sub' : 'overlay-body'}`} />
                )}
              </div>
            )}
          </div>
        );
      
      case 'hero':
        // Special rendering for slide-35: centered final logo
        if ((slide as any).id === 'slide-35') {
          return (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              {slide.backgroundGif && (
                <img src={slide.backgroundGif} alt="bg" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:1 }} />
              )}
              <img src="/assets/presentation1/zinzinoFinalLogo.png" alt="Zinzino" style={{ position:'relative', zIndex:2, maxWidth: '28%', height: 'auto' }} />
            </div>
          );
        }
        // Special rendering for slide-25: background as provided with centered small logo overlay
        if ((slide as any).id === 'slide-25') {
          return (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              {slide.backgroundGif && (
                <img src={slide.backgroundGif} alt="bg" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:1 }} />
              )}
              <img src="/assets/presentation1/zinzinoFinalLogo.png" alt="Zinzino" style={{ position:'relative', zIndex:2, maxWidth:'38%', height:'auto' }} />
            </div>
          );
        }
        // Special rendering for slide-22: image in a white card
        if ((slide as any).id === 'slide-22' && slide.backgroundGif) {
          return (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              <div className="relative z-10 max-w-5xl w-full px-6">
                <div
                  className="mx-auto rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-white"
                  style={{ maxWidth: '1100px' }}
                >
                  <img
                    src={slide.backgroundGif}
                    alt=""
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>
              {(slide as any).title && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-6">
                  <TypeWriter text={(slide as any).title} className="text-white text-3xl font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" />
                </div>
              )}
            </div>
          );
        }
        return (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {/* Background image */}
            {slide.backgroundGif && (
              <img 
                key={`${slide.id}-${currentSlide}`}
                src={slide.backgroundGif} 
                alt="" 
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            )}
            {/* Only dim slide-13 for readability */}
            {(slide as any).id === 'slide-13' && <div className="absolute inset-0 bg-black/35" />}
            {(slide as any).id && (slide.title || slide.subtitle || slide.content) && (
              <div className={`absolute z-10 px-6 ${
                textPosition[(slide as any).id] === 'top-left' ? 'left-14 top-14 text-left' :
                textPosition[(slide as any).id] === 'top-right' ? 'right-14 top-14 text-right' :
                'top-14 left-1/2 -translate-x-1/2 text-center'
              }`} style={{ width: '90vw', maxWidth: '90vw' }}>
                {slide.title && (
                  <TypeWriter text={applyHighlights((slide as any).id, slide.title)} className={`${(slide as any).id === 'slide-13' ? 'text-white' : 'text-black'} ${(slide as any).id === 'slide-1' ? 'overlay-title' : 'overlay-sub'}`} />
                )}
                {slide.subtitle && (
                  <TypeWriter text={applyHighlights((slide as any).id, slide.subtitle)} className={`${(slide as any).id === 'slide-13' ? 'text-white/90' : 'text-black/80'} mt-3 overlay-body`} />
                )}
                {slide.content && (
                  <TypeWriter text={applyHighlights((slide as any).id, slide.content)} className={`${(slide as any).id === 'slide-13' ? 'text-white/80' : 'text-black/70'} mt-4 ${((slide as any).id === 'slide-3') ? 'overlay-sub' : 'overlay-body'}`} />
                )}
              </div>
            )}
          </div>
        );
      
      case 'split':
        return (
          <div className="w-full h-full relative overflow-hidden">
            {slide.backgroundGif && (
              <img 
                key={`${slide.id}-${currentSlide}`}
                src={slide.backgroundGif}
                alt=""
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            )}
            {(slide as any).id === 'slide-13' && <div className="absolute inset-0 bg-black/35" />}
            {(slide as any).id && (slide.title || slide.content) && (
              <div className="absolute left-14 top-14 z-10 px-6" style={{ maxWidth: '72ch' }}>
                {slide.title && <TypeWriter text={applyHighlights((slide as any).id, slide.title)} className={`${(slide as any).id === 'slide-13' ? 'text-white' : 'text-black'} ${(slide as any).id === 'slide-1' ? 'overlay-title' : 'overlay-sub'}`} />}
                {slide.content && <TypeWriter text={applyHighlights((slide as any).id, slide.content)} className={`${(slide as any).id === 'slide-13' ? 'text-white/85' : 'text-black/75'} mt-4 ${((slide as any).id === 'slide-3') ? 'overlay-sub' : 'overlay-body'}`} />}
              </div>
            )}
          </div>
        );
      
      case 'grid':
        return (
          <div className="w-full h-full relative overflow-hidden p-8">
            {slide.backgroundGif && (
              <img
                key={`${slide.id}-${currentSlide}`}
                src={slide.backgroundGif}
                alt=""
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            )}
            {(slide as any).id === 'slide-13' && <div className="absolute inset-0 bg-black/35" />}
            {(slide as any).id && (slide.title || slide.content) && (
              <div className="absolute left-14 top-14 z-10" style={{ width: '90vw', maxWidth: '90vw' }}>
                {slide.title && <TypeWriter text={applyHighlights((slide as any).id, slide.title)} className={`${(slide as any).id === 'slide-13' ? 'text-white' : 'text-black'} ${(slide as any).id === 'slide-1' ? 'overlay-title' : 'overlay-sub'}`} />}
                {slide.content && <TypeWriter text={applyHighlights((slide as any).id, slide.content)} className={`${(slide as any).id === 'slide-13' ? 'text-white/90' : 'text-black/75'} mt-3 ${((slide as any).id === 'slide-3') ? 'overlay-sub' : 'overlay-body'}`} />}
              </div>
            )}
            {/* Hide feature cards for slides 5 and 9 */}
            {slide.features && (slide as any).id !== 'slide-5' && (slide as any).id !== 'slide-9' && (
              <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {slide.features.map((feature, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                      <p className="text-white/80">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'half-right':
        return (
          <div className="w-full h-full relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
              {/* Left side empty (or future text zone) */}
              <div className="relative">
                {(slide as any).title && (
                  <div className="absolute top-6 left-6 z-10">
                    <TypeWriter text={(slide as any).title} className="text-white text-3xl font-semibold drop-shadow" />
                  </div>
                )}
              </div>
              {/* Right side background image */}
              <div className="relative">
                {slide.backgroundGif && (
              <img
                    key={`${slide.id}-${currentSlide}`}
                    src={slide.backgroundGif}
                    alt=""
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="w-full h-full relative overflow-hidden p-8">
            {/* Background image */}
            {slide.backgroundGif && (
              <img 
                src={slide.backgroundGif} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="relative z-10 max-w-4xl mx-auto h-full flex flex-col justify-center text-center">
              <h2 className="text-4xl font-bold mb-6 text-white">{slide.title}</h2>
              <p className="text-xl mb-8 text-white/90">{slide.content}</p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-white/20">
                <h3 className="text-2xl font-bold mb-4 text-white">Contact Information</h3>
                <p className="text-lg text-white/90">Ready to get started?</p>
              </div>
            </div>
          </div>
        );
      
      case 'final':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="text-center px-6">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">{slide.title}</h2>
              <p className="text-lg mb-8 text-gray-600">{slide.content}</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <a
                  href="#more-info"
                  className="px-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-800 hover:shadow-md transition"
                >
                  More Information
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
                >
                  Contact The Sender
                </a>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {/* Background image */}
            {slide.backgroundGif && (
              <img 
                key={`${slide.id}-${currentSlide}`}
                src={slide.backgroundGif} 
                alt="" 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1
                }}
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="text-center text-white relative z-10 px-6">
              <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
              <p className="text-lg">{slide.content}</p>
            </div>
          </div>
        );
    }
  };

  if (!presentation.slides[currentSlide]) {
    return <div>No slides available</div>;
  }

  return (
    <div 
      className={`w-full h-screen bg-black relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 z-10"
           style={{ width: `${progress}%` }}></div>
      
      {/* Slide indicator */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
        {currentSlide + 1} / {presentation.slides.length}
      </div>
      
      {/* Slide content */}
      <div className="w-full h-full">
        {renderSlide(presentation.slides[currentSlide])}
      </div>

      {/* Transition overlays */}
      {transition.active && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50 }}>
          {transition.type === 'fade' && (
            <div className="w-full h-full wipe-overlay" style={{ animationDuration: `${transition.duration}ms` }} />
          )}
          {transition.type === 'fade-white' && (
            <div className="w-full h-full wipe-overlay white" style={{ animationDuration: `${transition.duration}ms` }} />
          )}
          {transition.type === 'zoom-fade' && (
            <div className="w-full h-full zoom-fade-overlay" style={{ animationDuration: `${transition.duration}ms` }} />
          )}
          {transition.type === 'checkerboard' && (
            <div className="w-full h-full grid-overlay">
              {Array.from({ length: 60 }).map((_, i) => {
                const cols = 10; const rows = 6;
                const col = i % cols; const row = Math.floor(i / cols);
                const odd = (row + col) % 2 === 0;
                const delay = row * 90 + col * 70; // stagger nicely per-square
                return (
                  <div
                    key={i}
                    className={`grid-cell ${odd ? 'grid-cell-odd' : 'grid-cell-even'}`}
                    style={{ animationDelay: `${delay}ms` }}
                  />
                );
              })}
            </div>
          )}
          {transition.type === 'prezoom' && (
            <div className="absolute inset-0" style={{ zIndex: 60, overflow: 'hidden' }}>
              <img src="/assets/presentation1/slide10Pre.png" alt="pre" className="prezoom-img" />
            </div>
          )}
        </div>
      )}
      
      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 z-10">
          <button
            onClick={() => handleSlideChange((currentSlide - 1 + presentation.slides.length) % presentation.slides.length)}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handlePlayPause}
            className="text-white hover:text-blue-400 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
              </svg>
            )}
          </button>
          
          <button
            onClick={() => handleSlideChange((currentSlide + 1) % presentation.slides.length)}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            onClick={handleFullscreen}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Slide navigation dots */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {presentation.slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Global transition styles */}
      <style>{`
        /* Slow, subtle Ken Burns effect for static backgrounds */
        .kb-slow { animation: kenburns 18s ease-in-out infinite alternate; transform-origin: 55% 45%; }
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.08); } }

        /* Overlay typography - very large, thin (bold only via <strong>) */
        .overlay-title { font-weight: 300; letter-spacing: -0.03em; line-height: 1.02; font-size: clamp(6rem, 12vw, 12rem) !important; }
        .overlay-sub { font-weight: 300; letter-spacing: -0.02em; font-size: clamp(0.75rem, 2vw, 2rem) !important; }
        .overlay-body { font-weight: 300; font-size: clamp(0.4rem, 0.9vw, 0.9rem) !important; }
        .overlay-title strong, .overlay-sub strong, .overlay-body strong { font-weight: 800; }

        /* Top-to-bottom wipe fade */
        .wipe-overlay {
          position: absolute; left: 0; top: 0; width: 100%; height: 0%;
          background: rgba(0,0,0,0.95);
          animation: wipeDownUp var(--dur, 1600ms) cubic-bezier(.22,.61,.36,1) forwards;
        }
        .wipe-overlay.white { background: rgba(255,255,255,0.98); }
        @keyframes wipeDownUp {
          0% { height: 0%; opacity: 0; }
          45% { height: 100%; opacity: 1; }
          55% { height: 100%; opacity: 1; }
          100% { height: 0%; opacity: 0; }
        }

        .zoom-fade-overlay {
          position: relative;
          overflow: hidden;
        }
        .zoom-fade-overlay::before {
          content: '';
          position: absolute; inset: -5%;
          background: rgba(0,0,0,0.0);
          transform: scale(1);
          animation: zoomFade var(--dur, 1800ms) cubic-bezier(.22,.61,.36,1) forwards;
        }
        @keyframes zoomFade {
          0% { background: rgba(0,0,0,0); transform: scale(1); }
          45% { background: rgba(0,0,0,0.85); transform: scale(1.05); }
          55% { background: rgba(0,0,0,0.85); transform: scale(1.05); }
          100% { background: rgba(0,0,0,0); transform: scale(1); }
        }

        .grid-overlay {
          position: absolute; inset: 0; z-index: 60;
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-template-rows: repeat(6, 1fr);
          gap: 0;
          background: transparent;
          pointer-events: none;
        }
        .grid-cell {
          background: rgba(0,0,0,0);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
          animation-duration: 2200ms;
          animation-timing-function: cubic-bezier(.22,.61,.36,1);
          animation-fill-mode: forwards;
        }
        .grid-cell-odd { animation-name: gridDarkLightOdd; }
        .grid-cell-even { animation-name: gridDarkLightEven; }

        /* Odd cells: darken first, start lightening while evens darken, then all clear */
        @keyframes gridDarkLightOdd {
          0%   { background: rgba(0,0,0,0); }
          30%  { background: rgba(0,0,0,0.95); }
          55%  { background: rgba(0,0,0,0.75); }
          80%  { background: rgba(0,0,0,0.0); }
          100% { background: rgba(0,0,0,0.0); }
        }
        /* Even cells: stay clear while odds darken, then darken as odds lighten, then clear */
        @keyframes gridDarkLightEven {
          0%   { background: rgba(0,0,0,0); }
          30%  { background: rgba(0,0,0,0.0); }
          55%  { background: rgba(0,0,0,0.95); }
          80%  { background: rgba(0,0,0,0.0); }
          100% { background: rgba(0,0,0,0.0); }
        }

        /* Pre-zoom overlay animation for slide 10 */
        .prezoom-img { position: absolute; inset: -10%; width: 120%; height: 120%; object-fit: cover; transform: scale(2); opacity: 1; animation: preZoom var(--dur, 3500ms) ease-in-out forwards; }
        @keyframes preZoom { 0% { transform: scale(2); opacity: 1; } 60% { transform: scale(1.2); opacity: .5; } 100% { transform: scale(1); opacity: 0; } }
      `}</style>
    </div>
  );
}