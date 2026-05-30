import { cn } from '@/lib/utils';

export interface QRSupportBlockProps {
  qrUrl: string;
  title?: string;
  description?: string;
  className?: string;
}

export function QRSupportBlock({
  qrUrl,
  title = 'Support This Organization',
  description = 'Scan the QR code to make a donation',
  className,
}: QRSupportBlockProps) {
  return (
    <div className={cn('flex flex-col items-center text-center p-6 bg-neutral-50 rounded-card', className)}>
      <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 mb-4">{description}</p>
      <img src={qrUrl} alt="QR Code for donation" className="w-40 h-40 object-contain" />
    </div>
  );
}
