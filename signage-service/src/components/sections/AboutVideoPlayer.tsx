'use client';

import { useRef, useState } from 'react';

type AboutVideoPlayerProps = {
  mediaLabel: string;
  playLabel: string;
  posterSrc: string;
  videoSrc: string;
};

export default function AboutVideoPlayer({
  mediaLabel,
  playLabel,
  posterSrc,
  videoSrc,
}: AboutVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    await videoRef.current?.play();
  };

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] bg-[#0E1A2B] shadow-2xl">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        controls
        playsInline
        preload="metadata"
        poster={posterSrc}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#0E1A2B] shadow-sm">
        {mediaLabel}
      </div>

      {!isPlaying ? (
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-[#0E1A2B]/25 text-white transition-colors hover:bg-[#0E1A2B]/18"
          aria-label={playLabel}
        >
          <span className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-[14px] font-black text-[#0E1A2B] shadow-xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B8643E] text-white">
              <svg className="ml-0.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            {playLabel}
          </span>
        </button>
      ) : null}
    </div>
  );
}
