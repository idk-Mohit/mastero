import { Route, Routes, Navigate } from "react-router";
import { useEffect } from "react";
import Home from "./containers/Home";
import Login from "./containers/login/Login";
import ProtectedRoute from "./layout/ProtectedView";
import { useAuth } from "./hooks/useAuth";
import { useAuthContext } from "./auth/AuthContext";
import Quiz from "./containers/quiz/Quiz";
import Reports from "./containers/reports/Reports";
import AdminPortal from "./containers/Admin";

export default function App() {
  const { checkSession } = useAuth();
  const { loading, authenticated } = useAuthContext();

  useEffect(() => {
    checkSession();
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <Routes>
      <Route
        path="/login"
        element={authenticated ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route element={<ProtectedRoute isAuthed={authenticated} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Route>
      <Route
        path="/"
        element={<Navigate to={authenticated ? "/home" : "/login"} replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
