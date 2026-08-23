import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useMediaQuery } from '@/hooks';

const AUTO_ADVANCE_INTERVAL_MS = 5_000;

const VIDEOS = [
  { id: 'v4bPO0DfeC8', title: 'Youth Organization Union video 1' },
  { id: 'NN2JbpVW1q4', title: 'Youth Organization Union video 2' },
  { id: '2cgswCXiaYE', title: 'Y.O.U Introduction Video' },
] as const;

function getYoutubeThumbnail(videoId: string, quality: 'maxresdefault' | 'hqdefault') {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

export function VideoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const activeVideo = VIDEOS[activeIndex];
  const isPlaying = playingIndex === activeIndex;
  const shouldAutoAdvance =
    !prefersReducedMotion && !isUserPaused && !isHovered && !isFocused && !isPlaying;

  useEffect(() => {
    if (!shouldAutoAdvance) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % VIDEOS.length);
      setPlayingIndex(null);
    }, AUTO_ADVANCE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [shouldAutoAdvance]);

  const selectSlide = (index: number) => {
    setActiveIndex((index + VIDEOS.length) % VIDEOS.length);
    setPlayingIndex(null);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) {
      setIsFocused(false);
    }
  };

  return (
    <div
      aria-label="Youth Organization Union videos"
      aria-roledescription="carousel"
      className="relative h-full w-full overflow-hidden rounded-2xl"
      onBlurCapture={handleBlur}
      onFocusCapture={() => setIsFocused(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div aria-label={`Slide ${activeIndex + 1} of ${VIDEOS.length}`} role="group" className="h-full w-full">
        {isPlaying ? (
          <iframe
            key={activeVideo.id}
            className="h-full w-full border-0"
            src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&playsinline=1&rel=0`}
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center border-0 bg-transparent p-0"
            onClick={() => setPlayingIndex(activeIndex)}
            aria-label={`Play video: ${activeVideo.title}`}
          >
            <img
              src={getYoutubeThumbnail(activeVideo.id, 'maxresdefault')}
              alt={activeVideo.title}
              className="h-full w-full object-cover"
              loading={activeIndex === 0 ? 'eager' : 'lazy'}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = getYoutubeThumbnail(activeVideo.id, 'hqdefault');
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="relative h-[44px] w-[44px] md:h-[90px] md:w-[90px]">
                <img
                  src="/images/home/hero/play-video.svg"
                  alt=""
                  className="absolute inset-0 h-full w-full opacity-80 drop-shadow-lg transition-transform group-hover:scale-105"
                />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="absolute right-3 bottom-3 z-10 flex items-center gap-2 rounded-full bg-neutral-900/65 px-3 py-2 text-white md:right-6 md:bottom-6">
        <button
          type="button"
          aria-label={isUserPaused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'}
          aria-pressed={isUserPaused}
          className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={() => setIsUserPaused((current) => !current)}
        >
          <Icon name={isUserPaused ? 'lucide:play' : 'lucide:pause'} size={14} />
        </button>
        <div className="flex items-center gap-2" aria-label="Video slide selection" role="group">
          {VIDEOS.map((video, index) => (
            <button
              key={video.id}
              type="button"
              aria-current={index === activeIndex ? 'true' : undefined}
              aria-label={`Go to slide ${index + 1}: ${video.title}`}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                index === activeIndex ? 'w-6 bg-white' : 'w-2.5 bg-white/60 hover:bg-white'
              }`}
              onClick={() => selectSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
