import { Header } from "@/components/Header";
import { Outlet, Navigate } from "react-router";

export default function ProtectedRoute({ isAuthed }: { isAuthed: boolean }) {
  return isAuthed ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}
