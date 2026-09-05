import { describe, expect, it } from 'vitest';
import { draftStatus, isAllowedCmsPath } from './cms';

describe('CMS proxy helpers', () => {
  it('allows read-only content and upload/form paths', () => {
    expect(isAllowedCmsPath('/api/projects')).toBe(true);
    expect(isAllowedCmsPath('/api/projects/project-1')).toBe(true);
    expect(isAllowedCmsPath('/api/members')).toBe(true);
    expect(isAllowedCmsPath('/api/pages')).toBe(true);
    expect(isAllowedCmsPath('/api/pages/page-1')).toBe(true);
    expect(isAllowedCmsPath('/api/about-us')).toBe(true);
    expect(isAllowedCmsPath('/api/global-setting')).toBe(true);
    expect(isAllowedCmsPath('/api/inquiries')).toBe(true);
    expect(isAllowedCmsPath('/api/leadership-applications')).toBe(true);
    expect(isAllowedCmsPath('/api/organization-applications')).toBe(true);
    expect(isAllowedCmsPath('/api/support-submissions')).toBe(true);
    expect(isAllowedCmsPath('/api/upload')).toBe(true);
    expect(isAllowedCmsPath('/admin/init')).toBe(false);
  });

  it('rejects path traversal attempts', () => {
    expect(isAllowedCmsPath('/api/projects/../users')).toBe(false);
    expect(isAllowedCmsPath('/api/projects/%2e%2e/users')).toBe(false);
    expect(isAllowedCmsPath('/api/projects/%ZZ')).toBe(false);
  });

  it('enables draft status only for the draft preview cookie', () => {
    expect(draftStatus('you_preview=draft')).toBe('draft');
    expect(draftStatus('you_preview=published')).toBe('published');
    expect(draftStatus('other=value')).toBe('published');
  });
});