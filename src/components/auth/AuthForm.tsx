import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // For new registrations, redirect to onboarding
        if (!isLogin) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
    });
  }, [navigate, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            toast.error("Please check your email and confirm your account before logging in");
          } else if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("Successfully logged in!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          // Check for user already exists error
          if (error.message.includes("User already registered")) {
            toast.error("An account with this email already exists. Please try logging in instead.");
            setIsLogin(true); // Switch to login mode
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("Registration successful! Please check your email for confirmation.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background">
      <div className="flex-1 flex items-center justify-center w-full">
        <Card className="w-[400px] bg-card border-0">
          <CardHeader>
            <CardTitle className="text-foreground text-center">
              {isLogin ? "Login" : "Register"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
              />
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                disabled={loading}
              >
                {loading ? "Loading..." : isLogin ? "Login" : "Register"}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full text-primary hover:text-primary/90"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Need an account? Register" : "Have an account? Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <footer className="w-full py-6 px-4 flex items-center justify-center space-x-2 text-muted">
        <span>Powered by</span>
        <a 
          href="https://callreview.ai/?utm_source=roleplayai" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img src="/lovable-uploads/3b07f009-d5ac-4afa-a753-e8636bd1c59f.png" alt="Logo" className="h-6" />
        </a>
      </footer>
    </div>
  );
};
