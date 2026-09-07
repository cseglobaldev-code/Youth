import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { ROUTES } from '@/routes/paths';

interface PortalAuthGuardProps {
  children: React.ReactNode;
}

export function PortalAuthGuard({ children }: PortalAuthGuardProps) {
  const { isAuthenticated, isLoading, logout } = usePortalAuth();
  const location = useLocation();

  // 🛡️ Fail-safe: If verification hangs for more than 3 seconds, auto-clear and go to login
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

  return <>{children}</>;
}