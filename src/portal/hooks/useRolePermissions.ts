import { usePortalAuth } from '../context/PortalAuthContext';

export type RoleType = 'admin' | 'editor' | 'reviewer' | 'viewer';

export interface RolePermissions {
  roleType: RoleType;
  roleName: string;
  isAdmin: boolean;
  isEditor: boolean;
  isReviewer: boolean;
  isViewer: boolean;
  canManageContent: boolean;
  canManagePageBuilder: boolean;
  canManageAts: boolean;
  canManageSettings: boolean;
  canUploadMedia: boolean;
  isReadOnly: boolean;
}

export function useRolePermissions(): RolePermissions {
  const { user } = usePortalAuth();
  const rawType = (user?.role?.type || '').toLowerCase();
  const rawName = (user?.role?.name || '').toLowerCase();

  let roleType: RoleType = 'editor';

  if (rawType === 'admin' || rawName.includes('admin') || rawName.includes('super')) {
    roleType = 'admin';
  } else if (rawType === 'viewer' || rawName.includes('viewer') || rawName.includes('audit')) {
    //  ONLY locked down if explicitly assigned Viewer / Auditor
    roleType = 'viewer';
  } else if (rawType === 'reviewer' || rawName.includes('hr') || rawName.includes('reviewer')) {
    roleType = 'reviewer';
  } else {
    //  Authenticated / Staff Member accounts have active Content & Media Editing rights
    roleType = 'editor';
  }

  const isAdmin = roleType === 'admin';
  const isEditor = roleType === 'editor';
  const isReviewer = roleType === 'reviewer';
  const isViewer = roleType === 'viewer';

  // Format display name nicely
  let displayRoleName = user?.role?.name || 'Staff Member';
  if (displayRoleName.toLowerCase() === 'authenticated') {
    displayRoleName = 'Staff Member';
  }

  return {
    roleType,
    roleName: displayRoleName,
    isAdmin,
    isEditor,
    isReviewer,
    isViewer,
    canManageContent: (isAdmin || isEditor) && !isViewer,
    canManagePageBuilder: (isAdmin || isEditor) && !isViewer,
    canManageAts: (isAdmin || isReviewer) && !isViewer,
    canManageSettings: isAdmin,
    canUploadMedia: (isAdmin || isEditor) && !isViewer,
    isReadOnly: isViewer,
  };
}