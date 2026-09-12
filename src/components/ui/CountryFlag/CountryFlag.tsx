import { useState } from 'react';
import { countryIsoCode, countryFlagEmoji } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface CountryFlagProps {
  country: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CountryFlag({ country, className, size = 'md' }: CountryFlagProps) {
  const [hasError, setHasError] = useState(false);
  const code = countryIsoCode(country)?.toLowerCase();

  if (!code || hasError) {
    const emoji = countryFlagEmoji(country);
    return emoji ? <span className={className}>{emoji}</span> : null;
  }

  const sizeClasses = {
    sm: 'h-[12px] w-[16px]',
    md: 'h-[14px] w-[20px]',
    lg: 'h-[18px] w-[26px]',
  };

  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={`${country} flag`}
      className={cn(
        'inline-block object-cover rounded-[2px] shadow-[0_0_1px_rgba(0,0,0,0.5)] align-middle -mt-0.5',
        sizeClasses[size],
        className
      )}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}
