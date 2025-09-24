import type React from "react";

import { Route, Routes, Navigate } from "react-router";
import { useEffect } from "react";
import { Header } from "./components/Header";
import Home from "./containers/Home";
import Login from "./containers/login/Login";
import Quiz from "./containers/quiz/Quiz";
import ReportsPage from "./containers/reports/Reports";
import AdminDashboard from "./containers/Admin";
import { useAuthContext } from "./auth/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Register from "./containers/login/Register";

// Mock auth context - replace with your actual auth implementation

function ProtectedRoute({
  isAuthed,
  children,
}: {
  isAuthed: boolean;
  children: React.ReactNode;
}) {
  return isAuthed ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  const { checkSession } = useAuth();
  const { loading, authenticated } = useAuthContext();

  useEffect(() => {
    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {authenticated && <Header />}
        <Routes>
          <Route
            path="/login"
            element={
              authenticated ? <Navigate to="/home" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              authenticated ? <Navigate to="/home" replace /> : <Register />
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute isAuthed={authenticated}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute isAuthed={authenticated}>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute isAuthed={authenticated}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthed={authenticated}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={authenticated ? "/home" : "/login"} replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
