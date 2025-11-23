'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Presentation } from '@/data/presentations';
import { getAssetUrl } from '@/config/assets';

interface OmegaBalanceSpacePresentationViewerProps {
  presentation: Presentation;
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

export default function OmegaBalanceSpacePresentationViewer({ presentation }: OmegaBalanceSpacePresentationViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [omega3, setOmega3] = useState('');
  const [omega6, setOmega6] = useState('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  // Define the slide flow based on answers (same as original)
  const getNextSlide = (currentSlideId: string, answer?: any): number => {
    const slideMap: Record<string, any> = {
      'slide-1': 1,
      'slide-2': (answer: string) => {
        if (answer === 'Sí') return 2;
        if (answer === 'No') return 5;
        return 1;
      },
      'slide-3-input': () => {
        const o3 = parseFloat(omega3);
        const o6 = parseFloat(omega6);
        if (o3 === 1 && o6 === 3) {
          return 4;
        } else {
          return 3;
        }
      },
      'slide-4-unbalanced': 6,
      'slide-5-balanced': 6,
      'slide-6-apology': 6,
      'slide-7-video1': 7,
      'slide-8-question': 8,
      'slide-9-video2': 9,
      'slide-10-final': 9,
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

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden relative">
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

      {/* Content Overlay */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-6">
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
                <label className="block text-2xl font-semibold mb-3">Omega 3</label>
                <input
                  type="number"
                  value={omega3}
                  onChange={(e) => setOmega3(e.target.value)}
                  className="w-full px-6 py-4 text-2xl text-gray-900 rounded-xl border-4 border-indigo-400/50 focus:border-indigo-500 focus:outline-none bg-white/95 backdrop-blur-sm"
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
                  className="w-full px-6 py-4 text-2xl text-gray-900 rounded-xl border-4 border-indigo-400/50 focus:border-indigo-500 focus:outline-none bg-white/95 backdrop-blur-sm"
                  placeholder="Ejemplo: 3"
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
            <p className="text-2xl mb-12 text-purple-200 max-w-2xl mx-auto drop-shadow-lg">
              {currentSlide.content}
            </p>
            
            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-400/50"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 5: Perfect Balance + Health Concerns */}
        {currentSlide.id === 'slide-5-balanced' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-2xl text-emerald-300">
              {currentSlide.title}
            </h1>
            <h2 className="text-2xl mb-6 text-indigo-300 drop-shadow-lg">
              {currentSlide.subtitle}
            </h2>
            <p className="text-xl mb-8 text-purple-200 drop-shadow-lg">
              {currentSlide.content}
            </p>
            
            <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {currentSlide.questions && currentSlide.questions[0].options.map((concern, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleConcern(concern)}
                  className={`px-4 py-3 text-sm font-semibold rounded-lg shadow-lg transition-all duration-300 backdrop-blur-sm border-2 ${
                    selectedConcerns.includes(concern)
                      ? 'bg-indigo-600/90 text-white scale-105 border-indigo-400/50'
                      : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                  }`}
                >
                  {selectedConcerns.includes(concern) && '✓ '}
                  {concern}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-400/50"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 6: Apology Message */}
        {currentSlide.id === 'slide-6-apology' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-2xl">
              {currentSlide.title}
            </h1>
            <h2 className="text-3xl mb-4 text-indigo-300 drop-shadow-lg">
              {currentSlide.subtitle}
            </h2>
            <p className="text-2xl mb-12 text-purple-200 drop-shadow-lg">
              {currentSlide.content}
            </p>
            
            <button
              onClick={handleContinue}
              className="px-12 py-4 text-2xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-400/50"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Slide 7: Video 1 - Embedded iframe */}
        {currentSlide.id === 'slide-7-video1' && (
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-4xl font-bold mb-8 drop-shadow-2xl">
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
          <div className="text-center text-white animate-fadeIn">
            <h1 className="text-4xl font-bold mb-4 drop-shadow-2xl">
              {currentSlide.title}
            </h1>
            <p className="text-2xl mb-8 text-indigo-300 drop-shadow-lg">
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
            <h1 className="text-5xl font-bold mb-8 drop-shadow-2xl">
              {currentSlide.title}
            </h1>
            
            <a
              href={currentSlide.content}
              target="_blank"
              rel="noopener noreferrer"
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

