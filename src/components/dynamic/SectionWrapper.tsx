import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import type { SectionStyle } from '@/types';

interface SectionWrapperProps {
  style?: SectionStyle;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const BG_MAP: Record<string, string> = {
  white: 'bg-white text-neutral-900',
  'light-blue': 'bg-[#F2F7FF] text-neutral-900',
  'dark-navy': 'bg-[#0B1A2B] text-white',
  'rainbow-soft': 'bg-gradient-to-r from-[#EE334E]/10 via-[#FCB131]/10 to-[#00A651]/10 text-neutral-900',
  transparent: 'bg-transparent text-neutral-900',
};

const PT_MAP: Record<string, string> = {
  none: 'pt-0',
  compact: 'pt-6 md:pt-8',
  normal: 'pt-10 md:pt-16 lg:pt-20',
  spacious: 'pt-16 md:pt-24 lg:pt-32',
};

const PB_MAP: Record<string, string> = {
  none: 'pb-0',
  compact: 'pb-6 md:pb-8',
  normal: 'pb-10 md:pb-16 lg:pb-20',
  spacious: 'pb-16 md:pb-24 lg:pb-32',
};

const ALIGN_MAP: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function SectionWrapper({ style, children, className, id }: SectionWrapperProps) {
  const bgClass = BG_MAP[style?.background || 'white'] || BG_MAP.white;
  const ptClass = PT_MAP[style?.paddingTop || 'normal'] || PT_MAP.normal;
  const pbClass = PB_MAP[style?.paddingBottom || 'normal'] || PB_MAP.normal;
  const alignClass = ALIGN_MAP[style?.textAlign || 'left'] || ALIGN_MAP.left;
  const containerWidth = style?.containerWidth || 'default';

  return (
    <section id={id} className={cn('relative w-full overflow-hidden transition-colors', bgClass, ptClass, pbClass, alignClass, className)}>
      {containerWidth === 'full' ? (
        <div className="w-full px-4 sm:px-6 lg:px-8">{children}</div>
      ) : (
        <Container size={containerWidth}>{children}</Container>
      )}
    </section>
  );
}