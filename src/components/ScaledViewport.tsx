'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface ScaledViewportProps {
  baseWidth?: number;
  baseHeight?: number;
  className?: string;
  children: React.ReactNode;
}

export default function ScaledViewport({
  baseWidth = 1920,
  baseHeight = 1080,
  className,
  children
}: ScaledViewportProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const aspect = useMemo(() => baseWidth / baseHeight, [baseWidth, baseHeight]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleResize = () => {
      const { clientWidth, clientHeight } = el;
      if (!clientWidth || !clientHeight) return;
      
      const containerAspect = clientWidth / clientHeight;
      const scaledWidth = baseWidth;
      const scaledHeight = baseHeight;
      
      // Calculate scale to fit within container while maintaining aspect ratio
      let nextScale: number;
      if (containerAspect > aspect) {
        // Container is wider - scale based on height
        nextScale = clientHeight / baseHeight;
      } else {
        // Container is taller - scale based on width
        nextScale = clientWidth / baseWidth;
      }
      
      // Calculate the actual scaled dimensions
      const actualScaledWidth = scaledWidth * nextScale;
      const actualScaledHeight = scaledHeight * nextScale;
      
      // Center the content
      const nextTranslateX = (clientWidth - actualScaledWidth) / 2;
      const nextTranslateY = (clientHeight - actualScaledHeight) / 2;
      
      setScale(nextScale);
      setTranslateX(nextTranslateX);
      setTranslateY(nextTranslateY);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(el);
    window.addEventListener('resize', handleResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [aspect, baseWidth, baseHeight]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black ${className || ''}`}
      style={{ overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute',
          width: baseWidth,
          height: baseHeight,
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}


