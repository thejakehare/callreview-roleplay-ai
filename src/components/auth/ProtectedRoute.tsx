import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Header } from "../layout/Header";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};