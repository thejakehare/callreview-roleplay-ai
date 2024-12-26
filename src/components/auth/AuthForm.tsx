import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { FormInput } from "./FormInput";
import { RegistrationFields } from "./RegistrationFields";
import { LoginForm } from "./LoginForm";
import { PasswordResetForm } from "./PasswordResetForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [website, setWebsite] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          toast.error("An account with this email already exists. Please try logging in instead.");
          setIsLogin(true);
        } else {
          console.error("Registration error:", signUpError);
          toast.error(signUpError.message);
        }
        return;
      }

      if (data.user) {
        let avatarUrl = null;
        if (avatar) {
          const fileExt = avatar.name.split('.').pop();
          const filePath = `${data.user.id}-${Math.random()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatar);

          if (uploadError) {
            console.error("Avatar upload error:", uploadError);
            toast.error("Error uploading avatar");
            return;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          avatarUrl = publicUrl;
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            avatar_url: avatarUrl,
            company_website: website,
            role: role,
            onboarding_completed: true,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
          toast.error("Error updating profile");
          return;
        }
      }

      toast.success("Registration successful! Please check your email for confirmation.");
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
                  website={website}
                  setWebsite={setWebsite}
                  role={role}
                  setRole={setRole}
                  onAvatarChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAvatar(e.target.files[0]);
                    }
                  }}
                />

                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </Button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 w-full text-primary hover:text-primary/90 text-sm"
                    onClick={() => setIsLogin(true)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </button>
                </div>
              </form>
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