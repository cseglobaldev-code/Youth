import { useState } from 'react';
import { Button } from 'antd';

const YOUTUBE_ID = '2cgswCXiaYE';

export function HeroSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Heading row */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-[90px]">
        <div className="pt-10 md:pt-14 lg:pt-[80px] flex flex-col lg:flex-row lg:items-end gap-5 md:gap-[27px] h-fit max-w-[1740px] mx-auto">
          <h1 className="font-semibold text-neutral-900 text-[clamp(2.5rem,8vw,5.375rem)] leading-[1.1] lg:w-3/5" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Uniting Youth
            <br />
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Shaping Tomorrow
            </span>
          </h1>
          <p className="text-neutral-600 text-base sm:text-lg lg:text-[24px] font-normal leading-[140%] lg:w-2/5 lg:p-[27px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Youth Organization Union brings together youth-led organizations across continents to
            drive sustainable development, global diplomacy, and meaningful change.
          </p>
        </div>
      </div>

      {/* Video thumbnail */}
      <div className="relative mx-4 sm:mx-6 lg:mx-8 xl:mx-[90px] mt-8 md:mt-12 lg:mt-[80px] rounded-2xl overflow-hidden aspect-video lg:aspect-[1740/693] mb-10 md:mb-14 lg:mb-[80px]">
        {playing ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
            title="Y.O.U Introduction Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Button type="text" className="!absolute !inset-0 !flex !items-center !justify-center !w-full !h-full !rounded-none !h-auto group" onClick={() => setPlaying(true)} aria-label="Play video">
            <img
              src="/images/home/hero/hero-video.png"
              alt="Youth collaboration"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <img src="/images/home/hero/play-video.svg" alt="Play" className="w-16 h-16 md:w-[90px] md:h-[90px] lg:w-[113px] lg:h-[113px] drop-shadow-lg group-hover:scale-105 transition-transform" />
            </span>
          </Button>
        )}
      </div>
    </section>
  );
}
