import { expect, it } from 'vitest';
import { INDIVIDUAL_HERO_ROLES, RECRUITING_POSITIONS, requiresIndividualAssessment } from './individualRoles';

it('shows only the three requested Hero highlights', () => {
  expect(INDIVIDUAL_HERO_ROLES.map(role => role.title)).toEqual([
    'Continental Director', 'Deputy Continental Director', 'General Members',
  ]);
});

it('keeps recruitment separate from Hero highlights and preserves legacy assessment requirements', () => {
  expect(RECRUITING_POSITIONS.map(role => role.value)).toEqual([
    'Continental Director', 'Marketing & Communication Member', 'Secretary & Assistant',
  ]);
  expect(requiresIndividualAssessment('Continental Director')).toBe(true);
  expect(requiresIndividualAssessment()).toBe(true);
  expect(requiresIndividualAssessment('General Member')).toBe(true);
  expect(requiresIndividualAssessment('Marketing & Communication Member')).toBe(false);
  expect(requiresIndividualAssessment('Secretary & Assistant')).toBe(false);
});
