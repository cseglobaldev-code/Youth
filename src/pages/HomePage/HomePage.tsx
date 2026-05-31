import { HeroSection } from '@/components/sections/home/HeroSection';
import { AboutSection } from '@/components/sections/home/AboutSection';
import { MembersSection } from '@/components/sections/home/MembersSection';
import { NewsSection } from '@/components/sections/home/NewsSection';
import { JoinSection } from '@/components/sections/home/JoinSection';
import { TeamSection } from '@/components/sections/home/TeamSection';
import { FAQSection } from '@/components/sections/home/FAQSection';
import { CTASection } from '@/components/sections/home/CTASection';
import { NEWS_DATA, TEAM_DATA, FAQS_DATA } from '@/data';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <MembersSection />
      <NewsSection items={NEWS_DATA} />
      <JoinSection />
      <TeamSection members={TEAM_DATA} />
      <CTASection />
      <FAQSection faqs={FAQS_DATA} />
    </>
  );
}
