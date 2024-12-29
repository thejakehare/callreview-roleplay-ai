import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "./LoginForm";
import { RegistrationForm } from "./RegistrationForm";
import { PasswordResetForm } from "./PasswordResetForm";
import { AuthCard } from "./AuthCard";
import { AuthFooter } from "./AuthFooter";

export const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event, session);
    if (session?.user) {
      navigate("/dashboard");
    }
  });

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
            <RegistrationForm
              onToggleMode={() => setIsLogin(true)}
              defaultEmail={email}
            />
          )}
        </AuthCard>
      </div>
      <AuthFooter />
    </div>
  );
};