import type { SocialLink } from './common';

export interface GlobalSetting {
  address?: string;
  email?: string;
  hotline?: string;
  operatingTime?: string;
  socialLinks?: SocialLink[];
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  transferSyntaxNote?: string;
  qrCodeImageUrl?: string;
}