import { useState } from 'react';
import { Button } from 'antd';

const YOUTUBE_ID = '2cgswCXiaYE';

export function HeroSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Heading row */}
      <div className="px-4 md:px-8 lg:px-[90px]">
        <div className="pt-[120px] pb-[120px] flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <h1 className="font-heading font-semibold text-neutral-900 text-4xl md:text-5xl lg:text-[86px] leading-[1.1]">
            Uniting Youth
            <br />
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Shaping Tomorrow
            </span>
          </h1>
          <p className="text-neutral-600 text-[24px] font-normal leading-relaxed lg:max-w-[380px] lg:self-center">
            Youth Organization Union brings together youth-led organizations across continents to
            drive sustainable development, global diplomacy, and meaningful change.
          </p>
        </div>
      </div>

      {/* Video thumbnail */}
      <div className="relative mx-4 md:mx-8 lg:mx-[90px] rounded-2xl overflow-hidden aspect-[1740/693] mb-[120px]">
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
              src="/hero-video.png"
              alt="Youth collaboration"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <img src="/play-video.svg" alt="Play" className="w-[113px] h-[113px] drop-shadow-lg group-hover:scale-105 transition-transform" />
            </span>
          </Button>
        )}
      </div>
    </section>
  );
}
