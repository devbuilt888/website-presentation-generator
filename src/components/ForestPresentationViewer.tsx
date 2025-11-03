'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Presentation, PresentationSlide } from '@/data/presentations';

interface ForestPresentationViewerProps {
  presentation: Presentation;
}

// Tree component
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const trunkRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Subtle sway animation
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.001 + position[0]) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3 * scale, 0.4 * scale, 3 * scale, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      
      {/* Foliage layers */}
      {[0, 0.5, 1].map((y, i) => (
        <mesh key={i} position={[0, 3 * scale + y * scale, 0]}>
          <coneGeometry args={[1.5 * scale - i * 0.3, 2 * scale - i * 0.4, 8]} />
          <meshStandardMaterial 
            color={i === 0 ? "#1a5a2e" : "#2d7a3d"} 
            emissive="#0d3a1a"
            emissiveIntensity={0.1}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Moon component
function Moon() {
  const moonRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={moonRef} position={[15, 20, -10]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color="#f0e68c"
        emissive="#fff8dc"
        emissiveIntensity={0.5}
        roughness={0.3}
      />
    </mesh>
  );
}

// Ground/Path component
function ForestGround() {
  return (
    <>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 200]} />
        <meshStandardMaterial color="#1a1a1a" roughness={1} />
      </mesh>
      
      {/* Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <planeGeometry args={[3, 200]} />
        <meshStandardMaterial color="#2a2a2a" roughness={1} />
      </mesh>
    </>
  );
}

// Forest Scene Component
function ForestScene({ currentSlide, totalSlides, slideData }: { currentSlide: number; totalSlides: number; slideData: PresentationSlide }) {
  const treesRef = useRef<THREE.Group>(null);
  
  // Generate random tree positions along a path through the forest
  const treePositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    const pathLength = totalSlides * 15; // Distance to travel
    
    // Trees on left side
    for (let i = 0; i < 30; i++) {
      const z = -i * 8 - 20;
      const x = -8 - Math.random() * 4;
      positions.push([x, 0, z]);
    }
    
    // Trees on right side
    for (let i = 0; i < 30; i++) {
      const z = -i * 8 - 20;
      const x = 8 + Math.random() * 4;
      positions.push([x, 0, z]);
    }
    
    // Some trees scattered behind
    for (let i = 0; i < 20; i++) {
      positions.push([
        (Math.random() - 0.5) * 20,
        0,
        -Math.random() * pathLength - 50
      ]);
    }
    
    return positions;
  }, [totalSlides]);

  // Camera positions - moving forward through the forest
  const cameraPositions = useMemo(() => {
    const positions = [];
    const pathLength = totalSlides * 12;
    
    for (let i = 0; i < totalSlides; i++) {
      const progress = i / (totalSlides - 1);
      const z = -progress * pathLength;
      const x = Math.sin(progress * Math.PI * 2) * 1.5; // Slight side-to-side movement
      const y = 3 + Math.sin(progress * Math.PI * 4) * 0.5; // Slight height variation
      
      positions.push({
        position: [x, y, z] as [number, number, number],
        lookAt: [
          x + Math.sin(progress * Math.PI) * 0.5,
          y - 0.5,
          z - 10
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

  return (
    <>
      {/* Night sky with stars */}
      <Stars radius={150} depth={100} count={8000} factor={6} fade speed={0.5} />
      
      {/* Moon */}
      <Moon />
      
      {/* Moonlight */}
      <pointLight position={[15, 20, -10]} intensity={0.8} color="#fff8dc" distance={100} />
      <directionalLight position={[15, 20, -10]} intensity={0.3} color="#fff8dc" castShadow />
      
      {/* Ambient night light */}
      <ambientLight intensity={0.15} color="#4a6fa5" />
      
      {/* Flickering firefly lights */}
      {Array.from({ length: 5 }).map((_, i) => {
        const time = Date.now() * 0.001;
        const z = -currentSlide * 12 - 20;
        return (
          <pointLight
            key={i}
            position={[
              (Math.random() - 0.5) * 15,
              2 + Math.random() * 3,
              z + Math.random() * 20
            ]}
            intensity={0.5 + Math.sin(time + i) * 0.3}
            color="#ffff99"
            distance={5}
          />
        );
      })}
      
      {/* Ground */}
      <ForestGround />
      
      {/* Trees */}
      <group ref={treesRef}>
        {treePositions.map((position, index) => (
          <Tree 
            key={index} 
            position={position} 
            scale={0.8 + Math.random() * 0.4}
          />
        ))}
      </group>
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#0a0a1a', 30, 80]} />
    </>
  );
}

export default function ForestPresentationViewer({ presentation }: ForestPresentationViewerProps) {
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
          camera={{ position: [0, 3, 0], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
          shadows
        >
          <ForestScene 
            currentSlide={currentSlide} 
            totalSlides={presentation.slides.length}
            slideData={currentSlideData}
          />
        </Canvas>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-300 z-10"
           style={{ width: `${progress}%` }}></div>
      
      {/* Slide indicator */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
        {currentSlide + 1} / {presentation.slides.length}
      </div>

      {/* Slide content overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {currentSlideData.title && (
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] animate-fadeIn">
              {currentSlideData.title}
            </h1>
          )}
          {currentSlideData.subtitle && (
            <h2 className="text-2xl md:text-3xl mb-4 text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              {currentSlideData.subtitle}
            </h2>
          )}
          {currentSlideData.content && (
            <p className="text-lg md:text-xl text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              {currentSlideData.content}
            </p>
          )}
          {currentSlideData.features && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              {currentSlideData.features.map((feature: any, index: number) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
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
            className="text-white hover:text-green-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handlePlayPause}
            className="text-white hover:text-green-400 transition-colors"
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
            className="text-white hover:text-green-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            onClick={handleFullscreen}
            className="text-white hover:text-green-400 transition-colors"
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

