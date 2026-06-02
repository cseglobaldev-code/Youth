import { tokens } from '@/config/theme/tokens';

export function getSdgColor(sdgId: number): string {
  const colors = tokens.colors.sdg;
  return colors[sdgId as keyof typeof colors] ?? '#64748B';
}
