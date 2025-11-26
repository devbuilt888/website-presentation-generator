'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Presentation } from '@/data/presentations';
import { getAssetUrl } from '@/config/assets';
import { saveUserResponse, logStoreLinkClick } from '@/lib/services/instances';

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

interface OmegaBalancePlusPresentationViewerProps {
  presentation: Presentation;
  instanceId?: string;
}

// Floating Image Component
function FloatingImage({ 
  position, 
  rotation, 
  textureUrl,
  speed = 1 
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  textureUrl: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.002;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.rotation.z += Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[3, 3]} />
      <meshStandardMaterial 
        map={texture} 
        transparent 
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Floating 3D Model Component
function FloatingModel({ 
  position, 
  rotation, 
  modelUrl,
  speed = 1 
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  modelUrl: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);
  
  // Clone the scene to avoid sharing geometry
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.003;
      meshRef.current.rotation.y += 0.015 * speed;
      meshRef.current.rotation.x += Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.01;
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={clonedScene} 
      position={position} 
      rotation={rotation}
      scale={[2, 2, 2]}
    />
  );
}

// Conveyor Belt Image Component (2D flat facing camera)
function ConveyorImage({ 
  position, 
  textureUrl 
}: { 
  position: [number, number, number]; 
  textureUrl: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  
  // Fix texture orientation - flip Y axis (vertical flip) to correct backwards text
  texture.flipY = false; // This flips the texture vertically
  texture.needsUpdate = true;
  
  return (
    <group position={position}>
      {/* White glow effect - bottom emphasis (larger at bottom) */}
      <mesh rotation={[0, 0, 0]} position={[0, -0.5, -0.1]}>
        <planeGeometry args={[7.5, 8]} />
        <meshStandardMaterial 
          color="#ffffff"
          transparent 
          opacity={0.6}
          emissive="#ffffff"
          emissiveIntensity={1.0}
        />
      </mesh>
      {/* White glow effect - outer ring */}
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial 
          color="#ffffff"
          transparent 
          opacity={0.5}
          emissive="#ffffff"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* White glow effect - inner ring */}
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[6.5, 6.5]} />
        <meshStandardMaterial 
          color="#ffffff"
          transparent 
          opacity={0.6}
          emissive="#ffffff"
          emissiveIntensity={0.9}
        />
      </mesh>
      {/* Main image - no rotation, just fix texture flip */}
      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Pattern Background Image Component (2D flat)
function PatternImage({ 
  position, 
  textureUrl 
}: { 
  position: [number, number, number]; 
  textureUrl: string;
}) {
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  texture.flipY = false;
  texture.needsUpdate = true;
  
  return (
    <mesh position={position} rotation={[0, 0, 0]}>
      <planeGeometry args={[6, 6]} />
      <meshStandardMaterial 
        map={texture} 
        transparent={false}
        opacity={1.0}
        side={THREE.FrontSide}
        toneMapped={false}
        color="#ffffff"
      />
    </mesh>
  );
}

// Repeating Pattern Background Scene - Scrolls upward infinitely
function PatternBackgroundScene() {
  const imageUrls = useMemo(() => [
    getAssetUrl('assets/zinzi-special-assets/balanceOil-one.png'),
    getAssetUrl('assets/zinzi-special-assets/balanceOil-two.png'),
    getAssetUrl('assets/zinzi-special-assets/xtend-one.png'),
  ], []);

  const groupRef = useRef<THREE.Group>(null);
  const spacing = 7; // Spacing between tiles (slightly larger for better visibility)
  const scrollSpeed = 0.01; // Slow upward scroll speed
  const tilesPerRow = 7; // Number of tiles per row
  const rowsPerSet = 10; // Number of rows per set (for seamless looping)

  // Ensure camera looks at the center and animate pattern
  useFrame((state) => {
    // Make camera look at center of pattern
    state.camera.lookAt(0, 0, 0);
    
    if (groupRef.current) {
      // Move upward
      groupRef.current.position.y += scrollSpeed;
      
      // Reset position when it moves up one full set for seamless loop
      const setHeight = rowsPerSet * spacing;
      if (groupRef.current.position.y >= setHeight) {
        groupRef.current.position.y -= setHeight;
      }
    }
  });

  // Start pattern from below screen - one set height down
  // This ensures seamless scrolling from bottom to top
  const initialYOffset = -(rowsPerSet * spacing);

  return (
    <>
      {/* Bright lighting to ensure images are visible */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[0, 0, 10]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[0, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 0, 10]} intensity={1.0} color="#ffffff" />
      
      <group ref={groupRef} position={[0, initialYOffset, 0]}>
        {/* Create multiple sets vertically for seamless looping */}
        {[...Array(3)].map((_, setIndex) => 
          // Create rows
          Array.from({ length: rowsPerSet }).map((_, rowIndex) => 
            // Create columns
            Array.from({ length: tilesPerRow }).map((_, colIndex) => {
              const imageIndex = (rowIndex * tilesPerRow + colIndex) % imageUrls.length;
              // Offset every other row for a staggered/geometric pattern
              const x = (colIndex - tilesPerRow / 2) * spacing + (rowIndex % 2) * (spacing / 2);
              const y = (setIndex * rowsPerSet + rowIndex) * spacing;
              
              return (
                <Suspense key={`pattern-${setIndex}-${rowIndex}-${colIndex}`} fallback={null}>
                  <PatternImage
                    position={[x, y, 0]}
                    textureUrl={imageUrls[imageIndex]}
                  />
                </Suspense>
              );
            })
          )
        )}
      </group>
    </>
  );
}

// Background Scene Component
function FloatingAssetsScene({ currentSlide }: { currentSlide: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const modelUrls = useMemo(() => [
    getAssetUrl('assets/zinzi-special-assets/xtend-one.glb'),
    getAssetUrl('assets/zinzi-special-assets/balanceOil-premium.glb'),
    getAssetUrl('assets/zinzi-special-assets/balanceOil-two.glb'),
  ], []);

  // Determine effect mode based on slide index (only models now)
  const effectMode = useMemo(() => {
    const mode = currentSlide % 2;
    if (mode === 0) return 'models'; // 3D models only
    return 'mixed'; // Mixed (but only models)
  }, [currentSlide]);

  // Generate positions for assets
  const assetPositions = useMemo(() => {
    const positions: Array<{ position: [number, number, number]; rotation: [number, number, number]; speed: number }> = [];
    const count = effectMode === 'mixed' ? 4 : 3;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 8 + Math.random() * 4;
      positions.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 6,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI * 0.2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 0.2,
        ] as [number, number, number],
        speed: 0.5 + Math.random() * 0.5,
      });
    }
    return positions;
  }, [effectMode, currentSlide]);

  // Animate camera movement
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }

    // Smooth camera movement
    const angle = (currentSlide / 10) * Math.PI * 2;
    const radius = 25;
    const targetX = Math.cos(angle) * radius;
    const targetY = Math.sin(angle * 0.3) * 3;
    const targetZ = Math.sin(angle) * radius;

    state.camera.position.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.6} color="#6366f1" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#8b5cf6" distance={20} />

      {/* Background gradient fog */}
      <fog attach="fog" args={['#0a0a1a', 20, 60]} />

      {/* Floating Assets Group */}
      <group ref={groupRef}>
        {effectMode === 'models' && assetPositions.map((asset, i) => (
          <Suspense key={`model-${i}`} fallback={null}>
            <FloatingModel
              position={asset.position}
              rotation={asset.rotation}
              modelUrl={modelUrls[i % modelUrls.length]}
              speed={asset.speed}
            />
          </Suspense>
        ))}

        {effectMode === 'mixed' && assetPositions.map((asset, i) => (
          <Suspense key={`mixed-model-${i}`} fallback={null}>
            <FloatingModel
              position={asset.position}
              rotation={asset.rotation}
              modelUrl={modelUrls[i % modelUrls.length]}
              speed={asset.speed}
            />
          </Suspense>
        ))}
      </group>
    </>
  );
}

export default function OmegaBalancePlusPresentationViewer({ presentation, instanceId }: OmegaBalancePlusPresentationViewerProps) {
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
      'slide-10-final': 10,
      'slide-11-conveyor': 10, // Stay on conveyor slide
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

  // Check if current slide is the pattern background slide
  const isPatternSlide = currentSlide.id === 'slide-11-conveyor';

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* CSS Pattern Background for slide 11 */}
      {isPatternSlide ? (
        <PatternBackgroundCSS />
      ) : (
        <>
          {/* 3D Background - Floating Assets */}
          <div className="absolute inset-0 z-0">
            <Canvas
              camera={{ position: [0, 0, 25], fov: 75 }}
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
              dpr={[1, 1.5]} // Limit pixel ratio for performance
            >
              <FloatingAssetsScene currentSlide={currentSlideIndex} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
            </Canvas>
          </div>
        </>
      )}

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
            
            {currentSlide.content && (
              <a
                href={currentSlide.content}
                target="_blank"
                rel="noopener noreferrer"
                onClick={async () => {
                  if (instanceId && currentSlide.content) {
                    try {
                      await logStoreLinkClick(instanceId, currentSlide.content, 'slide-10-final-ver-productos');
                    } catch (error) {
                      console.error('Failed to log store link click:', error);
                    }
                  }
                }}
                className="mt-8 inline-block px-12 py-4 text-xl font-bold bg-indigo-600/90 hover:bg-indigo-500/90 backdrop-blur-sm text-white rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-400/50"
              >
                Ver Productos →
              </a>
            )}
          </div>
        )}

        {/* Slide 11: Pattern Background - Product Images Repeating Pattern */}
        {currentSlide.id === 'slide-11-conveyor' && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* No content - just the pattern background */}
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

