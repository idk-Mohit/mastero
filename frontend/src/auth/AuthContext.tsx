import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "sessionState";

export function AuthProvider({ children }: { children: ReactNode }) {
  // start as loading=true so App can trigger checkSession once
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const authenticated = !!user;

  // hydrate from localStorage early (optimistic) — server check can correct it
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { user: User | null };
        if (parsed?.user) setUser(parsed.user);
      }
    } catch {
      // ignore bad JSON
    }
    // leave loading=true; useAuth.checkSession() will flip it off
  }, []);

  // persist to localStorage whenever user changes
  useEffect(() => {
    const payload = JSON.stringify({ user });
    localStorage.setItem(STORAGE_KEY, payload);
  }, [user]);

  // keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as { user: User | null };
          setUser(parsed?.user ?? null);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, authenticated, setUser, setLoading }),
    [user, loading, authenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
