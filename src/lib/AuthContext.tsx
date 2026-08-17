"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthState {
  isAuthenticated: boolean;
  orgName: string;
  userEmail: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = "policybot_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem(STORAGE_KEY)
        : null;
    if (saved) setUserEmail(saved);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((res) => setTimeout(res, 700));
    if (!email.includes("@")) {
      return { ok: false, error: "Enter a valid work email." };
    }
    if (password.length < 4) {
      return { ok: false, error: "Incorrect email or password." };
    }
    window.sessionStorage.setItem(STORAGE_KEY, email);
    setUserEmail(email);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setUserEmail(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!userEmail,
      orgName: "",
      userEmail,
      loading,
      login,
      logout,
    }),
    [userEmail, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
