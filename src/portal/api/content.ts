const getBaseUrl = (): string => {
  return (
    import.meta.env.VITE_STRAPI_API_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  ).replace(/\/$/, '');
};

interface FetchOptions {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
  searchField?: string;
  filters?: Record<string, any>;
  populate?: string | string[] | Record<string, any>;
  status?: 'draft' | 'published';
}

export async function fetchCollection<T = any>(
  endpoint: string,
  options: FetchOptions = {},
  token?: string | null
): Promise<{ data: T[]; meta: { pagination: { total: number; page: number; pageSize: number } } }> {
  const query = new URLSearchParams();

  query.append('pagination[page]', String(options.page || 1));
  query.append('pagination[pageSize]', String(options.pageSize || 10));

  if (options.sort) {
    query.append('sort[0]', options.sort);
  } else {
    query.append('sort[0]', 'createdAt:desc');
  }

  if (options.search && options.searchField) {
    query.append(`filters[${options.searchField}][$containsi]`, options.search);
  }

  if (options.status) {
    query.append('status', options.status);
  }

  if (options.populate) {
    if (typeof options.populate === 'string') {
      query.append('populate', options.populate);
    } else if (Array.isArray(options.populate)) {
      options.populate.forEach((field, i) => query.append(`populate[${i}]`, field));
    }
  } else {
    query.append('populate', '*');
  }

  // 👈 Use token parameter or fallback to localStorage
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('you_portal_jwt') : null);

  const res = await fetch(`${getBaseUrl()}/api/${endpoint}?${query.toString()}`, {
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load ${endpoint} (${res.status})`);
  }

  return (await res.json()) as { data: T[]; meta: { pagination: { total: number; page: number; pageSize: number } } };
}
export async function createEntry<T = any>(
  endpoint: string,
  data: Record<string, any>,
  token?: string | null
): Promise<T> {
  const res = await fetch(`${getBaseUrl()}/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const errorJson: any = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Failed to create entry in ${endpoint}`);
  }

  const json: any = await res.json();
  return json.data as T;
}

export async function updateEntry<T = any>(
  endpoint: string,
  id: string | number,
  data: Record<string, any>,
  token?: string | null
): Promise<T> {
  const authToken =
    token || (typeof window !== 'undefined' ? localStorage.getItem('you_portal_jwt') : null);

  const res = await fetch(`${getBaseUrl()}/api/${endpoint}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const errorJson: any = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Failed to update entry in ${endpoint}`);
  }

  const json: any = await res.json();
  return json.data as T;
}

export async function deleteEntry(
  endpoint: string,
  id: string | number,
  token?: string | null
): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/${endpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const errorJson: any = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Failed to delete entry in ${endpoint}`);
  }
}

export async function uploadMediaFile(
  file: File,
  token?: string | null
): Promise<{ id: number; url: string }> {
  const formData = new FormData();
  formData.append('files', file);

  const res = await fetch(`${getBaseUrl()}/api/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`);
  }

  const data: any = await res.json();
  const item = Array.isArray(data) ? data[0] : data;
  return { id: item.id, url: item.url };
}

export async function fetchSingleType<T = any>(
  endpoint: string,
  options: { populate?: any; locale?: string; status?: 'draft' | 'published' } = {},
  token?: string | null
): Promise<T | null> {
  const query = new URLSearchParams();
  if (options.locale) query.append('locale', options.locale);
  if (options.status) query.append('status', options.status);

  //  Only request contentBlocks on pages that have dynamic zones
  if (endpoint === 'home-page' || endpoint === 'about-us' || endpoint === 'pages') {
    query.append('populate[seo][populate]', '*');
    query.append('populate[contentBlocks][populate]', '*');
    query.append(
      'populate[contentBlocks][on][sections.featured-projects][populate][projects][populate]',
      '*'
    );
    query.append(
      'populate[contentBlocks][on][sections.featured-members][populate][members][populate]',
      '*'
    );
    query.append(
      'populate[contentBlocks][on][sections.team-grid][populate][teamMembers][populate]',
      '*'
    );
  } else {
    // For global-setting, use wildcard populate
    query.append('populate', '*');
  }

  const res = await fetch(`${getBaseUrl()}/api/${endpoint}?${query.toString()}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to load ${endpoint} (${res.status})`);
  }

  const json: any = await res.json();
  return json.data as T;
}

export async function updateSingleType<T = any>(
  endpoint: string,
  data: Record<string, any>,
  token?: string | null
): Promise<T> {
  const res = await fetch(`${getBaseUrl()}/api/${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const errorJson: any = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Failed to update ${endpoint}`);
  }

  const json: any = await res.json();
  return json.data as T;
}

export async function publishEntry(
  endpoint: string,
  idOrDocumentId: string | number,
  token?: string | null
): Promise<void> {
  await updateEntry(endpoint, idOrDocumentId, { publishedAt: new Date().toISOString() }, token);
}

export async function fetchMediaFiles(
  options: { search?: string } = {},
  token?: string | null
): Promise<any[]> {
  const query = new URLSearchParams();
  query.append('sort', 'createdAt:desc');
  query.append('pageSize', '100');

  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('you_portal_jwt') : null);

  const res = await fetch(`${getBaseUrl()}/api/upload/files?${query.toString()}`, {
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load media assets (${res.status})`);
  }

  const data: any = await res.json();
  const files: any[] = Array.isArray(data) ? data : data.results || [];

  if (options.search) {
    const q = options.search.toLowerCase();
    return files.filter(
      (f: any) =>
        f.name?.toLowerCase().includes(q) ||
        f.alternativeText?.toLowerCase().includes(q)
    );
  }

  return files;
}

export async function deleteMediaFile(
  id: number | string,
  token?: string | null
): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/upload/files/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete media asset (${res.status})`);
  }
}

export async function fetchStaffUsers(token?: string | null): Promise<any[]> {
  const res = await fetch(`${getBaseUrl()}/api/users?populate=role`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load users (${res.status})`);
  }

  return (await res.json()) as any[];
}

export async function createStaffUser(
  userData: Record<string, any>,
  token?: string | null
): Promise<any> {
  const res = await fetch(`${getBaseUrl()}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorJson: any = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || 'Failed to create user');
  }

  return (await res.json()) as any;
}

export async function fetchRoles(token?: string | null): Promise<any[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/users-permissions/roles`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (res.ok) {
      const data: any = await res.json(); 
      return Array.isArray(data?.roles) ? data.roles : Array.isArray(data) ? data : [];
    }
  } catch {
    // Fallback to standard Y.O.U role presets
  }

  return [
    { id: 1, name: 'Super Admin', type: 'admin', description: 'Full access to all portal settings, staff users, and content.' },
    { id: 2, name: 'Content Editor', type: 'editor', description: 'Can create, edit, and publish Projects, Members, News, and FAQs.' },
    { id: 3, name: 'HR / Reviewer', type: 'reviewer', description: 'Review leadership candidates, organization applications, and support letters.' },
    { id: 4, name: 'Viewer / Auditor', type: 'viewer', description: 'Read-only access to view metrics and tables without edit/delete rights.' },
  ];
}

export async function updateStaffUser(
  id: number | string,
  data: Record<string, any>,
  token?: string | null
): Promise<any> {
  const res = await fetch(`${getBaseUrl()}/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson: any = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || 'Failed to update user');
  }

  return (await res.json()) as any;
}

export async function deleteStaffUser(
  id: number | string,
  token?: string | null
): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete user (${res.status})`);
  }
}