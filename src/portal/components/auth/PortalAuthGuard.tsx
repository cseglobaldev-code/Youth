import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { ROUTES } from '@/routes/paths';

interface PortalAuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'editor' | 'reviewer' | 'viewer')[];
}

export function PortalAuthGuard({ children, allowedRoles }: PortalAuthGuardProps) {
  const { user, isAuthenticated, isLoading, logout } = usePortalAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        logout();
        window.location.href = ROUTES.PORTAL.LOGIN;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, logout]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <Spin size="large" description="Loading Management Portal…" />
        <button
          type="button"
          onClick={() => {
            logout();
            window.location.href = ROUTES.PORTAL.LOGIN;
          }}
          className="text-xs text-neutral-400 underline hover:text-neutral-600 cursor-pointer"
        >
          Taking too long? Return to login
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.PORTAL.LOGIN} state={{ from: location }} replace />;
  }

  // 👈 Strict Role Verification
  if (allowedRoles && allowedRoles.length > 0) {
    const rawRole = (user?.role?.type || user?.role?.name || '').toLowerCase();
    
    // Normalize role string
    let normalizedRole: 'admin' | 'editor' | 'reviewer' | 'viewer' = 'viewer';
    if (rawRole.includes('admin') || rawRole.includes('super')) {
      normalizedRole = 'admin';
    } else if (rawRole.includes('editor')) {
      normalizedRole = 'editor';
    } else if (rawRole.includes('reviewer') || rawRole.includes('hr')) {
      normalizedRole = 'reviewer';
    }

    // Super Admin has access to everything
    const hasAccess = normalizedRole === 'admin' || allowedRoles.includes(normalizedRole);

    if (!hasAccess) {
      return (
        <div className="flex min-h-[80vh] items-center justify-center p-6">
          <Result
            status="403"
            title="403 — Access Restricted"
            subTitle={`Your assigned role (${user?.role?.name || 'Staff'}) does not have permission to access this portal module.`}
            extra={
              <Button
                type="primary"
                onClick={() => navigate(ROUTES.PORTAL.DASHBOARD)}
                className="!bg-[#005D9A]"
              >
                Back to Dashboard
              </Button>
            }
          />
        </div>
      );
    }
  }

  return <>{children}</>;
}