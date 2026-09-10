import { Button } from 'antd';
import { useJoinModal } from '@/components/modals/JoinModal';
import { Container } from '@/components/ui/Container';

const ORG_BENEFITS = [
  'Official Y.O.U membership status & certification',
  'Access to global partnership network',
  'Joint project opportunities',
  'Invitation to Annual Summit & events',
];

const INDIVIDUAL_ROLES = [
  {
    title: 'Continent Director',
    jdUrl: 'https://docs.google.com/document/d/1pyn77tCjnGVH7xVnMfh6VxrdT3S3dU0YSRqUPGjN-fo/edit?usp=sharing',
  },
  {
    title: 'Sub-Representative',
    jdUrl: '#',
  },
  {
    title: 'General Member',
    jdUrl: '#',
  },
  {
    title: 'Marketing & Communication Member',
    jdUrl: '#',
  },
  {
    title: 'Secretary & Assistant',
    jdUrl: '#',
  },
];

export function JoinSection() {
  const { openOrganization, openIndividual } = useJoinModal();

  return (
    <section id="join-section" className="bg-[#F2F7FF] py-12 md:py-16 lg:py-[7.5rem]">
      <Container className="max-w-[95%] sm:max-w-[85%]">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-[60px]">
          <h2 className="font-semibold text-[clamp(2rem,3.13vw,3rem)] leading-tight mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Join the{' '}
            <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
              Movement
            </span>
          </h2>
          <p className="text-neutral-600 text-[clamp(1rem,1.30vw,1.25rem)] font-normal" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Two pathways to become part of the Youth Organization Union.
          </p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-[40px] max-w-[1338px] mx-auto">
          {/* For Organizations */}
          <div className="w-full min-h-0 lg:min-h-[560px] bg-white rounded-3xl lg:rounded-[40px] p-6 sm:p-8 lg:p-[40px] flex flex-col">
            <span className="inline-block bg-[#FEF2F2] text-[#EE334E] text-[clamp(0.875rem,1.04vw,1rem)] font-semibold rounded-[12px] mb-5 w-fit" style={{ fontFamily: 'Open Sans, sans-serif', padding: '8px 16px' }}>
              For Organizations
            </span>
            <h3 className="font-semibold text-[clamp(1.5rem,1.82vw,1.75rem)] text-[#111111] my-[16px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Join as Organizational Member
            </h3>
            <p className="text-neutral-600 text-[clamp(1rem,1.30vw,1.25rem)] font-normal leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Register your youth-led organization as an official Y.O.U membership and gain access to a global network, joint programs, and shared resources.
            </p>

            <ul className="space-y-3 mb-8 flex-1">
              {ORG_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-[clamp(1rem,1.30vw,1.25rem)] font-medium text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  <img src="/images/common/decor/group.svg" alt="" className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Button danger type="primary" shape="round" block className="!h-auto !font-semibold !text-[clamp(1rem,1.30vw,1.25rem)] !transition-all hover:!opacity-90 active:!scale-[0.98]" style={{ padding: '16px 24px', fontFamily: 'Open Sans, sans-serif' }} onClick={openOrganization}>
              Apply now
            </Button>
          </div>

          {/* For Individuals */}
          <div className="w-full min-h-0 lg:min-h-[560px] bg-white rounded-3xl lg:rounded-[40px] p-6 sm:p-8 lg:p-[40px] flex flex-col">
            <span className="inline-block bg-[#D4EDFF] text-[#2980B9] text-[clamp(0.875rem,1.04vw,1rem)] font-semibold rounded-[12px] mb-5 w-fit" style={{ fontFamily: 'Open Sans, sans-serif', padding: '8px 16px' }}>
              For Individuals
            </span>
            <h3 className="font-semibold text-[clamp(1.5rem,1.82vw,1.75rem)] text-[#111111] my-[16px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Join as Individual Member
            </h3>
            <p className="text-neutral-600 text-[clamp(1rem,1.30vw,1.25rem)] font-normal leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Become an official individual member of the Union and take an active role in fostering unity, building strategic partnerships, and advancing the Union’s mission.
            </p>

            <ul className="space-y-3 mb-8 flex-1">
              {INDIVIDUAL_ROLES.map((role) => (
                <li key={role.title} className="flex items-center gap-3 text-[clamp(1rem,1.30vw,1.25rem)] font-medium text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  <img src="/images/common/decor/group.svg" alt="" className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{role.title}</span>
                    <a
                      href={role.jdUrl}
                      target={role.jdUrl !== '#' ? '_blank' : undefined}
                      rel={role.jdUrl !== '#' ? 'noopener noreferrer' : undefined}
                      className="text-sm font-semibold text-[#005D9A] hover:underline"
                      onClick={(e) => {
                        if (role.jdUrl === '#') {
                          e.preventDefault();
                        }
                      }}
                    >
                      [Link JD]
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <Button type="primary" shape="round" block className="!h-auto !font-semibold !text-[clamp(1rem,1.30vw,1.25rem)] !bg-[#005D9A] !border-[#005D9A] !transition-all hover:!opacity-90 active:!scale-[0.98]" style={{ padding: '16px 24px', fontFamily: 'Open Sans, sans-serif' }} onClick={openIndividual}>
              Apply now
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
