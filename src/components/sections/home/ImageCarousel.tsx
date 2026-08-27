import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useMediaQuery } from '@/hooks';

const AUTO_ADVANCE_INTERVAL_MS = 5_000;

const BANNER_IMAGES = [
  { id: 'ambassador-1', src: '/images/home/about/ambassador-1.jpg', alt: 'Y.O.U Ambassador of Unity — Mr. Hon Abdalla Said, Youth Leader' },
  { id: 'ambassador-2', src: '/images/home/about/ambassador-2.jpg', alt: 'Y.O.U Ambassador of Unity — Ms. Minh Anh Nguyen (Winnie), Youth Leader / International Delegate' },
  { id: 'ambassador-3', src: '/images/home/about/ambassador-3.jpg', alt: 'Y.O.U Ambassador of Unity — Ms. Theodora Abena Yeboah, Vice President of Y.O.U / Founder of Education Hub Ghana' },
  { id: 'ambassador-4', src: '/images/home/about/ambassador-4.jpg', alt: 'Y.O.U Ambassador of Unity — Ms. Thuy Linh Nguyen (Emily), Vice President of Y.O.U / Founder of CSE Global' },
  { id: 'ambassador-5', src: '/images/home/about/ambassador-5.jpg', alt: 'Y.O.U Ambassador of Unity — Mr. Hai Nguyen, Founder of Unikorn' },
  { id: 'ambassador-6', src: '/images/home/about/ambassador-6.jpg', alt: 'Y.O.U Ambassador of Unity — Mr. Ahmad Raza, Youth Leader Driving Peace, Climate Action & Community Unity' },
] as const;

export function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const shouldAutoAdvance = !prefersReducedMotion && !isUserPaused && !isHovered && !isFocused;

  useEffect(() => {
    if (!shouldAutoAdvance) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % BANNER_IMAGES.length);
    }, AUTO_ADVANCE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [shouldAutoAdvance]);

  const selectSlide = (index: number) => {
    setActiveIndex((index + BANNER_IMAGES.length) % BANNER_IMAGES.length);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (!(nextFocusedElement instanceof Node) || !event.currentTarget.contains(nextFocusedElement)) {
      setIsFocused(false);
    }
  };

  const activeImage = BANNER_IMAGES[activeIndex];

  return (
    <div
      aria-label="Y.O.U banner images"
      aria-roledescription="carousel"
      className="relative h-full w-full overflow-hidden"
      onBlurCapture={handleBlur}
      onFocusCapture={() => setIsFocused(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div aria-label={`Slide ${activeIndex + 1} of ${BANNER_IMAGES.length}`} role="group" className="h-full w-full">
        <img
          key={activeImage.id}
          src={activeImage.src}
          alt={activeImage.alt}
          className="h-full w-full object-cover"
          loading={activeIndex === 0 ? 'eager' : 'lazy'}
        />
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
        <div className="flex items-center gap-2" aria-label="Banner slide selection" role="group">
          {BANNER_IMAGES.map((image, index) => (
            <button
              key={image.id}
              type="button"
              aria-current={index === activeIndex ? 'true' : undefined}
              aria-label={`Go to slide ${index + 1}`}
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
