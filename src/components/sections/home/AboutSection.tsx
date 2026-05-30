import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ROUTES } from '@/routes/paths';

const ABOUT_ITEMS = [
  { id: 'vision', title: 'Our Vision', color: '#E42C27', expanded: true },
  { id: 'mission', title: 'Our Mission', color: '#FBAB1A', expanded: false },
  { id: 'approach', title: 'Our Approach', color: '#10984F', expanded: false },
  { id: 'why', title: 'Why join us', color: '#1771B9', expanded: false },
];

export function AboutSection() {
  return (
    <>
      {/* Part 1: SDG Goals + CTA + Stats — white background */}
      <section className="py-16 lg:py-20 bg-white">
        <Container>
          {/* SDG Goals logo */}
          <div className="flex flex-col items-center text-center gap-6 mb-12">
            <img
              src="/sdg-goals-logo.png"
              alt="UN Sustainable Development Goals"
              className="h-[87px] w-auto object-contain"
            />
            <Button as="router-link" to={ROUTES.MEMBERS} variant="primary" size="md" className="bg-[#EE334E] hover:bg-[#d42a43]">
              Join 1,500+ Youth Leaders
            </Button>
          </div>

          {/* Stats row */}
          <div className="bg-[#E8F1FF] rounded-2xl px-10 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
              {[
                { label: 'Member Organizations', value: '+50' },
                { label: 'Continents', value: '+6' },
                { label: 'Countries', value: '+30' },
                { label: 'Volunteers from Global', value: '+1 500' },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center text-center py-4 ${
                    i < arr.length - 1 ? 'lg:border-r border-neutral-300' : ''
                  }`}
                >
                  <span className="text-neutral-600 text-sm mb-2">{stat.label}</span>
                  <span className="font-heading font-bold text-4xl lg:text-5xl text-neutral-900">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Part 2: About Vision — white background */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl italic">
              <span className="text-neutral-900">A Global Alliance for </span>
              <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
                Youth-Led Impact
              </span>
            </h2>
          </div>

          {/* Content: accordion left + image right */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: list items */}
            <div className="flex-1 max-w-[602px]">
              <div className="space-y-0">
                {ABOUT_ITEMS.map((item, i) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-5 py-5">
                      {/* Circle icon with Group.png */}
                      <div
                        className="w-[48px] h-[48px] rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      >
                        <img src="/Group.png" alt="" className="w-6 h-6 object-contain brightness-0 invert" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 text-lg">
                          {item.title}
                        </h4>
                        {item.expanded && (
                          <button className="mt-2 flex items-center gap-1 text-[#EE334E] text-sm font-medium hover:underline">
                            See more
                            <Icon name="lucide:arrow-right" size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    {i < ABOUT_ITEMS.length - 1 && (
                      <hr className="border-dashed border-neutral-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: image */}
            <div className="flex-shrink-0 w-full lg:w-[702px]">
              <div className="rounded-2xl overflow-hidden aspect-[702/513]">
                <img
                  src="/about-image.png"
                  alt="Youth leaders"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
