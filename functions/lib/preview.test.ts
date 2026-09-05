import { describe, expect, it } from 'vitest';
import { onRequest } from '../api/preview';
import { isAllowedPreviewPath, isPreviewStatus, sameSecret } from './preview';

describe('preview helpers', () => {
  it('allows configured frontend preview paths only', () => {
    expect(isAllowedPreviewPath('/')).toBe(true);
    expect(isAllowedPreviewPath('/about-us')).toBe(true);
    expect(isAllowedPreviewPath('/leadership')).toBe(true);
    expect(isAllowedPreviewPath('/members')).toBe(true);
    expect(isAllowedPreviewPath('/projects')).toBe(true);
    expect(isAllowedPreviewPath('/policy-documents')).toBe(true);
    expect(isAllowedPreviewPath('/contact')).toBe(true);
    expect(isAllowedPreviewPath('/projects/project-1')).toBe(true);
    expect(isAllowedPreviewPath('/members/member-1')).toBe(true);
    expect(isAllowedPreviewPath('/pages/page-1')).toBe(true);
    expect(isAllowedPreviewPath('https://evil.example/steal')).toBe(false);
    expect(isAllowedPreviewPath('//evil.example')).toBe(false);
    expect(isAllowedPreviewPath('/api/cms/projects/project-1')).toBe(false);
    expect(isAllowedPreviewPath('/projects/project-1/extra')).toBe(false);
    expect(isAllowedPreviewPath('/leadership/extra')).toBe(false);
  });

  it('accepts only Strapi publication statuses', () => {
    expect(isPreviewStatus('draft')).toBe(true);
    expect(isPreviewStatus('published')).toBe(true);
    expect(isPreviewStatus('delete-all')).toBe(false);
    expect(isPreviewStatus(null)).toBe(false);
  });

  it('compares preview secrets without exposing the configured value', async () => {
    await expect(sameSecret('preview-secret', 'preview-secret')).resolves.toBe(true);
    await expect(sameSecret('wrong', 'preview-secret')).resolves.toBe(false);
  });

  it('rejects invalid preview statuses', async () => {
    const response = await onRequest({
      request: new Request(
        'https://you.example/api/preview?url=%2Fprojects%2Fp1&secret=preview-secret&status=delete-all'
      ),
      env: { PREVIEW_SECRET: 'preview-secret' },
    });
    expect(response.status).toBe(400);
  });

  it('rejects invalid secrets and open redirects', async () => {
    const invalidSecret = await onRequest({
      request: new Request('https://you.example/api/preview?url=/projects/p1&secret=wrong'),
      env: { PREVIEW_SECRET: 'preview-secret' },
    });
    expect(invalidSecret.status).toBe(401);

    const openRedirect = await onRequest({
      request: new Request(
        'https://you.example/api/preview?url=https%3A%2F%2Fevil.example&secret=preview-secret'
      ),
      env: { PREVIEW_SECRET: 'preview-secret' },
    });
    expect(openRedirect.status).toBe(400);
  });
});