import { useState } from 'react';

const YOUTUBE_ID = '2cgswCXiaYE';

export function HeroSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Heading row */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-[90px]">
        <div className="mx-auto flex h-fit max-w-[1740px] flex-col gap-4 pt-10 text-left md:flex-row md:items-end md:gap-6 md:pt-14 lg:gap-[27px] lg:pt-[80px]">
          <h1
            className="font-semibold text-neutral-900 text-[clamp(2rem,8vw,2.75rem)] leading-[1.08] md:w-3/5 md:text-[clamp(2.5rem,6.1vw,4.5rem)] 2xl:text-[86px]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <span className="whitespace-nowrap">Uniting Youth</span>
            <br />
            <span className="whitespace-nowrap bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Shaping Tomorrow
            </span>
          </h1>
          <p
            className="mx-auto max-w-[620px] text-neutral-600 text-[clamp(0.875rem,3.7vw,1rem)] font-normal leading-[150%] md:max-w-none md:text-[clamp(1rem,2.3vw,1.5rem)] lg:w-2/5 lg:p-[27px]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Youth Organization Union brings together youth-led organizations across continents to
            drive sustainable development, global diplomacy, and meaningful change.
          </p>
        </div>
      </div>

      {/* Video thumbnail */}
      <div className="relative mt-8 mb-10 aspect-[344/148] w-full overflow-hidden rounded-[16px] md:mt-12 md:mb-14 md:aspect-[1740/693] md:rounded-[30px] lg:mt-[80px] lg:mb-[80px]">
        {playing ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
            title="Y.O.U Introduction Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center border-0 bg-transparent p-0"
            onClick={() => setPlaying(true)}
            aria-label="Play video"
          >
            <img
              src="/images/home/hero/hero-video.png"
              alt="Youth collaboration"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <img
                src="/images/home/hero/play-video.svg"
                alt="Play"
                className="h-[44px] w-[44px] drop-shadow-lg transition-transform group-hover:scale-105 md:h-[90px] md:w-[90px] lg:h-[113px] lg:w-[113px]"
              />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
