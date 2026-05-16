'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Presentation } from '@/data/presentations';
import { saveUserResponse, logStoreLinkClick } from '@/lib/services/instances';
import { isOmega63RatioHealthy } from '@/lib/utils/omega-balance-ratio';
import { getOmegaPresentationProgressLabel } from '@/lib/utils/omega-presentation-progress';
import { useMobileTapNavigation, isInputSlide } from '@/hooks/useMobileTapNavigation';
import ChatGptSimulator from '@/components/ChatGptSimulator';
import VimondHealthProtocolEmbed from '@/components/VimondHealthProtocolEmbed';
import PresentationPhoneCopyButton from '@/components/PresentationPhoneCopyButton';
import VideoLoadingOverlay from '@/components/VideoLoadingOverlay';
import { resolvePresentationContactPhone } from '@/lib/utils/presentation-contact-phone';

const ZINZINO_BALANCE_EMBED_URL =
  'https://www.zinzinoplay.com/embedded/assets/297?language=es';

function ZinzinoBalanceEmbed({ embedUrl }: { embedUrl?: string }) {
  const [loaded, setLoaded] = useState(false);
  const src = embedUrl || ZINZINO_BALANCE_EMBED_URL;

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className="omega-video-shell relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      <VideoLoadingOverlay visible={!loaded} />
      <iframe
        src={src}
        title="Balance Concept explained - short - ES"
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

interface OmegaBalanceSpacePresentationViewerProps {
  presentation: Presentation;
  instanceId?: string;
}

// Animated Planet Component
function Planet({ 
  position, 
  size, 
  color, 
  speed = 1,
  emissive = false 
}: { 
  position: [number, number, number]; 
  size: number; 
  color: string;
  speed?: number;
  emissive?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.rotation.x += 0.005 * speed;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? size * 1.1 : size}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ? color : '#000000'}
        emissiveIntensity={emissive ? 0.5 : 0}
        metalness={0.8}
        roughness={0.2}
      />
      {emissive && (
        <pointLight
          color={color}
          intensity={2}
          distance={10}
        />
      )}
    </mesh>
  );
}

// Nebula/Cloud Effect
function Nebula({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.15}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// Space Scene Component
function SpaceScene({ currentSlide }: { currentSlide: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  // Animate camera movement through space
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }

    // Smooth camera movement based on slide
    const angle = (currentSlide / 10) * Math.PI * 2;
    const radius = 20;
    const targetX = Math.cos(angle) * radius;
    const targetY = Math.sin(angle * 0.5) * 5;
    const targetZ = Math.sin(angle) * radius;

    state.camera.position.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      0.05
    );
    
    state.camera.lookAt(0, 0, 0);
  });

  // Planet positions and colors
  const planets = useMemo(() => [
    { position: [8, 2, 0] as [number, number, number], size: 1.2, color: '#4a90e2', speed: 1, emissive: false },
    { position: [-6, -3, 4] as [number, number, number], size: 0.8, color: '#e24a4a', speed: 1.5, emissive: false },
    { position: [0, 5, -8] as [number, number, number], size: 1.5, color: '#e2b84a', speed: 0.8, emissive: true },
    { position: [-10, 0, -6] as [number, number, number], size: 1.0, color: '#4ae2b8', speed: 1.2, emissive: false },
    { position: [6, -4, 8] as [number, number, number], size: 0.9, color: '#b84ae2', speed: 1.3, emissive: false },
  ], []);

  const nebulas = useMemo(() => [
    { position: [15, 8, -10] as [number, number, number], color: '#6366f1' },
    { position: [-12, -6, 12] as [number, number, number], color: '#8b5cf6' },
    { position: [0, -10, 0] as [number, number, number], color: '#06b6d4' },
  ], []);

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />
      
      {/* Point lights for planets */}
      <pointLight position={[0, 5, -8]} intensity={3} color="#e2b84a" distance={15} />
      
      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0.8}
        fade
        speed={0.5}
      />

      {/* Nebulas */}
      {nebulas.map((nebula, i) => (
        <Nebula key={i} position={nebula.position} color={nebula.color} />
      ))}

      {/* Planets group */}
      <group ref={groupRef}>
        {planets.map((planet, i) => (
          <Planet
            key={i}
            position={planet.position}
            size={planet.size}
            color={planet.color}
            speed={planet.speed}
            emissive={planet.emissive}
          />
        ))}
      </group>

      {/* Fog for depth */}
      <fog attach="fog" args={['#000011', 30, 100]} />
    </>
  );
}

export default function OmegaBalanceSpacePresentationViewer({ presentation, instanceId }: OmegaBalanceSpacePresentationViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [omega3, setOmega3] = useState('');
  const [omega6, setOmega6] = useState('');

  // Define the slide flow based on answers (same as original)
  const getNextSlide = (currentSlideId: string, answer?: any): number => {
    const slideMap: Record<string, any> = {
      'slide-1': 1,
      'slide-2': (answer: string) => {
        if (answer === 'Sí') return 2;
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
    <div ref={mobileTapRef} className="w-full h-[100dvh] min-h-0 max-h-[100dvh] bg-black flex flex-col overflow-hidden relative">
      {/* 3D Space Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
        >
          <SpaceScene currentSlide={currentSlideIndex} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        </Canvas>
      </div>

      {/* Content: scroll si la diapositiva es alta (p. ej. video + título) */}
      <div className="relative z-10 flex-1 min-h-0 w-full flex items-start sm:items-center justify-center overflow-y-auto overflow-x-hidden px-3 sm:px-6 pt-1 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))]">
        <div className="w-full min-w-0 max-w-4xl min-h-0 py-2 mx-auto flex flex-col justify-center">
        {/* Slide 1: Introduction with Play Button */}
        {currentSlide.id === 'slide-1' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-6xl font-bold mb-6 drop-shadow-2xl bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              {currentSlide.title}
            </h1>
            <h2 className="text-3xl mb-4 text-indigo-300 drop-shadow-lg">
              {currentSlide.subtitle}
            </h2>
            <p className="text-2xl mb-12 text-purple-200 drop-shadow-lg">
              {currentSlide.content}
            </p>
            
            <button
              onClick={() => handleContinue()}
              className="group relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-full hover:scale-110 transition-all duration-300 shadow-2xl border-2 border-indigo-400/50"
            >
              <svg
                className="w-16 h-16 text-white ml-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-indigo-100 text-sm animate-pulse">
              <span className="text-2xl leading-none">↑</span>
              <span>Click here</span>
            </div>
          </div>
        )}

        {/* Slide 2: Yes/No Question */}
        {currentSlide.id === 'slide-2' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-12 drop-shadow-2xl">
              {currentSlide.title}
            </h1>
            
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => handleAnswer('Sí')}
                className="px-16 py-8 text-3xl font-bold bg-emerald-600/90 hover:bg-emerald-500/90 backdrop-blur-sm text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-400/50"
              >
                Sí
              </button>
              <button
                onClick={() => handleAnswer('No')}
                className="px-16 py-8 text-3xl font-bold bg-red-600/90 hover:bg-red-500/90 backdrop-blur-sm text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-red-400/50"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Slide 3: Input Omega Values */}
        {currentSlide.id === 'slide-3-input' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-2xl">
              {currentSlide.title}
            </h1>
            <h2 className="text-2xl mb-12 text-indigo-300 drop-shadow-lg">
              {currentSlide.subtitle}
            </h2>

            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-2xl font-semibold mb-3">Omega 6</label>
                <input
                  type="number"
                  value={omega6}
                  onChange={(e) => setOmega6(e.target.value)}
                  className="w-full px-6 py-4 text-2xl text-gray-900 rounded-xl border-4 border-indigo-400/50 focus:border-indigo-500 focus:outline-none bg-white/95 backdrop-blur-sm"
                  placeholder="Ej.: 3"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-2xl font-semibold mb-3">Omega 3</label>
                <input
                  type="number"
                  value={omega3}
                  onChange={(e) => setOmega3(e.target.value)}
                  className="w-full px-6 py-4 text-2xl text-gray-900 rounded-xl border-4 border-indigo-400/50 focus:border-indigo-500 focus:outline-none bg-white/95 backdrop-blur-sm"
                  placeholder="Ej.: 1"
                  min="0.1"
                  step="0.1"
                />
              </div>
              
              <button
                onClick={handleOmegaSubmit}
                disabled={!omega3 || !omega6}
                className="w-full px-8 py-4 text-2xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-indigo-400/50"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Slide 4: Unbalanced Message */}
        {currentSlide.id === 'slide-4-unbalanced' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-2xl text-yellow-300">
              {currentSlide.title}
            </h1>
            <p className="text-2xl mb-6 text-purple-200 max-w-2xl mx-auto drop-shadow-lg">
              {currentSlide.content}
            </p>
            {currentSlide.contentFooter && (
              <p className="text-xl mb-10 text-indigo-200/90 italic drop-shadow-lg max-w-2xl mx-auto">
                {currentSlide.contentFooter}
              </p>
            )}
            
            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-400/50"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 5: Good balance — protocol video */}
        {currentSlide.id === 'slide-5-good-video' && (
          <div className="text-center text-white animate-fadeIn w-full max-w-[min(960px,96vw)] mx-auto px-2 sm:px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-2xl text-emerald-300">
              {currentSlide.title}
            </h1>
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-8 border-2 border-indigo-400/50 w-full">
              <VimondHealthProtocolEmbed embedUrl={currentSlide.embedUrl} className="omega-video-shell" />
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-400/50"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 6: Good balance — contact sender */}
        {currentSlide.id === 'slide-6-good-contact' && (() => {
          const contact = resolvePresentationContactPhone(currentSlide.content);
          const telHref = `tel:+1${contact.tel}`;
          const copyText = `+1${contact.tel}`;
          return (
            <div className="text-center text-white animate-fadeIn w-full max-w-[min(900px,96vw)] mx-auto px-2 sm:px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 leading-tight text-white drop-shadow-2xl">
                {currentSlide.title}
              </h1>
              <div className="flex flex-col items-center gap-5">
                <div className="relative flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <span
                    className="sm:hidden text-3xl font-bold text-emerald-400 -mb-1"
                    aria-hidden
                  >
                    ↓
                  </span>
                  <span
                    className="hidden sm:block absolute -left-12 top-1/2 -translate-y-1/2 text-4xl font-bold text-emerald-400 pointer-events-none"
                    aria-hidden
                  >
                    →
                  </span>
                  <a
                    href={telHref}
                    onClick={async () => {
                      if (instanceId) {
                        try {
                          await logStoreLinkClick(instanceId, telHref, currentSlide.id);
                        } catch (error) {
                          console.error('Failed to log contact click:', error);
                        }
                      }
                    }}
                    className="inline-flex items-center gap-3 px-10 py-4 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500/90 hover:to-teal-500/90 backdrop-blur-sm text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-400/50 ring-2 ring-emerald-400/20"
                  >
                    <span className="text-2xl" aria-hidden>
                      📞
                    </span>
                    {contact.display}
                  </a>
                  <PresentationPhoneCopyButton
                    textToCopy={copyText}
                    className="inline-flex shrink-0 items-center justify-center px-6 py-4 text-lg sm:text-xl font-bold bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white rounded-2xl shadow-xl transition-all duration-300 border-2 border-white/35"
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Slide 6: Apology Message */}
        {currentSlide.id === 'slide-6-apology' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-2xl">
              {currentSlide.title}
            </h1>
            <h2 className="text-3xl mb-4 text-indigo-300 drop-shadow-lg">
              {currentSlide.subtitle}
            </h2>
            <p className="text-2xl mb-6 text-purple-200 drop-shadow-lg">
              {currentSlide.content}
            </p>
            {currentSlide.contentFooter && (
              <p className="text-xl mb-12 text-indigo-200/90 italic drop-shadow-lg max-w-2xl mx-auto">
                {currentSlide.contentFooter}
              </p>
            )}
            {!currentSlide.contentFooter && <div className="mb-12" />}

            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-400/50"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 7: Chat demo (replaces first embedded video) */}
        {currentSlide.id === 'slide-7-video1' && (
          <div className="text-center text-white animate-fadeIn w-full max-w-[min(1200px,96vw)] mx-auto px-2 sm:px-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 border-2 border-indigo-400/50 w-full">
              <ChatGptSimulator
                key={`${currentSlide.id}-omega-index`}
                headingText="¿En qué puedo ayudarte?"
                inputPlaceholder="Pregunta lo que quieras"
                promptText="¿Qué índice en tu sangre es más importante para prevenir enfermedades cardiovasculares cuando hay baja DHA?"
                answerText={`En la sangre, el **Índice Omega-3** es un marcador muy citado: mide el **porcentaje de omega-3 de cadena larga (EPA y DHA, incluida la DHA)** en las **membranas de los glóbulos rojos**. Valores más altos se han **asociado con menor riesgo de muerte por enfermedad cardiovascular**.

**Por qué importa el DHA y el EPA**

- El organismo **sintetiza poco** EPA y DHA a partir de otros ácidos grasos; conviene aportarlos con la dieta o, si aplica, suplementación.
- La **DHA** tiene un papel relevante en la salud cardiovascular; el **EPA** también se estudia de forma destacada en prevención.

**Dosis orientativas que suelen citarse**

- Objetivo frecuente en guías populares: **~1000 mg/día de EPA + DHA combinados** para apoyo cardiovascular general.
- En **mujeres con enfermedad coronaria previa**, a veces se menciona **>1 g/día de EPA+DHA** (siempre con criterio médico).
- Los omega-3 suelen usarse como **complemento** de tratamientos estándar (por ejemplo, estatinas) en personas de **alto riesgo**.

**EPA frente a mezclas EPA+DHA**

- Hay evidencia de que **EPA “puro”** añadido a la terapia estándar puede reducir la mortalidad cardiovascular en algunos ensayos.
- Las **formulaciones con EPA y DHA juntos** también se han relacionado con **menor mortalidad cardiovascular** en otros estudios.

¿Te gustaría conocer más sobre **cómo subir tus niveles de DHA y EPA** con la dieta?`}
                promptCharDelayMs={38}
                answerCharDelayMs={11}
                promptSubmitDelayMs={500}
                className="text-left shadow-xl w-full !min-h-[min(58vh,640px)] max-h-[min(88vh,900px)]"
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
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-12 drop-shadow-2xl">
              {currentSlide.title}
            </h1>
            
            <div className="flex gap-6 justify-center">
              <button
                onClick={handleContinue}
                className="px-16 py-8 text-3xl font-bold bg-emerald-600/90 hover:bg-emerald-500/90 backdrop-blur-sm text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-400/50"
              >
                Sí
              </button>
              <button
                onClick={handleContinue}
                className="px-16 py-8 text-3xl font-bold bg-red-600/90 hover:bg-red-500/90 backdrop-blur-sm text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-red-400/50"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Slide 9: Video 2 - From Supabase Storage */}
        {currentSlide.id === 'slide-9-video2' && (
          <div className="omega-slide-tight text-center text-white animate-fadeIn w-full min-w-0">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-2xl max-w-4xl mx-auto px-1">
              {currentSlide.title}
            </h1>
            <p className="text-2xl mb-8 text-indigo-300 drop-shadow-lg max-w-3xl mx-auto px-1">
              {currentSlide.subtitle}
            </p>
            
            <div className="omega-tight-box bg-black/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-8 border-2 border-indigo-400/50 w-full max-w-full min-w-0 mx-auto">
              <ZinzinoBalanceEmbed embedUrl={(currentSlide as { embedUrl?: string }).embedUrl} />
            </div>
            
            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-400/50"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 10: Final — contact phone */}
        {currentSlide.id === 'slide-10-final' && (() => {
          const contact = resolvePresentationContactPhone(currentSlide.content);
          const telHref = `tel:+1${contact.tel}`;
          const copyText = `+1${contact.tel}`;
          return (
            <div className="text-center text-white animate-fadeIn w-full max-w-[min(900px,96vw)] mx-auto px-2 sm:px-4">
              <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(52,211,153,0.45)]">
                {currentSlide.title}
              </span>

              <div className="flex flex-col items-center gap-5">
                <span className="block text-lg sm:text-2xl font-medium text-indigo-100/95 italic tracking-wide max-w-3xl">
                  {currentSlide.subtitle}
                </span>

                <div className="relative flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <span
                    className="sm:hidden text-3xl font-bold text-emerald-400 -mb-1"
                    aria-hidden
                  >
                    ↓
                  </span>
                  <span
                    className="hidden sm:block absolute -left-12 top-1/2 -translate-y-1/2 text-4xl font-bold text-emerald-400 pointer-events-none"
                    aria-hidden
                  >
                    →
                  </span>
                  <a
                    href={telHref}
                    onClick={async () => {
                      if (instanceId) {
                        try {
                          await logStoreLinkClick(instanceId, telHref, currentSlide.id);
                        } catch (error) {
                          console.error('Failed to log contact click:', error);
                        }
                      }
                    }}
                    className="inline-flex items-center gap-3 px-10 py-4 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500/90 hover:to-teal-500/90 backdrop-blur-sm text-white rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-400/50 ring-2 ring-emerald-400/20"
                  >
                    <span className="text-2xl" aria-hidden>
                      📞
                    </span>
                    {contact.display}
                  </a>
                  <PresentationPhoneCopyButton
                    textToCopy={copyText}
                    className="inline-flex shrink-0 items-center justify-center px-6 py-4 text-lg sm:text-xl font-bold bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white rounded-2xl shadow-xl transition-all duration-300 border-2 border-white/35"
                  />
                </div>
              </div>
            </div>
          );
        })()}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="fixed left-1/2 z-20 -translate-x-1/2 bottom-[max(1rem,env(safe-area-inset-bottom))] bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 border border-indigo-400/50">
        <p className="text-white text-sm">
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

