'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type CmsImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  fallbackSrc?: string | null;
  alt: string;
};

function CmsImageInner({ src, fallbackSrc, alt, onError, ...props }: CmsImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [triedFallback, setTriedFallback] = useState(false);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (fallbackSrc && !triedFallback && currentSrc !== fallbackSrc) {
          setTriedFallback(true);
          setCurrentSrc(fallbackSrc);
          return;
        }

        onError?.(event);
      }}
    />
  );
}

export default function CmsImage(props: CmsImageProps) {
  return <CmsImageInner key={props.src} {...props} />;
}
