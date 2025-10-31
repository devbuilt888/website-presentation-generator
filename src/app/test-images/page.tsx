'use client';

import { useState, useEffect } from 'react';

export default function ImageTest() {
  const [imageStatus, setImageStatus] = useState<Record<string, string>>({});

  const testImages = [
    '/assets/presentation1/CPZslide1Bg.png',
    '/assets/presentation1/CPZslide2Bg.png',
    '/assets/presentation1/CPZslide3Bg.png',
    '/assets/presentation1/CPZslide4Bg.png',
    '/assets/presentation1/CPZslide5Bg.png',
    '/assets/presentation1/CPZslide6Bg.png',
    '/assets/presentation1/CPZslide8Bg.png',
    '/assets/presentation1/CPZslide9Bg.png',
    '/assets/presentation1/CPZslide10Bg.png',
    '/assets/presentation1/CPZslide11Bg.png',
    '/assets/presentation1/CPZslide12Bg.png',
    '/assets/presentation1/CPZslide13Bg.png',
    '/assets/presentation1/CPZslide14Bg.png',
    '/assets/presentation1/CPZslide15Bg.png',
    '/assets/presentation1/CPZslide16Bg.png',
    '/assets/presentation1/CPZslide17Bg.png',
    '/assets/presentation1/CPZslide18Bg.png',
  ];

  useEffect(() => {
    testImages.forEach(imagePath => {
      const img = new Image();
      img.onload = () => {
        setImageStatus(prev => ({ ...prev, [imagePath]: 'loaded' }));
      };
      img.onerror = () => {
        setImageStatus(prev => ({ ...prev, [imagePath]: 'error' }));
      };
      img.src = imagePath;
    });
  }, [testImages]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Results</h1>
      <div className="space-y-2">
        {testImages.map(imagePath => (
          <div key={imagePath} className="flex items-center gap-4">
            <span className="w-80 text-sm">{imagePath}</span>
            <span className={`px-2 py-1 rounded text-sm ${
              imageStatus[imagePath] === 'loaded' ? 'bg-green-100 text-green-800' :
              imageStatus[imagePath] === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {imageStatus[imagePath] || 'loading...'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
