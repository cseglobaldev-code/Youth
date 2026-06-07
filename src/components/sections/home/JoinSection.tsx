import { useState } from 'react';
import { Button } from 'antd';
import { RegisterOrganizationModal } from '@/components/common/RegisterOrganizationModal';
import { ApplyRoleModal } from '@/components/common/ApplyRoleModal';

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
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  return (
    <section id="join-section" className="bg-[#F2F7FF] py-[120px] px-[288px]">
      {/* Header */}
      <div className="text-center mb-[60px]">
        <h2 className="font-semibold text-[48px] leading-tight mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Join the{' '}
          <span className="bg-gradient-to-r from-[#E42C27] via-[#FBAB1A] to-[#10984F] bg-clip-text text-transparent">
            Movement
          </span>
        </h2>
        <p className="text-neutral-600 text-[20px] font-normal" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Two pathways to become part of the Youth Organization Union.
        </p>
      </div>

      {/* Two cards */}
      <div className="flex justify-center gap-[40px]">
        {/* For Organizations */}
        <div className="w-[649px] min-h-[560px] bg-white rounded-[40px] p-[40px] flex flex-col">
          <span className="inline-block bg-[#FEF2F2] text-[#EE334E] text-[16px] font-semibold rounded-[12px] mb-5 w-fit" style={{ fontFamily: 'Open Sans, sans-serif', padding: '8px 16px' }}>
            For Organizations
          </span>
          <h3 className="font-semibold text-[28px] text-[#111111] my-[16px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Organization Membership
          </h3>
          <p className="text-neutral-600 text-[20px] font-normal leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Register your youth-led organization as an official Y.O.U member and gain access to a global network, joint programs, and shared resources.
          </p>

          <ul className="space-y-3 mb-8 flex-1">
            {ORG_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-[20px] font-medium text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                <img src="/images/common/decor/group.svg" alt="" className="w-5 h-5" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>

          <Button danger type="primary" shape="round" block className="!h-auto !font-semibold !text-[20px]" style={{ padding: '16px 24px', fontFamily: 'Open Sans, sans-serif' }} onClick={() => setOrgModalOpen(true)}>
            Register Your Organization
          </Button>
        </div>

        {/* For Individuals */}
        <div className="w-[649px] min-h-[560px] bg-white rounded-[40px] p-[40px] flex flex-col">
          <span className="inline-block bg-[#FEF2F2] text-[#2980B9] text-[16px] font-semibold rounded-[12px] mb-5 w-fit" style={{ fontFamily: 'Open Sans, sans-serif', padding: '8px 16px' }}>
            For Individuals
          </span>
          <h3 className="font-semibold text-[28px] text-[#111111] my-[16px]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Leadership Roles
          </h3>
          <p className="text-neutral-600 text-[20px] font-normal leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Apply to serve as a Continental Director or Country Director and take on a formal leadership role within the alliance's global structure.
          </p>

          <ul className="space-y-3 mb-8 flex-1">
            {INDIVIDUAL_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-[20px] font-medium text-[#111111]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                <img src="/images/common/decor/group.svg" alt="" className="w-5 h-5" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>

          <Button type="primary" shape="round" block className="!h-auto !font-semibold !text-[20px] !bg-[#005D9A] !border-[#005D9A] hover:opacity-90 transition-opacity" style={{ padding: '16px 24px', fontFamily: 'Open Sans, sans-serif' }} onClick={() => setRoleModalOpen(true)}>
            Apply for a Role
          </Button>
        </div>
      </div>

      <RegisterOrganizationModal open={orgModalOpen} onClose={() => setOrgModalOpen(false)} />
      <ApplyRoleModal open={roleModalOpen} onClose={() => setRoleModalOpen(false)} />
    </section>
  );
}
