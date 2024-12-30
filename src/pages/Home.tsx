import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end mb-8">
        Welcome to Lovable
      </h1>
      <AuthForm />
    </div>
  );
};

export default Home;