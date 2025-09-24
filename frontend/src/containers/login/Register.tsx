import { useAuthContext } from "@/auth/AuthContext";
import { useCallback } from "react";

/**
 * Centralizes auth actions. Uses HttpOnly cookies on the server.
 * The hook updates AuthContext but keeps logic here.
 */
export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthContext();

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data?.data ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error("Invalid credentials");
        const data = await res.json();
        setUser(data?.data ?? null); // cookie set server-side
        return data?.data ?? null;
      } catch (error) {
        console.error(error);
        setUser(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(errorBody?.message || "Registration failed");
        }
        const data = await res.json();
        setUser(data?.data ?? null); // auto-login after register
        return data?.data ?? null;
      } catch (error) {
        console.error(error);
        setUser(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }, [setUser]);

  return {
    user,
    loading,
    authenticated: !!user,
    login,
    register,
    logout,
    checkSession,
  };
}
