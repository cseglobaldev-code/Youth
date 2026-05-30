import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ICONS } from '@/config/icons';

const ORG_BENEFITS = [
  'Official Y.O.U member status & certification',
  'Access to global partnership network',
  'Joint project opportunities',
  'Invitation to Annual Summit & events',
];

const INDIVIDUAL_BENEFITS = [
  'Continental Director (one per continent)',
  'Country Director (one per country)',
  'Formal leadership title & credentials',
  'Access to leadership training programs',
];

export function JoinSection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/join-bg.png"
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-neutral-900/60" />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-white mb-3">
            Join <span className="text-accent">Y.O.U</span>
          </h2>
          <p className="text-white/80 text-base">
            Two pathways to become part of the Youth Organization Union.
          </p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* For Organizations */}
          <div className="bg-white rounded-2xl p-10 flex flex-col">
            <div className="mb-6">
              <span className="inline-block bg-brand text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                For Organizations
              </span>
              <h3 className="font-heading font-bold text-2xl text-neutral-900 mb-3">
                Become a Member Organization
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Register your youth-led organization as an official Y.O.U member and gain access to
                a global network, joint programs, and shared resources.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {ORG_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={ICONS.check} size={14} className="text-brand" />
                  </div>
                  <span className="text-neutral-700 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-4 bg-brand text-white font-semibold rounded-xl hover:bg-brand-dark transition-colors">
              Register Your Organization
            </button>
          </div>

          {/* For Individuals */}
          <div className="bg-white rounded-2xl p-10 flex flex-col">
            <div className="mb-6">
              <span className="inline-block bg-accent text-neutral-900 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                For Individuals
              </span>
              <h3 className="font-heading font-bold text-2xl text-neutral-900 mb-3">
                Apply for a Leadership Role
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Apply to serve as a Continental Director or Country Director and take on a formal
                leadership role within the alliance's global structure.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {INDIVIDUAL_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={ICONS.check} size={14} className="text-accent-dark" />
                  </div>
                  <span className="text-neutral-700 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-4 border-2 border-brand text-brand font-semibold rounded-xl hover:bg-brand-50 transition-colors">
              Apply for a Role
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
