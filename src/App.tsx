import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { RoleplaySession } from "@/components/roleplay/RoleplaySession";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Profile } from "@/pages/Profile";
import { SessionDetails } from "@/pages/SessionDetails";
import { AcceptInvitation } from "@/components/invitations/AcceptInvitation";
import { SetupProfile } from "@/pages/SetupProfile";
import { SetupAccount } from "@/pages/SetupAccount";
import Home from "@/pages/Home";
import Header from "@/components/layout/Header";

const App = () => {
  const { session } = useAuth();

  return (
    <>
      {session && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/auth"
          element={
            session ? (
              <Navigate to="/setup-profile" replace />
            ) : (
              <AuthForm />
            )
          }
        />
        <Route
          path="/setup-profile"
          element={
            <ProtectedRoute>
              <SetupProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup-account"
          element={
            <ProtectedRoute>
              <SetupAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roleplay"
          element={
            <ProtectedRoute>
              <RoleplaySession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:id"
          element={
            <ProtectedRoute>
              <SessionDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/accept-invitation" element={<AcceptInvitation />} />
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export { App };