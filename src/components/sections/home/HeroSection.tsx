import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useMediaQuery } from '@/hooks';

const AUTO_ADVANCE_INTERVAL_MS = 5_000;

const HERO_VIDEOS = [
  { id: 'v4bPO0DfeC8', title: 'Youth Organization Union video 1' },
  { id: 'NN2JbpVW1q4', title: 'Youth Organization Union video 2' },
  { id: '2cgswCXiaYE', title: 'Y.O.U Introduction Video' },
] as const;

function getYoutubeThumbnail(videoId: string, quality: 'maxresdefault' | 'hqdefault') {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const activeVideo = HERO_VIDEOS[activeIndex];
  const isPlaying = playingIndex === activeIndex;
  const shouldAutoAdvance =
    !prefersReducedMotion && !isUserPaused && !isHovered && !isFocused && !isPlaying;

  useEffect(() => {
    if (!shouldAutoAdvance) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_VIDEOS.length);
      setPlayingIndex(null);
    }, AUTO_ADVANCE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [shouldAutoAdvance]);

  const selectSlide = (index: number) => {
    setActiveIndex((index + HERO_VIDEOS.length) % HERO_VIDEOS.length);
    setPlayingIndex(null);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) {
      setIsFocused(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pb-12 md:pb-16 lg:pb-[7.5rem]">
      {/* Heading row */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-6 xl:px-10 2xl:px-[90px]">
        <div className="flex h-fit flex-col gap-4 pt-10 text-left md:flex-row md:items-end md:gap-6 md:pt-14 lg:gap-6 lg:pt-[120px]">
          <h1
            className="font-semibold text-neutral-900 text-[clamp(2rem,8vw,2.75rem)] leading-[110%] tracking-[0px] md:w-3/5 md:text-[clamp(2.5rem,6.1vw,4.5rem)] 2xl:text-[86px]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <span className="whitespace-nowrap">Uniting Youth</span>
            <br />
            <span className="whitespace-nowrap bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Shaping Tomorrow
            </span>
          </h1>
          <p
            className="mx-auto max-w-[620px] text-neutral-600 text-[clamp(0.875rem,3.7vw,1rem)] font-normal leading-[140%] tracking-[0px] md:max-w-none md:text-[clamp(1rem,2.3vw,1.5rem)] lg:w-2/5 lg:p-[27px]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Youth Organization Union brings together youth-led organizations across continents to
            drive sustainable development, global diplomacy, and meaningful change.
          </p>
        </div>
      </div>

      {/* Video carousel */}
      <div className="mx-auto mt-8 mb-10 w-full px-4 sm:px-6 md:mt-12 md:mb-14 lg:mt-[80px] lg:mb-0 lg:px-6 xl:px-10 2xl:px-[90px]">
        <div
          aria-label="Youth Organization Union videos"
          aria-roledescription="carousel"
          className="relative aspect-[344/148] w-full overflow-hidden rounded-[16px] md:aspect-[1740/693] md:rounded-[30px] lg:rounded-[40px]"
          onBlurCapture={handleBlur}
          onFocusCapture={() => setIsFocused(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div aria-label={`Slide ${activeIndex + 1} of ${HERO_VIDEOS.length}`} role="group" className="h-full w-full">
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
                  <span className="relative h-[44px] w-[44px] md:h-[90px] md:w-[90px] lg:h-[136px] lg:w-[136px]">
                    <img
                      src="/images/home/hero/play-video.svg"
                      alt=""
                      className="absolute inset-0 h-full w-full opacity-80 drop-shadow-lg transition-transform group-hover:scale-105 lg:inset-auto lg:top-[11.33px] lg:left-[11.33px] lg:h-[113.333px] lg:w-[113.333px]"
                    />
                  </span>
                </span>
              </button>
            )}
          </div>

          <button
            type="button"
            aria-label="Previous slide"
            className="absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EE334E] md:left-6 md:h-11 md:w-11"
            onClick={() => selectSlide(activeIndex - 1)}
          >
            <Icon name="lucide:chevron-left" size={22} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EE334E] md:right-6 md:h-11 md:w-11"
            onClick={() => selectSlide(activeIndex + 1)}
          >
            <Icon name="lucide:chevron-right" size={22} />
          </button>

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
              {HERO_VIDEOS.map((video, index) => (
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
      </div>
    </section>
  );
}
