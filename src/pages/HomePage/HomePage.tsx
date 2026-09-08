import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeroSection } from '@/components/sections/home/HeroSection';
import { AboutSection } from '@/components/sections/home/AboutSection';
import { MembersSection } from '@/components/sections/home/MembersSection';
import { NewsSection } from '@/components/sections/home/NewsSection';
import { JoinSection } from '@/components/sections/home/JoinSection';
import { TeamSection } from '@/components/sections/home/TeamSection';
import { FAQSection } from '@/components/sections/home/FAQSection';
import { CTASection } from '@/components/sections/home/CTASection';
import { BlockRenderer } from '@/components/dynamic';
import { fetchHomePage } from '@/api/pages';
import { useLanguage } from '@/context/LanguageContext';
import { updatePageSEO } from '@/lib/utils/seo';
import type { PageDetailItem } from '@/types';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';
  const { language } = useLanguage();
  const [homeData, setHomeData] = useState<PageDetailItem | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchHomePage({
      locale: language,
      bypassCache: isPreview,
      signal: controller.signal,
    })
      .then((data) => {
        setHomeData(data);
      })
      .catch(() => {
        setHomeData(null);
      });

    return () => controller.abort();
  }, [language, isPreview]);

  useEffect(() => {
    if (homeData?.seo) {
      updatePageSEO(homeData.seo, 'Y.O.U – Where Unity Drives Change');
    }
  }, [homeData]);

  // If Strapi has populated dynamic homepage sections, render them
  if (homeData && homeData.contentBlocks && homeData.contentBlocks.length > 0) {
    return (
      <div className="relative w-full">
        {isPreview && (
          <div className="sticky top-[clamp(3.75rem,5.5vw,5.25rem)] z-40 flex items-center justify-between bg-amber-500 px-4 py-2 text-white shadow-md">
            <div className="mx-auto flex items-center gap-2 text-sm font-medium">
              <span><strong>Preview Mode:</strong> Viewing homepage draft version.</span>
            </div>
          </div>
        )}
        <BlockRenderer blocks={homeData.contentBlocks} />
      </div>
    );
  }

  // Otherwise, render structured default sections
  return (
    <>
      <HeroSection />
      <AboutSection />
      <MembersSection />
      <NewsSection />
      <JoinSection />
      <TeamSection />
      <CTASection />
      <FAQSection />
    </>
  );
}