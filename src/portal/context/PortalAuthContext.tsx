import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { PortalUser, AuthResponse } from '../types/auth';

interface PortalAuthContextType {
  user: PortalUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const PortalAuthContext = createContext<PortalAuthContextType | null>(null);

const TOKEN_KEY = 'you_portal_jwt';
const USER_KEY = 'you_portal_user';

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  });

  const [user, setUser] = useState<PortalUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const cached = localStorage.getItem(USER_KEY);
    return cached ? JSON.parse(cached) : null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getBaseUrl = (): string => {
    return (import.meta.env.VITE_STRAPI_API_URL || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');
  };

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_KEY);
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    // Safety controller with 4-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(`${getBaseUrl()}/api/portal-auth/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        // Bad/expired token: clear storage immediately
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        setToken(null);
      }
    } catch {
      // Clear stale token on error/timeout so we never spin infinitely
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      //  Post to the admin auth bridge
      const res = await fetch(`${getBaseUrl()}/api/portal-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || 'Invalid identifier or password');
      }

      const data = await res.json();
      setToken(data.jwt);
      setUser(data.user);
      localStorage.setItem(TOKEN_KEY, data.jwt);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <PortalAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const context = useContext(PortalAuthContext);
  if (!context) {
    throw new Error('usePortalAuth must be used within a PortalAuthProvider');
  }
  return context;
}