'use client';

import { useState, useEffect, useRef } from 'react';
import { Presentation, PresentationSlide } from '@/data/presentations';
import { getAssetUrl } from '@/config/assets';
import { speakText, extractSlideText, stopCurrentAudio } from '@/utils/tts';
import { translateText } from '@/utils/translations';

// Stable TypeWriter component to avoid resets on parent re-renders
const TypeWriter: React.FC<{ text: string; speed?: number; className?: string; delayMs?: number }> = ({ text, speed = 18, className, delayMs = 0 }) => {
  const [display, setDisplay] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // reset only when text changes
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (delayRef.current) {
      clearTimeout(delayRef.current);
      delayRef.current = null;
    }
    setDisplay('');
    indexRef.current = 0;
    const start = () => {
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
    };
    if (delayMs > 0) {
      delayRef.current = setTimeout(start, delayMs);
    } else {
      start();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (delayRef.current) clearTimeout(delayRef.current);
      timerRef.current = null;
    };
  }, [text, speed, delayMs]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: display.replace(/\n/g, '<br/>') }} />;
};

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
  const [isTranslated, setIsTranslated] = useState(false); // Translation state
  
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

  // TTS: Speak the slide text when slide changes
  useEffect(() => {
    // Stop any currently playing audio
    stopCurrentAudio();

    // Wait a bit for the transition to settle, then speak
    const slide = presentation.slides[currentSlide];
    if (slide) {
      const slideText = extractSlideText(slide);
      if (slideText) {
        // Small delay to let the slide transition complete before starting audio
        const ttsTimeout = setTimeout(() => {
          speakText(slideText);
        }, 500);

        return () => {
          clearTimeout(ttsTimeout);
          stopCurrentAudio();
        };
      }
    }
  }, [currentSlide, presentation.slides]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      // Pause: stop audio
      stopCurrentAudio();
    }
  };

  const handleSlideChange = (slideIndex: number) => {
    // Stop any currently playing audio when manually changing slides
    stopCurrentAudio();
    
    // Clear timers when changing manually
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    // Run a transition; for 'prezoom' we switch immediately so the pre-image overlays the next slide
    const next = (slideIndex + presentation.slides.length) % presentation.slides.length;
    const type = pickTransitionForSlide(next);
    // Shorter default durations; showcase slide-10 prezoom much slower
    const duration = type === 'checkerboard' ? 1000 : type === 'zoom-fade' ? 900 : type === 'prezoom' ? 3500 : 800;
    setTransition({ active: true, type, duration });
    setPendingSlide(next);
    if (type === 'prezoom') {
      // Immediately switch underlying content to next slide
      setCurrentSlide(next);
      setProgress(0);
      slideStartRef.current = Date.now();
    } else {
      setTimeout(() => {
        setCurrentSlide(next);
        setProgress(0);
        slideStartRef.current = Date.now();
      }, Math.floor(duration / 2));
    }
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
                  src={getAssetUrl(slide.backgroundGif)}
                  alt=""
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="text-center text-white relative z-10 px-6">
                <h1 className="text-5xl font-bold mb-4">{translateText(slide.title || '', isTranslated && presentation.id === 'zinzino-mex')}</h1>
                <h2 className="text-2xl mb-4 text-white/90">{translateText(slide.subtitle || '', isTranslated && presentation.id === 'zinzino-mex')}</h2>
                <p className="text-lg opacity-80 mb-6">{translateText(slide.content || '', isTranslated && presentation.id === 'zinzino-mex')}</p>
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
                  src={getAssetUrl('/assets/presentation1/image1.mp4')}
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
              src={getAssetUrl('/assets/presentation1/zinzinoLogo.png')}
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
                    const txt = translateText(slide.title || '', isTranslated && presentation.id === 'zinzino-mex');
                    const parts = txt.split(' ');
                    const last = parts.pop() || '';
                    const first = parts.join(' ');
                    return (
                      <h1 className="intro-title-modern"><span style={{ fontWeight: 300 }}>{first} </span><span style={{ fontWeight: 600 }}>{last}</span></h1>
                    );
                  })()}
                  <h2 className="intro-subtitle-modern">{translateText(slide.subtitle || '', isTranslated && presentation.id === 'zinzino-mex')}</h2>
                  {/* Action buttons replacing content text */}
                  <div className="flex flex-col gap-4 mt-6">
                    <button className="action-button contact-btn">
                      <div className="flex items-center gap-3">
                        <div className="avatar-placeholder"></div>
                        <span>Contacta a quien te mandó esto</span>
                      </div>
                    </button>
                    <button className="action-button product-btn">
                      <span>Comprar producto</span>
                    </button>
                  </div>
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
                position: relative;
              }
              .intro-title-modern::after {
                content: ''; position: absolute; top: -10%; bottom: -10%; left: -30%; width: 20%;
                background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,250,210,0.7) 50%, rgba(255,255,255,0) 100%);
                mix-blend-mode: screen; filter: blur(14px); opacity: 0;
                animation: titleShine 12s ease-in-out 6s infinite;
              }
              @keyframes titleShine { 0% { transform: translateX(0); opacity: 0; } 10% { opacity: .7; } 35% { transform: translateX(240%); opacity: .25; } 45% { opacity: 0; } 100% { transform: translateX(0); opacity: 0; } }
              .intro-subtitle-modern {
                margin: 0 0 12px 0;
                font-size: clamp(1.25rem, 2.8vw, 1.6rem);
                color: #111827;
                text-shadow: 0 0 12px rgba(255,255,255,0.7), 0 0 28px rgba(255,255,255,0.35);
                animation: fadeSlide 800ms ease 2.35s both;
              }
              @keyframes titleLift { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

              /* Action buttons */
              .action-button {
                padding: 14px 24px;
                border: none;
                border-radius: 12px;
                font-size: clamp(1rem, 2vw, 1.125rem);
                font-weight: 600;
                cursor: pointer;
                transition: all .25s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: fadeSlide 800ms ease 2.45s both;
              }
              .contact-btn {
                background: rgba(255,255,255,0.95);
                color: #1e293b;
                backdrop-filter: blur(10px);
              }
              .contact-btn:hover { background: rgba(255,255,255,1); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }
              .product-btn {
                background: linear-gradient(135deg, #7c3aed, #3b82f6);
                color: white;
              }
              .product-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(124,58,237,0.4); filter: brightness(1.05); }
              .avatar-placeholder {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
                border: 2px solid rgba(255,255,255,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
              }
              .avatar-placeholder::before {
                content: '👤';
                font-size: 20px;
              }

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
                src={getAssetUrl(slide.backgroundGif)}
                alt=""
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            )}
            {(slide as any).id && (slide.title || slide.subtitle || slide.content) && (
              <div className={`absolute z-10 text-left ${
                textPosition[(slide as any).id] === 'top-left' ? '' :
                textPosition[(slide as any).id] === 'top-right' ? 'text-right' :
                'text-center'
              }`} style={{
                left: textPosition[(slide as any).id] === 'top-left' ? '8%' : textPosition[(slide as any).id] === 'top-right' ? 'auto' : '50%',
                right: textPosition[(slide as any).id] === 'top-right' ? '8%' : 'auto',
                top: '10%',
                transform: textPosition[(slide as any).id] === 'top-center' || !textPosition[(slide as any).id] ? 'translateX(-50%)' : 'none',
                width: '84%',
                maxWidth: '84%',
                padding: '0 2%'
              }}>
                {slide.title && (
                  <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.title), isTranslated && presentation.id === 'zinzino-mex')} className={`text-black ${(slide as any).id === 'slide-1' ? 'overlay-title' : 'overlay-sub'}`} />
                )}
                {slide.subtitle && (
                  <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.subtitle), isTranslated && presentation.id === 'zinzino-mex')} className="text-black/80 mt-3 overlay-body" />
                )}
                {slide.content && (
                  <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.content), isTranslated && presentation.id === 'zinzino-mex')} className={`text-black/70 mt-4 ${((slide as any).id === 'slide-3') ? 'overlay-sub' : 'overlay-body'}`} />
                )}
              </div>
            )}
          </div>
        );
      
      case 'hero':
        // Special rendering for slide-3: centered-left, half width
        if ((slide as any).id === 'slide-3' && slide.backgroundGif) {
          return (
            <div className="w-full h-full relative overflow-hidden">
              {slide.backgroundGif && (
                <img 
                  key={`${slide.id}-${currentSlide}`}
                  src={getAssetUrl(slide.backgroundGif)} 
                  alt="" 
                  className="kb-slow"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                />
              )}
              {(slide.title || slide.subtitle || slide.content) && (
                <div className="absolute z-10 text-left flex flex-col justify-center" style={{
                  left: '0%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '50%',
                  maxWidth: '50%',
                  padding: '0 4%'
                }}>
                  {slide.title && (
                    <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.title), isTranslated)} className="text-black overlay-sub" />
                  )}
                  {slide.subtitle && (
                    <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.subtitle), isTranslated)} className="text-black/80 mt-3 overlay-body" />
                  )}
                  {slide.content && (
                    <TypeWriter 
                      delayMs={slide.title ? (slide.title.length * 18) + 400 : 0} 
                      text={translateText(applyHighlights((slide as any).id, slide.content), isTranslated)} 
                      className="text-black/70 mt-4 overlay-sub" 
                    />
                  )}
                </div>
              )}
            </div>
          );
        }
        // Special rendering for slide-35: centered final logo
        if ((slide as any).id === 'slide-35') {
          return (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              {slide.backgroundGif && (
                <img src={getAssetUrl(slide.backgroundGif)} alt="bg" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:1 }} />
              )}
              <img src={getAssetUrl('/assets/presentation1/zinzinoFinalLogo.png')} alt="Zinzino" style={{ position:'relative', zIndex:2, maxWidth: '28%', height: 'auto' }} />
            </div>
          );
        }
        // Special rendering for slide-7: image slides in, 2/3 height, labels on bottom third
        if ((slide as any).id === 'slide-7' && slide.backgroundGif) {
          return (
            <div className="w-full h-full relative overflow-hidden flex flex-col" style={{ background: '#ffffff' }}>
              <div className="flex-1" style={{ height: '66.666%' }}>
                <img
                  src={getAssetUrl(slide.backgroundGif)}
                  alt="slide 7"
                  className="slide7-img top-in"
                  style={{ position:'absolute', left:0, right:0, top:'-10%', bottom:'auto', margin:'0 auto', width:'100%', height:'auto', objectFit:'contain', zIndex:1 }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 z-10 flex items-center justify-between px-10">
                {[
                  { label: '1:1', color: '#10b981', sub: 'Formación del ADN' },
                  { label: '3:1', color: '#10b981', sub: 'La ciencia recomienda' },
                  { label: '4:1', color: '#facc15', sub: 'El punto de inflexión' },
                  { label: '25:1', color: '#ef4444', sub: 'Aumento por década (EE.UU.)' },
                  { label: '?40:1?', color: '#ef4444', sub: '' },
                ].map((item,i)=> (
                  <div key={i} className={`text-center slide7-text-unit slide7-unit-${i}`} style={{ opacity: 0.95 }}>
                    <div className="font-semibold overlay-sub" style={{ color: item.color }}>{item.label}</div>
                    {item.sub && <div className="mt-1 text-black/80 overlay-body" style={{ fontSize: 'clamp(.7rem, .9vw, .9rem)' }}>{item.sub}</div>}
                  </div>
                ))}
              </div>

              <style>{`
                .slide7-img{ opacity: 0; }
                .top-in{ animation: slideFromTop 2500ms cubic-bezier(.22,.61,.36,1) 1500ms forwards; }
                @keyframes slideFromTop{ 0%{ transform: translateY(-24px); opacity:0; } 100%{ transform: translateY(0); opacity:1; } }
                .slide7-text-unit{ transform: translateX(120px); opacity: 0; }
                .slide7-unit-0{ animation: slideFromRight 600ms ease-out 4300ms forwards; }
                .slide7-unit-1{ animation: slideFromRight 600ms ease-out 4600ms forwards; }
                .slide7-unit-2{ animation: slideFromRight 600ms ease-out 4900ms forwards; }
                .slide7-unit-3{ animation: slideFromRight 600ms ease-out 5200ms forwards; }
                .slide7-unit-4{ animation: slideFromRight 600ms ease-out 5500ms forwards; }
                @keyframes slideFromRight{ 0%{ transform: translateX(120px); opacity:0; } 100%{ transform: translateX(0); opacity:1; } }
              `}</style>
            </div>
          );
        }
        // Slide-25 uses normal hero rendering with text top-left; no logo overlay
        // Special rendering for slide-12: text centered on left half
        if ((slide as any).id === 'slide-12' && slide.backgroundGif) {
          return (
            <div className="w-full h-full relative overflow-hidden">
              {slide.backgroundGif && (
                <img 
                  key={`${slide.id}-${currentSlide}`}
                  src={getAssetUrl(slide.backgroundGif)}
                  alt=""
                  className="kb-slow"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                />
              )}
              {(slide.title || slide.subtitle || slide.content) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 px-6" style={{ width: '50vw', maxWidth: '50vw' }}>
                  {slide.title && (
                    <TypeWriter text={applyHighlights((slide as any).id, slide.title)} className="text-black overlay-sub text-center" />
                  )}
                  {slide.subtitle && (
                    <TypeWriter text={applyHighlights((slide as any).id, slide.subtitle)} className="text-black/80 mt-3 overlay-body text-center" />
                  )}
                  {slide.content && (
                    <TypeWriter text={applyHighlights((slide as any).id, slide.content)} className="text-black/70 mt-4 overlay-body text-center" />
                  )}
                </div>
              )}
            </div>
          );
        }
        // Special rendering for slide-20: stronger retro gradient overlay on full background
        if ((slide as any).id === 'slide-20' && slide.backgroundGif) {
          return (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              <img 
                key={`${slide.id}-${currentSlide}`}
                src={getAssetUrl(slide.backgroundGif)}
                alt=""
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
              <div className="absolute inset-0 retro-strong" aria-hidden="true" />
              {(slide as any).id && (slide.title || slide.subtitle || slide.content) && (
                <div className="absolute z-10 text-center" style={{ left: '50%', top: '10%', transform: 'translateX(-50%)', width: '84%', maxWidth: '84%', padding: '0 2%' }}>
                  {slide.title && (
                    <TypeWriter text={applyHighlights((slide as any).id, slide.title)} className="text-black overlay-sub" />
                  )}
                </div>
              )}
              <style>{`
                .retro-strong{ mix-blend-mode: hard-light; opacity:.85; background: conic-gradient(from 0deg at 50% 50%, #ff006e, #ffbe0b, #0affef, #80ff00, #ff006e 360deg); filter: saturate(1.35) contrast(1.12) hue-rotate(6deg); animation: retroSpin 6s linear infinite; }
                @keyframes retroSpin{ 0%{ transform: rotate(0deg) scale(1.02);} 50%{ transform: rotate(180deg) scale(1.06);} 100%{ transform: rotate(360deg) scale(1.02);} }
              `}</style>
            </div>
          );
        }
        // Special rendering for slide-22: image in a white card
        if ((slide as any).id === 'slide-22' && slide.backgroundGif) {
          return (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              <div className="relative z-10 max-w-5xl w-full px-6">
                <div
                  className="mx-auto rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-white retro-container stamp-card"
                  style={{ maxWidth: '1100px' }}
                >
                  <img
                    src={getAssetUrl(slide.backgroundGif)}
                    alt=""
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  {/* Retro gradient animation overlay */}
                  <div className="retro-gradient" aria-hidden="true" />
                </div>
              </div>
              {(slide as any).title && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-6">
                  <TypeWriter text={(slide as any).title} className="text-white text-3xl font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" />
                </div>
              )}
              {/* Local styles for retro overlay */}
              <style>{`
                .retro-container{ position: relative; }
                .retro-gradient{ position:absolute; inset:0; pointer-events:none; mix-blend-mode:overlay; opacity:.55; background: conic-gradient(from 180deg at 50% 50%, #ff0080, #ffd300, #00e0ff, #7cff00, #ff0080 360deg); filter: saturate(1.15) contrast(1.05); animation: retroShift 8s linear infinite; }
                @keyframes retroShift{ 0%{ transform: rotate(0deg); } 50%{ transform: rotate(180deg) scale(1.02); } 100%{ transform: rotate(360deg); } }
                /* Stamp + zoom and background color change */
                .stamp-card{ transform: scale(0.85) translateY(18px); opacity: 0; animation: stampIn 380ms cubic-bezier(.34,1.56,.64,1) 80ms forwards, settleGrow 1200ms ease-in-out 480ms forwards; }
                @keyframes stampIn{ 0%{ transform: scale(0.6) translateY(40px); opacity:0; } 100%{ transform: scale(1.0) translateY(0); opacity:1; } }
                @keyframes settleGrow{ 0%{ box-shadow: 0 0 0 rgba(0,0,0,0); } 60%{ transform: scale(1.06); background:#e8f7ee; } 100%{ transform: scale(1.03); background:#e8f7ee; }
                }
              `}</style>
            </div>
          );
        }
        // Special rendering for slide-32: light salmon bg, left-half centered image (image103.jpeg)
        if ((slide as any).id === 'slide-32') {
          return (
            <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffe6de' }}>
              <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
                <div className="flex items-center justify-center p-8">
                  {slide.backgroundGif && (
                    <img src={getAssetUrl(slide.backgroundGif)} alt="slide 32" style={{ maxWidth:'88%', height:'auto', objectFit:'contain' }} />
                  )}
                </div>
                <div className="flex items-start justify-center p-10">
                  {(slide.title || slide.subtitle || slide.content) && (
                    <div className="w-full">
                      {slide.title && <TypeWriter text={applyHighlights((slide as any).id, slide.title)} className="text-black overlay-sub" />}
                      {slide.subtitle && <TypeWriter text={applyHighlights((slide as any).id, slide.subtitle)} className="text-black/80 mt-3 overlay-body" />}
                      {slide.content && <TypeWriter text={applyHighlights((slide as any).id, slide.content)} className="text-black/70 mt-4 overlay-body" />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {/* Background image */}
            {slide.backgroundGif && (
              <img 
                key={`${slide.id}-${currentSlide}`}
                src={getAssetUrl(slide.backgroundGif)} 
                alt="" 
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            )}
            {/* Only dim slide-13 for readability */}
            {(slide as any).id === 'slide-13' && <div className="absolute inset-0 bg-black/35" />}
            {(slide as any).id && (slide.title || slide.subtitle || slide.content) && (
              <div className={`absolute z-10 text-left ${
                textPosition[(slide as any).id] === 'top-left' ? '' :
                textPosition[(slide as any).id] === 'top-right' ? 'text-right' :
                'text-center'
              }`} style={{
                left: textPosition[(slide as any).id] === 'top-left' ? '8%' : textPosition[(slide as any).id] === 'top-right' ? 'auto' : '50%',
                right: textPosition[(slide as any).id] === 'top-right' ? '8%' : 'auto',
                top: '10%',
                transform: textPosition[(slide as any).id] === 'top-center' || !textPosition[(slide as any).id] ? 'translateX(-50%)' : 'none',
                width: '84%',
                maxWidth: '84%',
                padding: '0 2%'
              }}>
                {slide.title && (
                  <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.title), isTranslated && presentation.id === 'zinzino-mex')} className={`${(slide as any).id === 'slide-13' ? 'text-white' : 'text-black'} ${(slide as any).id === 'slide-1' ? 'overlay-title' : 'overlay-sub'}`} />
                )}
                {slide.subtitle && (
                  <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.subtitle), isTranslated && presentation.id === 'zinzino-mex')} className={`${(slide as any).id === 'slide-13' ? 'text-white/90' : 'text-black/80'} mt-3 overlay-body`} />
                )}
                {slide.content && (
                  <TypeWriter delayMs={(slide as any).id === 'slide-3' && slide.title ? (slide.title.length * 18) + 400 : 0} text={translateText(applyHighlights((slide as any).id, slide.content), isTranslated && presentation.id === 'zinzino-mex')} className={`${(slide as any).id === 'slide-13' ? 'text-white/80' : 'text-black/70'} mt-4 ${((slide as any).id === 'slide-3') ? 'overlay-sub' : 'overlay-body'}`} />
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
                src={getAssetUrl(slide.backgroundGif)}
                alt=""
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            )}
            {(slide as any).id === 'slide-13' && <div className="absolute inset-0 bg-black/35" />}
            {(slide as any).id && (slide.title || slide.content) && (
              <div className="absolute z-10 text-left" style={{ left: '8%', top: '10%', width: '84%', maxWidth: '84%', padding: '0 2%' }}>
                {slide.title && <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.title), isTranslated && presentation.id === 'zinzino-mex')} className={`${(slide as any).id === 'slide-13' ? 'text-white' : 'text-black'} ${(slide as any).id === 'slide-1' ? 'overlay-title' : 'overlay-sub'}`} />}
                {slide.content && <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.content), isTranslated && presentation.id === 'zinzino-mex')} className={`${(slide as any).id === 'slide-13' ? 'text-white/85' : 'text-black/75'} mt-4 ${((slide as any).id === 'slide-3') ? 'overlay-sub' : 'overlay-body'}`} />}
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
                src={getAssetUrl(slide.backgroundGif)}
                alt=""
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            )}
            {(slide as any).id === 'slide-13' && <div className="absolute inset-0 bg-black/35" />}
            {(slide as any).id && (slide.title || slide.content) && (
              <div className="absolute z-10 text-left" style={{ left: '8%', top: '10%', width: '84%', maxWidth: '84%', padding: '0 2%' }}>
                {slide.title && <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.title), isTranslated && presentation.id === 'zinzino-mex')} className={`${(slide as any).id === 'slide-13' ? 'text-white' : 'text-black'} ${(slide as any).id === 'slide-1' ? 'overlay-title' : 'overlay-sub'}`} />}
                {slide.content && <TypeWriter text={translateText(applyHighlights((slide as any).id, slide.content), isTranslated && presentation.id === 'zinzino-mex')} className={`${(slide as any).id === 'slide-13' ? 'text-white/90' : 'text-black/75'} mt-3 ${((slide as any).id === 'slide-3') ? 'overlay-sub' : 'overlay-body'}`} />}
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
                    src={getAssetUrl(slide.backgroundGif)}
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
                src={getAssetUrl(slide.backgroundGif)} 
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
      
      case 'quiz':
        return (
          <div className="w-full h-full relative overflow-hidden">
            {/* Background image */}
            {slide.backgroundGif && (
              <img 
                key={`${slide.id}-${currentSlide}`}
                src={getAssetUrl(slide.backgroundGif)}
                alt=""
                className="kb-slow"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            )}
            {/* Quiz content */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center px-6 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  {slide.title}
                </h2>
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  <button
                    onClick={() => handleSlideChange((currentSlide + 1) % presentation.slides.length)}
                    className="quiz-btn quiz-btn-yes"
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => handleSlideChange((currentSlide + 1) % presentation.slides.length)}
                    className="quiz-btn quiz-btn-no"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
            <style>{`
              .quiz-btn {
                padding: 18px 48px;
                border: none;
                border-radius: 16px;
                font-size: clamp(1.25rem, 3vw, 1.75rem);
                font-weight: 700;
                cursor: pointer;
                transition: all .3s ease;
                box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                min-width: 140px;
              }
              .quiz-btn-yes {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
              }
              .quiz-btn-yes:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 12px 32px rgba(16,185,129,0.5);
                filter: brightness(1.1);
              }
              .quiz-btn-no {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
              }
              .quiz-btn-no:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 12px 32px rgba(239,68,68,0.5);
                filter: brightness(1.1);
              }
              .quiz-btn:active {
                transform: translateY(-1px) scale(1.02);
              }
            `}</style>
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
                src={getAssetUrl(slide.backgroundGif)}
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
      className={`w-full h-screen bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="presentation-shell">
        <div className="presentation-stage">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 z-10"
               style={{ width: `${progress}%` }}></div>
          
          {/* Slide indicator and translation buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {/* Translation buttons (only for Zinzino MX presentation) */}
            {presentation.id === 'zinzino-mex' && (
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-1">
                <button
                  onClick={() => setIsTranslated(false)}
                  className={`transition-all flex items-center justify-center ${!isTranslated ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-75'}`}
                  title="Spanish"
                  style={{ width: '24px', height: '18px' }}
                >
                  <img 
                    src={getAssetUrl('/assets/presentation1/spainFlagPres.png')} 
                    alt="Spain Flag" 
                    className="w-full h-full object-contain"
                    style={{ borderRadius: '2px' }}
                  />
                </button>
                <button
                  onClick={() => setIsTranslated(true)}
                  className={`transition-all flex items-center justify-center ${isTranslated ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-75'}`}
                  title="English"
                  style={{ width: '24px', height: '18px' }}
                >
                  <img 
                    src={getAssetUrl('/assets/presentation1/englandFlagPres.jpg')} 
                    alt="England Flag" 
                    className="w-full h-full object-contain"
                    style={{ borderRadius: '2px' }}
                  />
                </button>
              </div>
            )}
            {/* Slide counter */}
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentSlide + 1} / {presentation.slides.length}
            </div>
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
              <img src={getAssetUrl('/assets/presentation1/slide10Pre.png')} alt="pre" className="prezoom-img" />
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
        </div>
      </div>

      {/* Global transition styles */}
      <style>{`
        .presentation-shell{ width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
        .presentation-stage{ position:relative; width:100vw; max-width:100vw; aspect-ratio:16/9; height:auto; }
        @media (orientation: landscape){ .presentation-stage{ height:100vh; width:auto; max-height:100vh; } }
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
        @keyframes preZoom { 0% { transform: scale(2); opacity: 1; } 60% { transform: scale(1.2); opacity: 0; } 100% { transform: scale(1.2); opacity: 0; } }
      `}</style>
    </div>
  );
}