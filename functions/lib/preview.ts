const STATIC_PREVIEW_PATHS = new Set(['/', '/leadership', '/policy-documents']);
const DETAIL_PREVIEW_PATH = /^\/(projects|members)\/[A-Za-z0-9_-]+$/;

export function isAllowedPreviewPath(pathname: string): boolean {
  return STATIC_PREVIEW_PATHS.has(pathname) || DETAIL_PREVIEW_PATH.test(pathname);
}

export function isPreviewStatus(status: string | null): status is 'draft' | 'published' {
  return status === 'draft' || status === 'published';
}

export async function sameSecret(candidate: string, expected: string): Promise<boolean> {
  const candidateBytes = new TextEncoder().encode(candidate);
  const expectedBytes = new TextEncoder().encode(expected);
  const length = Math.max(candidateBytes.length, expectedBytes.length);
  let difference = candidateBytes.length ^ expectedBytes.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (candidateBytes[index] ?? 0) ^ (expectedBytes[index] ?? 0);
  }

  return difference === 0;
}
