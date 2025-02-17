import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LoginErrorDisplay } from "./LoginErrorDisplay";
import { LoginFormFields } from "./LoginFormFields";
import { FormFooter } from "./FormFooter";

export const LoginForm = ({
  onToggleMode,
  onForgotPassword,
  defaultEmail = "",
}: {
  onToggleMode: () => void;
  onForgotPassword: () => void;
  defaultEmail?: string;
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Login error:", signInError);
        
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password. Please try again.");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Please check your email and confirm your account before logging in.");
        } else {
          setError("An error occurred while trying to log in. Please try again.");
        }
        return;
      }

      if (data?.user) {
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LoginErrorDisplay error={error} />
      
      <LoginFormFields
        email={email}
        password={password}
        onEmailChange={(e) => setEmail(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="button"
        variant="ghost"
        className="w-full text-sm text-muted-foreground hover:text-primary"
        onClick={onForgotPassword}
      >
        Forgot Password?
      </Button>

      <FormFooter
        isLogin={true}
        loading={loading}
        onToggleMode={onToggleMode}
      />
    </form>
  );
};