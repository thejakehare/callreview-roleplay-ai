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
    console.log("Login attempt started for email:", email);
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login response:", { data, error: signInError });

      if (signInError) {
        console.error("Login error details:", signInError);
        
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Unable to find a user with that email. Please try again.");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Please check your email and confirm your account before logging in.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data?.user) {
        console.log("Login successful, user:", data.user);
        
        // Check if user has a profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profileData) {
          navigate("/setup-profile");
          return;
        }

        // Check if user belongs to any account
        const { data: accountMember, error: accountError } = await supabase
          .from('account_members')
          .select('*')
          .eq('user_id', data.user.id)
          .maybeSingle();

        console.log("Account member check:", { accountMember, accountError });

        if (accountError) {
          console.error("Error checking account membership:", accountError);
          setError("Error checking account membership");
          return;
        }

        if (!accountMember) {
          console.log("No account membership found, redirecting to setup-account");
          navigate("/setup-account");
          return;
        }

        toast.success("Successfully logged in!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      setError(error.message || "An error occurred during login");
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