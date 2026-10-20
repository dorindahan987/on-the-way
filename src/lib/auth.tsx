"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AuthRole = "sender" | "driver";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: AuthRole;
  verified: boolean;
  avg_rating: number;
  completed_trips: number;
}

const MOCK_ACCOUNTS: Record<AuthRole, AuthUser> = {
  sender: {
    id: "u4",
    name: "שרה אברהם",
    phone: "055-444-4444",
    role: "sender",
    verified: false,
    avg_rating: 4.8,
    completed_trips: 6,
  },
  driver: {
    id: "u1",
    name: "יוסי כהן",
    phone: "052-111-1111",
    role: "driver",
    verified: true,
    avg_rating: 4.9,
    completed_trips: 124,
  },
};

interface AuthCtx {
  user: AuthUser | null;
  login: (role: AuthRole) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "otw_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const login = (role: AuthRole, name?: string, phone?: string) => {
    const base = MOCK_ACCOUNTS[role];
    const u: AuthUser = {
      ...base,
      id: `user_${Date.now()}`,
      name: name?.trim() || base.name,
      phone: phone?.trim() || base.phone,
    };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  if (!ready) return <div className="min-h-screen bg-white" />;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
