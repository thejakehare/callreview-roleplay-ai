import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { RoleplaySession } from "@/components/roleplay/RoleplaySession";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Profile } from "@/pages/Profile";
import { Header } from "@/components/layout/Header";

const App = () => {
  const { session } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthForm />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Header />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roleplay"
        element={
          <ProtectedRoute>
            <Header />
            <RoleplaySession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Header />
            <Profile />
          </ProtectedRoute>
        }
      />
      {/* Catch all route - redirect to dashboard or home */}
      <Route
        path="*"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};

export { App };