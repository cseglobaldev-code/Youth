import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-10', align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <span className="inline-block text-brand font-semibold text-sm uppercase tracking-wider mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-h2 md:text-h1 text-neutral-900 font-bold">{title}</h2>
      {description && (
        <p className="mt-3 text-body text-neutral-600 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}
