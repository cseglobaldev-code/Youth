import { CONTINENTAL_DIRECTORS_JD_URL } from './membershipDocuments';

// Hero highlights and open recruitment intentionally show different subsets.
const ROLES = [
  { label: 'Continental Director', heroLabel: 'Continental Director', recruiting: true, assessment: true, jdUrl: CONTINENTAL_DIRECTORS_JD_URL },
  { label: 'Deputy Continental Director', heroLabel: 'Deputy Continental Director', recruiting: false, assessment: true },
  { label: 'General Member', heroLabel: 'General Members', recruiting: false, assessment: false },
  { label: 'Marketing & Communication Member', recruiting: true, assessment: false },
  { label: 'Secretary & Assistant', recruiting: true, assessment: false },
];

export const INDIVIDUAL_HERO_ROLES = ROLES.filter(role => role.heroLabel).map(role => ({
  title: role.heroLabel!, jdUrl: role.jdUrl ?? '#',
}));
export const RECRUITING_POSITIONS = ROLES.filter(role => role.recruiting).map(role => ({
  label: role.label, value: role.label,
}));

export function requiresIndividualAssessment(position?: string): boolean {
  // Preserve the full flow for historical applications without a Position.
  return ROLES.find(role => role.recruiting && role.label === position)?.assessment ?? true;
}
