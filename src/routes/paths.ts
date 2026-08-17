export const ROUTES = {
  HOME: '/',
  ABOUT: '/about-us',
  LEADERSHIP: '/leadership',
  MEMBERS: '/members',
  MEMBER_DETAIL: (id: string = ':memberId') => `/members/${id}`,
  PROJECTS: '/projects',
  PROJECT_DETAIL: (id: string = ':projectId') => `/projects/${id}`,
  POLICY_DOCUMENTS: '/policy-documents',
  CONTACT: '/contact',
  PAGE_DETAIL: (slug: string = ':slug') => `/pages/${slug}`,
} as const;