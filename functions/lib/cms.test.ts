import { describe, expect, it } from 'vitest';
import { draftStatus, isAllowedCmsPath } from './cms';

describe('CMS proxy helpers', () => {
  it('allows read-only content and upload paths', () => {
    expect(isAllowedCmsPath('/api/projects')).toBe(true);
    expect(isAllowedCmsPath('/api/projects/project-1')).toBe(true);
    expect(isAllowedCmsPath('/api/members')).toBe(true);
    expect(isAllowedCmsPath('/api/inquiries')).toBe(false);
    expect(isAllowedCmsPath('/admin/init')).toBe(false);
  });

  it('enables draft status only for the draft preview cookie', () => {
    expect(draftStatus('you_preview=draft')).toBe('draft');
    expect(draftStatus('you_preview=published')).toBe('published');
    expect(draftStatus('other=value')).toBe('published');
  });
});
