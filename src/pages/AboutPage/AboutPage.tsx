import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { CTABanner } from '@/components/common/CTABanner';
import { StatsGrid } from '@/components/common/StatsGrid';
import type { StatsGridItem } from '@/components/common/StatsGrid';
import { Icon } from '@/components/ui/Icon';
import { useJoinNavigation } from '@/hooks';
import { StrapiService } from '@/lib/strapi';

const DEFAULT_STATS: StatsGridItem[] = [
  { label: 'Member Organizations', value: 50 },
  { label: 'Continents', value: 6 },
  { label: 'Countries', value: 30 },
  { label: 'Volunteers from Global', value: 1500 },
];

const MISSIONS = [
  {
    title: 'Community Connection',
    description: 'Connecting people, organizations, and positive ideas.',
    icon: 'lucide:badge-check',
    active: true,
  },
  {
    title: 'Education',
    description: 'Enhancing knowledge and developing capabilities.',
    icon: 'lucide:graduation-cap',
  },
  {
    title: 'International Cooperation',
    description: 'Building collaborative networks for common development.',
    icon: 'lucide:globe-2',
  },
  {
    title: 'Sustainable Development',
    description: 'Towards a prosperous and sustainable community.',
    icon: 'lucide:orbit',
  },
];

const ACTIVITIES = [
  {
    title: 'Education & Training',
    description: 'Organizing programs to enhance knowledge and skills for the community.',
    image: '/images/about/activities/education-training.png',
  },
  {
    title: 'Volunteering & Community Service',
    description: 'Implementing charitable activities and supporting those in need.',
    image: '/images/about/activities/volunteering-community.png',
  },
  {
    title: 'Networking & Collaboration',
    description: 'Building a network of partners and promoting multi-faceted cooperation.',
    image: '/images/about/activities/networking-collaboration.png',
  },
  {
    title: 'Research & Development',
    description: 'Applying technology and innovation to solve social problems.',
    image: '/images/about/activities/research-development.png',
  },
  {
    title: 'Communication & Dissemination',
    description: 'Sharing positive stories and spreading good values.',
    image: '/images/activity/activity5.jpeg',
  },
];

const ABOUT_CONTAINER_CLASS = 'max-w-none lg:px-[90px]';
const ABOUT_SECTION_TITLE_CLASS = 'font-heading text-[clamp(1.75rem,3vw,3rem)] font-semibold leading-tight text-black';

export function AboutPage() {
  const goToJoin = useJoinNavigation();
  const [stats, setStats] = useState<StatsGridItem[]>(DEFAULT_STATS);

  useEffect(() => {
    StrapiService.getStatItems()
      .then((data) => {
        if (data.length > 0) {
          setStats(data.map((stat) => ({ label: stat.label, value: stat.value })));
        }
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
      });
  }, []);

  return (
    <div className="relative z-10 bg-white">
      <section className="pb-0 pt-12 md:pt-16 lg:pt-[7.5rem]">
        <Container className={ABOUT_CONTAINER_CLASS}>
          <div className="grid gap-6 md:gap-8 lg:grid-cols-[260px_1fr] lg:gap-[191px]">
            <h1 className="font-heading text-[clamp(2.75rem,5vw,5rem)] font-semibold leading-[110%] tracking-[0px] text-black">
              About
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #EE334E 0%, #FCB131 33%, #00A651 67%, #0081C8 100%)',
                }}
              >
                Y.O.U
              </span>
            </h1>
            <p className="max-w-[1314px] font-normal text-[clamp(1rem,1.2vw,1.375rem)] leading-[140%] tracking-[0px] text-neutral-900 2xl:text-[24px]">
              Y.O.U (Your Opportunity – Your Future) is a non-profit organization working in the fields of education,
              community development, and international cooperation.
              <br />
              We aim to create equal opportunities for everyone to learn, develop, and contribute to society.
              <br />
              With a passionate team and a wide network of partners, Y.O.U is constantly innovating and acting for a
              sustainable future, where no one is left behind.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[28px] bg-[#DDF1FF] sm:mt-12 lg:mt-16 lg:rounded-[40px]">
            <img
              src="/images/about/banner.png"
              alt="Y.O.U global citizens campaign"
              className="aspect-[1740/628] w-full object-cover object-center"
            />
          </div>
        </Container>
      </section>

      <section className="pb-0 pt-12 md:pt-16 lg:pt-[7.5rem]">
        <Container size="narrow" className="lg:max-w-[1080px]">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_400px] lg:gap-20">
            <div>
              <h2 className={`mb-5 ${ABOUT_SECTION_TITLE_CLASS}`}>
                Open Letter
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-black md:text-base">
                <p>
                  Together We Create Sustainable Value
                  <br />
                  Y.O.U was founded on the belief that when we connect, share, and collaborate, we can create positive
                  and lasting changes for the community.
                </p>
                <p>
                  We are committed to continuously striving to build a solid foundation, where every individual and
                  organization can find opportunities for growth and together create sustainable value.
                  <br />
                  Thank you for accompanying Y.O.U on this meaningful journey.
                </p>
                <p className="pt-3 font-semibold">
                  Nguyễn Thùy Linh
                  <br />
                  <span className="font-normal italic">Founder of Y.O.U</span>
                </p>
              </div>
            </div>
            <div className="relative aspect-[702/513] w-full overflow-hidden rounded-3xl lg:h-[300px] lg:aspect-auto">
              <img
                src="/images/home/about/about-image.png"
                alt="A global alliance for youth-led impact"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                  src="/images/common/decor/group.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-auto w-[28%] max-w-[128px] object-contain opacity-20"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-0 pt-12 md:pt-16 lg:pt-[7.5rem]">
        <Container size="narrow" className="lg:max-w-[1080px]">
          <StatsGrid stats={stats} variant="about" animated />
        </Container>
      </section>

      <section className="pb-0 pt-12 text-center md:pt-16 lg:pt-[7.5rem]">
        <Container size="narrow" className="lg:max-w-[1080px]">
          <h2 className={ABOUT_SECTION_TITLE_CLASS}>
            Mission{' '}
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Y.O.U
            </span>
          </h2>
          <p className="mt-3 text-base text-neutral-700 md:text-xl">
            Connect – Share – Create opportunities – Develop sustainably
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {MISSIONS.map((mission) => (
              <article
                key={mission.title}
                className={`rounded-2xl border border-neutral-100 bg-white px-5 py-8 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ${
                  mission.active ? 'bg-[#F2F7FF]' : ''
                }`}
              >
                <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#2998FF] shadow-sm">
                  <Icon name={mission.icon} size={30} />
                </div>
                <h3 className="text-[clamp(1rem,1.1vw,1.125rem)] font-semibold text-black">{mission.title}</h3>
                <p className="mt-3 text-[clamp(0.8125rem,0.85vw,0.875rem)] leading-relaxed text-neutral-700">{mission.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-0 pt-12 text-center md:pt-16 lg:pt-[7.5rem]">
        <Container>
          <h2 className={ABOUT_SECTION_TITLE_CLASS}>
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Y.O.U
            </span>
            's activities should focus on
          </h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 xl:gap-7">
            {ACTIVITIES.map((activity) => (
              <article key={activity.title} className="flex flex-col items-center text-center">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="h-28 w-28 rounded-full object-cover md:h-32 md:w-32"
                />
                <h3 className="mt-5 text-[clamp(1rem,1.1vw,1.125rem)] font-semibold leading-tight text-black">{activity.title}</h3>
                <p className="mt-2 text-[clamp(0.8125rem,0.85vw,0.875rem)] leading-relaxed text-neutral-600">{activity.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner
        title="Ready to Make an Impact?"
        description="Join thousands of youth leaders across ASEAN who are making a difference in their communities."
        ctaLabel="Register Now"
        onCtaClick={goToJoin}
      />
    </div>
  );
}
