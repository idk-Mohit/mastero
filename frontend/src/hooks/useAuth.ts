import { useCallback } from "react";
import { useAuthContext } from "../auth/AuthContext";
import { toast } from "sonner";

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

        if (!res.ok) {
          // try to surface server message if any
          let serverMsg = "Invalid credentials";
          try {
            const maybeJson = await res.json();
            serverMsg = maybeJson?.message || maybeJson?.error || serverMsg;
          } catch {
            // ignore JSON parse errors, keep default
          }
          throw new Error(serverMsg);
        }

        const data = await res.json();
        setUser(data?.data ?? null);
        return data?.data ?? null;
      } catch (error: any) {
        const msg = error?.message || "Login failed";

        console.log(msg);
        // 🔔 show toast here
        toast.error("Login failed", {
          description: msg,
          action: {
            label: "Dismiss",
            onClick: () => {},
          },
        });
        setUser(null);
        // ❗ rethrow so caller knows to stop navigation / show inline error
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }, [setUser]);

  return { user, loading, authenticated: !!user, login, logout, checkSession };
}
