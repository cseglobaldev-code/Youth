import { useState } from 'react';

const YOUTUBE_ID = '2cgswCXiaYE';

export function HeroSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Heading row */}
      <div className="px-4 md:px-8 lg:px-[90px]">
        <div className="pt-[80px] pb-[40px] flex flex-col lg:flex-row lg:items-center justify-between w-[1740px] h-[190px] mx-auto">
          <h1 className="font-heading font-semibold text-neutral-900 text-4xl md:text-5xl lg:text-[86px] leading-[1.1] w-[1079px] h-[190px]">
            Uniting Youth
            <br />
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Shaping Tomorrow
            </span>
          </h1>
          <p className="text-neutral-600 text-[20px] font-normal leading-relaxed w-[629px] h-[136px] flex items-center lg:pb-0">
            Youth Organization Union brings together youth-led organizations across continents to
            drive sustainable development, global diplomacy, and meaningful change.
          </p>
        </div>
      </div>

      {/* Video thumbnail */}
      <div className="relative mx-4 md:mx-8 lg:mx-[90px] rounded-2xl overflow-hidden aspect-[1740/693] mb-[80px]">
        {playing ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
            title="Y.O.U Introduction Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            className="absolute inset-0 flex items-center justify-center group w-full h-full"
            onClick={() => setPlaying(true)}
            aria-label="Play video"
          >
            <img
              src="/hero-video.png"
              alt="Youth collaboration"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <img src="/play-video.svg" alt="Play" className="w-[113px] h-[113px] drop-shadow-lg group-hover:scale-105 transition-transform" />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
