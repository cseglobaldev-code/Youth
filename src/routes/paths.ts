export const ROUTES = {
  HOME: '/',
  LEADERSHIP: '/leadership',
  MEMBERS: '/members',
  MEMBER_DETAIL: (id: string = ':memberId') => `/members/${id}`,
  PROJECTS: '/projects',
  PROJECT_DETAIL: (id: string = ':projectId') => `/projects/${id}`,
  POLICY_DOCUMENTS: '/policy-documents',
} as const;
