import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  if (session) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to Roleplay Bot
        </h1>
        <p className="text-xl text-muted-foreground">
          Practice your communication skills with our AI-powered roleplay scenarios.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="px-8"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;