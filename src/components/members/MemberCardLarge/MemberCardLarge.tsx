import { Icon } from '@/components/ui/Icon';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
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
    period = '2020 → present',
    leader = 'TBD',
    focusSdgs,
    coverUrl = '',
    logoUrl = '',
  } = member;

  return (
    <div
      className={cn(
        'group w-full h-full bg-white rounded-[16px] overflow-visible shadow-sm flex flex-col cursor-pointer transition-shadow duration-200 hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-full h-[200px] flex-shrink-0 bg-gray-100 overflow-hidden rounded-t-[16px]">
          <ImageWithFallback src={coverUrl} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="absolute bottom-[-32px] left-4 w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg flex-shrink-0">
          <ImageWithFallback src={logoUrl} alt={`${name} logo`} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex-1 px-5 pt-12 pb-5 flex flex-col gap-3">
        <h3
          className="font-bold text-[18px] text-[#111111] line-clamp-2 leading-tight transition-colors duration-200 group-hover:text-[#EE334E]"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          {name}
        </h3>

        <div className="space-y-2 text-[13px] text-[#666666]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          <div className="flex items-center gap-2">
            <Icon name="mynaui:map-pin" size={16} className="flex-shrink-0" />
            <span className="truncate">{country}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="iconoir:clock" size={16} className="flex-shrink-0" />
            <span className="truncate">{period}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="solar:user-linear" size={16} className="flex-shrink-0" />
            <span className="truncate">{leader}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 mt-auto">
          {focusSdgs.slice(0, 3).map((sdgId) => (
            <SDGTag
              key={sdgId}
              sdgId={sdgId}
              variant="solid"
              size="sm"
              className="!rounded-full !text-[11px] !px-3 !py-1"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}