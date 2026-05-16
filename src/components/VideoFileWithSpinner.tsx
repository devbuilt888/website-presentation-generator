'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode, VideoHTMLAttributes } from 'react';
import VideoLoadingOverlay from '@/components/VideoLoadingOverlay';

type Props = {
  src: string;
  shellClassName?: string;
  videoClassName?: string;
  children?: ReactNode;
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'>;

export default function VideoFileWithSpinner({
  src,
  shellClassName = 'omega-video-shell relative aspect-video w-full overflow-hidden rounded-xl bg-black',
  videoClassName = 'absolute inset-0 h-full w-full object-contain',
  controls = true,
  onLoadedData: onLoadedDataProp,
  onError: onErrorProp,
  children,
  ...rest
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const endLoading = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className={shellClassName}>
      <VideoLoadingOverlay visible={!loaded} />
      <video
        {...rest}
        src={src}
        controls={controls}
        className={videoClassName}
        onLoadedData={(e) => {
          endLoading();
          onLoadedDataProp?.(e);
        }}
        onError={(e) => {
          endLoading();
          onErrorProp?.(e);
        }}
      >
        {children}
      </video>
    </div>
  );
}
