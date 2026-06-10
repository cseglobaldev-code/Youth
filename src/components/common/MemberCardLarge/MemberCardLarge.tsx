import { Image } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { SDGTag } from '@/components/ui/SDGTag';
import { cn } from '@/lib/utils';

export interface MemberCardLargeProps {
  member: {
    name: string;
    country: string;
    period?: string;
    leader?: string;
    focusSdgs: number[];
    coverUrl?: string;
    logoUrl: string;
  };
  onClick?: () => void;
  className?: string;
}

export function MemberCardLarge({
  member,
  onClick,
  className,
}: MemberCardLargeProps) {
  const {
    name,
    country,
    period = '2020 → nay',
    leader = 'TBD',
    focusSdgs,
    coverUrl = '',
    logoUrl = '',
  } = member;

  return (
    <div
      className={cn(
        'w-full bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col cursor-pointer transition-shadow duration-200 hover:shadow-xl',
        className
      )}
      onClick={onClick}
    >
      {/* Cover */}
      <div className="relative w-full aspect-[426.67/214.68] flex-shrink-0">
        <Image
          src={coverUrl}
          alt={name}
          preview={false}
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          wrapperStyle={{ width: '100%', height: '100%' }}
        />
        {/* Logo circle */}
        <div className="absolute bottom-[-28px] sm:bottom-[-34px] lg:bottom-[-40px] left-3 sm:left-4 w-14 h-14 sm:w-[68px] sm:h-[68px] lg:w-[80px] lg:h-[80px] rounded-full border-[3px] lg:border-4 border-white overflow-hidden bg-white shadow">
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            preview={false}
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            wrapperStyle={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-8 sm:pt-9 lg:pt-10 px-3 sm:px-4 pb-3 sm:pb-4 flex flex-col">
        <h3
          className="font-semibold text-base sm:text-xl lg:text-[24px] text-[#111111] line-clamp-1"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          {name}
        </h3>

        <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-1.5">
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 lg:gap-4 text-xs sm:text-base lg:text-[18px] font-medium text-neutral-600"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <span className="flex items-center gap-1 min-w-0">
              <Icon name="mynaui:map-pin" size={18} />
              <span className="truncate">{country}</span>
            </span>
            <span className="flex items-center gap-1 min-w-0">
              <Icon name="iconoir:clock" size={18} />
              <span className="truncate">{period}</span>
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-xs sm:text-base lg:text-[18px] font-medium text-neutral-600 min-w-0"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <Icon name="solar:user-linear" size={18} />
            <span className="truncate">{leader}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto pt-3">
          {focusSdgs.map((sdgId) => (
            <SDGTag
              key={sdgId}
              sdgId={sdgId}
              variant="solid"
              size="md"
              className="!rounded-[6px] max-sm:!text-[10px] max-sm:!px-1.5 max-sm:!py-0.5"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
