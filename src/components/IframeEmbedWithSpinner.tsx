'use client';

import { useCallback, useEffect, useState } from 'react';
import VideoLoadingOverlay from '@/components/VideoLoadingOverlay';

type Props = {
  src: string;
  title: string;
  allow?: string;
  shellClassName?: string;
  iframeClassName?: string;
};

export default function IframeEmbedWithSpinner({
  src,
  title,
  allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  shellClassName = 'omega-video-shell relative aspect-video w-full overflow-hidden rounded-xl bg-black',
  iframeClassName = 'absolute inset-0 h-full w-full border-0',
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className={shellClassName}>
      <VideoLoadingOverlay visible={!loaded} />
      <iframe
        src={src}
        title={title}
        allow={allow}
        allowFullScreen
        className={iframeClassName}
        onLoad={onLoad}
      />
    </div>
  );
}
