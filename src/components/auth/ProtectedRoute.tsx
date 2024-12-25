import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Header } from "../layout/Header";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOnboarding?: boolean;
}

export const ProtectedRoute = ({ children, requiresOnboarding = true }: ProtectedRouteProps) => {
  const { session, onboardingCompleted } = useAuth();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (requiresOnboarding && onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};