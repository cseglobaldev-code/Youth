import { ImageCarousel } from './ImageCarousel';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-12 md:pb-16 lg:pb-[7.5rem]">
      {/* Heading row */}
      <div className="mx-auto w-full max-w-[95%] px-[30px]">
        <div className="flex h-fit flex-col gap-4 pt-10 text-left md:flex-row md:items-center md:gap-6 md:pt-14 lg:gap-6">
          <h1
            className="font-semibold text-neutral-900 text-[clamp(2rem,8vw,2.75rem)] leading-[110%] tracking-[0px] md:w-3/5 md:text-[clamp(2.5rem,6.1vw,4.5rem)] 2xl:text-[86px]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <span className="whitespace-nowrap">
              Where{' '}
              <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
                Unity
              </span>
            </span>
            <br />
            <span className="whitespace-nowrap">
              Drives{' '}
              <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
                Change
              </span>
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

      {/* Banner image carousel */}
      <div className="mx-auto mt-8 mb-10 w-full max-w-[95%] px-[30px] md:mt-12 md:mb-14 lg:mt-[80px] lg:mb-0">
        <div className="aspect-[344/148] w-full overflow-hidden rounded-[16px] md:aspect-[1740/693] md:rounded-[30px] lg:rounded-[40px]">
          <ImageCarousel />
        </div>
      </div>
    </section>
  );
}
