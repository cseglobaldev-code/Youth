import { Image } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

export interface MemberCardLargeProps {
  name: string;
  country: string;
  period: string;
  leader: string;
  tags: string[];
  coverUrl: string;
  logoUrl: string;
  onClick?: () => void;
  className?: string;
}

export function MemberCardLarge({
  name,
  country,
  period,
  leader,
  tags,
  coverUrl,
  logoUrl,
  onClick,
  className,
}: MemberCardLargeProps) {
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
        <div className="absolute bottom-[-40px] left-4 w-[80px] h-[80px] rounded-full border-4 border-white overflow-hidden bg-white shadow">
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
      <div className="flex-1 pt-10 px-4 pb-4 flex flex-col">
        <h3
          className="font-semibold text-[24px] text-[#111111]"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          {name}
        </h3>

        <div className="mt-3 space-y-1.5">
          <div
            className="flex items-center gap-4 text-[18px] font-medium text-neutral-600"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <span className="flex items-center gap-1">
              <Icon name="mynaui:map-pin" size={18} />
              {country}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="iconoir:clock" size={18} />
              {period}
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-[18px] font-medium text-neutral-600"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <Icon name="solar:user-linear" size={18} />
            {leader}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto pt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#E3F2FD] text-[#111111] text-[18px] font-medium rounded"
              style={{ fontFamily: 'Open Sans, sans-serif', padding: '6px 12px' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
