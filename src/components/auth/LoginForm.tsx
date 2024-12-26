import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { FormInput } from "./FormInput";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

export const LoginForm = ({
  onToggleMode,
  onForgotPassword,
}: {
  onToggleMode: () => void;
  onForgotPassword: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        
        if (error.message.includes("Invalid login credentials")) {
          setError("No account found with this email. Please check your email or sign up for a new account.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please check your email and confirm your account before logging in");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <FormInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <FormInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button
        type="button"
        variant="ghost"
        className="w-full text-sm text-muted-foreground hover:text-primary"
        onClick={onForgotPassword}
      >
        Forgot Password?
      </Button>

      <div className="space-y-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onToggleMode}
        >
          Don't have an account? Sign up
        </Button>
      </div>
    </form>
  );
};