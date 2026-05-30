/**
 * Semantic icon mapping — single source of truth for all icons used in the app.
 * Uses @iconify/react format: 'collection:icon-name'
 */
export const ICONS = {
  // Navigation
  menu: 'lucide:menu',
  close: 'lucide:x',
  chevronRight: 'lucide:chevron-right',
  chevronLeft: 'lucide:chevron-left',
  chevronDown: 'lucide:chevron-down',
  arrowRight: 'lucide:arrow-right',
  arrowLeft: 'lucide:arrow-left',
  externalLink: 'lucide:external-link',

  // Actions
  download: 'lucide:download',
  search: 'lucide:search',
  filter: 'lucide:filter',
  share: 'lucide:share-2',

  // File types
  pdf: 'hugeicons:pdf-01',
  xls: 'hugeicons:xls-01',
  doc: 'hugeicons:doc-01',
  ppt: 'hugeicons:ppt-01',

  // Social
  youtube: 'jam:youtube',
  facebook: 'jam:facebook',
  twitter: 'jam:twitter',
  instagram: 'jam:instagram',
  linkedin: 'jam:linkedin',

  // Misc
  globe: 'lucide:globe',
  users: 'lucide:users',
  target: 'lucide:target',
  heart: 'lucide:heart',
  star: 'lucide:star',
  calendar: 'lucide:calendar',
  mapPin: 'lucide:map-pin',
  mail: 'lucide:mail',
  phone: 'lucide:phone',
  plus: 'lucide:plus',
  minus: 'lucide:minus',
  check: 'lucide:check',
  info: 'lucide:info',
  image: 'lucide:image',
  play: 'lucide:play',
  home: 'lucide:home',
} as const;

export type IconName = keyof typeof ICONS;
