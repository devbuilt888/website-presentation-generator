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

  const aspect = useMemo(() => baseWidth / baseHeight, [baseWidth, baseHeight]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleResize = () => {
      const { clientWidth, clientHeight } = el;
      if (!clientWidth || !clientHeight) return;
      const containerAspect = clientWidth / clientHeight;
      const nextScale = containerAspect > aspect
        ? clientHeight / baseHeight
        : clientWidth / baseWidth;
      setScale(nextScale);
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
      className={`relative w-full h-full bg-black flex items-center justify-center ${className || ''}`}
      style={{ overflow: 'hidden' }}
    >
      <div
        className="origin-top-left"
        style={{ width: baseWidth, height: baseHeight, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}


