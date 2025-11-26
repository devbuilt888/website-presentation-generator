'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Presentation, PresentationSlide } from '@/data/presentations';
import { PlusButton, BatchImportButton } from '@/components/presentations/TutorialButtons';

interface ThreeDPresentationViewerProps {
  presentation: Presentation;
}

// Animated Planet Component
function Planet({ position, size, colorIndex }: { position: [number, number, number]; size: number; colorIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  const colors = ['#4a9eff', '#ff6b6b', '#ffd93d', '#6bcf7f', '#9b59b6', '#ff9f43', '#00d2d3', '#ff6348'];
  const color = colors[colorIndex % colors.length];
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={colorIndex % 3 === 0 ? color : '#000'}
        emissiveIntensity={0.4}
        roughness={0.5}
        metalness={0.3}
      />
    </mesh>
  );
}

// 3D Scene Component
function Scene3D({ currentSlide, totalSlides, slideData }: { currentSlide: number; totalSlides: number; slideData: PresentationSlide }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Camera positions for each slide - moving through space
  const cameraPositions = useMemo(() => {
    const positions = [];
    const radius = 25;
    for (let i = 0; i < totalSlides; i++) {
      const angle = (i / totalSlides) * Math.PI * 2;
      const heightVariation = Math.sin(angle * 2) * 6;
      positions.push({
        position: [
          Math.cos(angle) * radius,
          heightVariation + 8,
          Math.sin(angle) * radius
        ] as [number, number, number],
        lookAt: [
          Math.cos(angle + Math.PI / 6) * radius * 0.3,
          heightVariation * 0.3,
          Math.sin(angle + Math.PI / 6) * radius * 0.3
        ] as [number, number, number]
      });
    }
    return positions;
  }, [totalSlides]);

  // Animate camera movement
  useFrame((state) => {
    const target = cameraPositions[currentSlide];
    if (!target) return;

    // Smooth camera transition
    state.camera.position.lerp(
      new THREE.Vector3(...target.position),
      0.05
    );
    
    const lookAtVector = new THREE.Vector3(...target.lookAt);
    state.camera.lookAt(lookAtVector);
  });

  // Animate objects - rotate slowly
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      {/* Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
      
      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      
      {/* Main light */}
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a9eff" />
      
      {/* Group for all 3D objects */}
      <group ref={groupRef}>
        {/* Planets positioned in space */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 15;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.sin(angle * 2) * 5;
          
          return (
            <Planet key={`planet-${i}`} position={[x, y, z]} size={1.5 + i * 0.2} colorIndex={i} />
          );
        })}
        
        {/* Geometric shapes - cubes, torus, etc */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2 + Math.PI / 3;
          const radius = 12;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.cos(angle * 3) * 6;
          
          const shapeType = i % 3;
          
          return (
            <group key={`shape-${i}`} position={[x, y, z]}>
              {shapeType === 0 && (
                <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                  <boxGeometry args={[2, 2, 2]} />
                  <meshStandardMaterial color="#ffd93d" emissive="#ffd93d" emissiveIntensity={0.2} />
                </mesh>
              )}
              {shapeType === 1 && (
                <mesh>
                  <torusGeometry args={[1.5, 0.5, 16, 32]} />
                  <meshStandardMaterial color="#6bcf7f" emissive="#6bcf7f" emissiveIntensity={0.2} />
                </mesh>
              )}
              {shapeType === 2 && (
                <mesh>
                  <octahedronGeometry args={[1.5, 0]} />
                  <meshStandardMaterial color="#9b59b6" emissive="#9b59b6" emissiveIntensity={0.2} />
                </mesh>
              )}
            </group>
          );
        })}
        
        {/* Central object that changes with slides */}
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[2, 0.5, 128, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#4a9eff"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
      
      {/* Subtle fog for depth */}
      <fog attach="fog" args={['#000011', 30, 80]} />
    </>
  );
}

export default function ThreeDPresentationViewer({ presentation }: ThreeDPresentationViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const slideStartRef = useRef<number>(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }

    setProgress(0);
    slideStartRef.current = Date.now();

    if (isPlaying && presentation.slides[currentSlide]) {
      const slide = presentation.slides[currentSlide];

      advanceTimeoutRef.current = setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % presentation.slides.length);
      }, slide.duration);

      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - slideStartRef.current;
        const pct = Math.min(100, (elapsed / slide.duration) * 100);
        setProgress(pct);
      }, 100);
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
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
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    const next = (slideIndex + presentation.slides.length) % presentation.slides.length;
    setCurrentSlide(next);
    setProgress(0);
    slideStartRef.current = Date.now();
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

  const currentSlideData = presentation.slides[currentSlide];

  return (
    <div 
      className={`w-full h-screen bg-black ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 25], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Scene3D 
            currentSlide={currentSlide} 
            totalSlides={presentation.slides.length}
            slideData={currentSlideData}
          />
        </Canvas>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 z-10"
           style={{ width: `${progress}%` }}></div>
      
      {/* Slide indicator */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
        {currentSlide + 1} / {presentation.slides.length}
      </div>

      {/* Slide content overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {currentSlideData.title && (
            <h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-white animate-fadeIn"
              style={{
                textShadow: `
                  0 0 10px rgba(74, 158, 255, 0.5),
                  0 0 20px rgba(74, 158, 255, 0.4),
                  0 0 30px rgba(139, 92, 246, 0.3),
                  0 4px 12px rgba(0, 0, 0, 0.9),
                  0 2px 4px rgba(0, 0, 0, 0.8)
                `
              }}
            >
              {currentSlideData.title}
            </h1>
          )}
          {currentSlideData.subtitle && (
            <h2 
              className="text-2xl md:text-3xl mb-4 text-white/90 animate-fadeIn" 
              style={{ 
                animationDelay: '0.2s',
                textShadow: `
                  0 0 8px rgba(74, 158, 255, 0.4),
                  0 0 16px rgba(139, 92, 246, 0.3),
                  0 2px 8px rgba(0, 0, 0, 0.9),
                  0 1px 2px rgba(0, 0, 0, 0.8)
                `
              }}
            >
              {currentSlideData.subtitle}
            </h2>
          )}
          {currentSlideData.content && (
            <div 
              className="text-lg md:text-xl text-white/80 animate-fadeIn flex flex-col items-center gap-4" 
              style={{ 
                animationDelay: '0.4s',
                textShadow: `
                  0 0 6px rgba(74, 158, 255, 0.3),
                  0 0 12px rgba(139, 92, 246, 0.2),
                  0 2px 6px rgba(0, 0, 0, 0.9),
                  0 1px 2px rgba(0, 0, 0, 0.8)
                `
              }}
            >
              {/* Render button for slide-2 (Step 1) */}
              {currentSlideData.id === 'slide-2' && (
                <div className="my-4">
                  <PlusButton size="lg" />
                </div>
              )}
              {/* Render button for slide-6 (Batch Import Step 1) */}
              {currentSlideData.id === 'slide-6' && (
                <div className="my-4">
                  <BatchImportButton size="lg" />
                </div>
              )}
              <p>
                {currentSlideData.id === 'slide-2' 
                  ? currentSlideData.content.replace(/\+ button/g, '').replace(/the \+/g, 'the button above')
                  : currentSlideData.id === 'slide-6'
                  ? currentSlideData.content.replace(/"Batch Import Contacts" button/g, 'the button above')
                  : currentSlideData.content
                }
              </p>
            </div>
          )}
          {currentSlideData.features && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              {currentSlideData.features.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 
                    className="text-xl font-bold mb-2 text-white"
                    style={{
                      textShadow: `
                        0 0 6px rgba(74, 158, 255, 0.4),
                        0 0 12px rgba(139, 92, 246, 0.3),
                        0 2px 4px rgba(0, 0, 0, 0.8)
                      `
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-white/80"
                    style={{
                      textShadow: `
                        0 0 4px rgba(74, 158, 255, 0.3),
                        0 0 8px rgba(139, 92, 246, 0.2),
                        0 1px 2px rgba(0, 0, 0, 0.8)
                      `
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

