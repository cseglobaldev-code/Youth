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
    if (!cached) return null;
    try {
      return JSON.parse(cached) as PortalUser;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getBaseUrl = (): string => {
    return (
      import.meta.env.VITE_STRAPI_API_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '')
    ).replace(/\/$/, '');
  };

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_KEY);
    if (!currentToken) {
      logout();
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${getBaseUrl()}/api/portal-auth/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (res.ok) {
        const userData = (await res.json()) as PortalUser;
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        // Token rejected by server -> immediately wipe session
        logout();
      }
    } catch {
      // Offline / network hiccup: only keep user if valid token exists
      if (!currentToken) logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${getBaseUrl()}/api/portal-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as {
          error?: { message?: string };
          message?: string;
        };
        throw new Error(
          errorData?.error?.message ||
            errorData?.message ||
            'Invalid credentials. Please check your email and password.'
        );
      }

      const data = (await res.json()) as AuthResponse;
      setToken(data.jwt);
      setUser(data.user);

      localStorage.setItem(TOKEN_KEY, data.jwt);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PortalAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user && user.email),
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