import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { FormInput } from "./FormInput";
import { RegistrationFields } from "./RegistrationFields";
import { LoginForm } from "./LoginForm";
import { PasswordResetForm } from "./PasswordResetForm";
import { AuthCard } from "./AuthCard";
import { AuthFooter } from "./AuthFooter";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (session?.user) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Starting registration for email:", email);
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          toast.error("An account with this email already exists. Switching to login form.");
          setIsLogin(true);
          setEmail(email);
          setPassword("");
        } else {
          console.error("Registration error:", signUpError);
          toast.error(signUpError.message);
        }
        return;
      }

      console.log("Registration successful:", data);
      toast.success("Registration successful! Please check your email for confirmation.");

      if (data.user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        console.log("Profile check:", { profileData, profileError });
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background">
      <div className="flex-1 flex items-center justify-center w-full">
        <AuthCard
          title={isForgotPassword ? "Reset Password" : (isLogin ? "Login" : "Register")}
        >
          {isForgotPassword ? (
            <PasswordResetForm onBack={() => setIsForgotPassword(false)} />
          ) : isLogin ? (
            <LoginForm
              onToggleMode={() => setIsLogin(false)}
              onForgotPassword={() => setIsForgotPassword(true)}
              defaultEmail={email}
            />
          ) : (
            <form onSubmit={handleRegistration} className="space-y-4">
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

              <RegistrationFields
                role={role}
                setRole={setRole}
                onAvatarChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAvatar(e.target.files[0]);
                  }
                }}
              />

              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
                <button
                  type="button"
                  className="w-full text-primary hover:text-primary/90 px-4 py-2"
                  onClick={() => setIsLogin(true)}
                >
                  Back to login
                </button>
              </div>
            </form>
          )}
        </AuthCard>
      </div>
      <AuthFooter />
    </div>
  );
};