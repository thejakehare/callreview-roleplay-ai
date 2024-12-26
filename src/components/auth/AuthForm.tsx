import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { RegistrationForm } from "./RegistrationForm";
import { LoginForm } from "./LoginForm";
import { PasswordResetForm } from "./PasswordResetForm";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthForm mounted");
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", { event, session });
      if (session?.user) {
        console.log("Valid session detected, navigating to dashboard");
        navigate("/dashboard");
      }
    });

    return () => {
      console.log("AuthForm unmounting, cleaning up listener");
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background">
      <div className="flex-1 flex items-center justify-center w-full">
        <Card className="w-[400px] bg-card border-0">
          <CardHeader>
            <CardTitle className="text-foreground text-center">
              {isForgotPassword ? "Reset Password" : (isLogin ? "Login" : "Register")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isForgotPassword ? (
              <PasswordResetForm onBack={() => setIsForgotPassword(false)} />
            ) : isLogin ? (
              <LoginForm
                onToggleMode={() => setIsLogin(false)}
                onForgotPassword={() => setIsForgotPassword(true)}
              />
            ) : (
              <RegistrationForm onBack={() => setIsLogin(true)} />
            )}
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