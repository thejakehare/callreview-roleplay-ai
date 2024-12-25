import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Link, Users } from "lucide-react";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
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
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          if (signUpError.message.includes("User already registered")) {
            toast.error("An account with this email already exists. Please try logging in instead.");
            setIsLogin(true);
          } else {
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
            toast.error("Error updating profile");
            return;
          }
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

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <Camera className="h-4 w-4" />
                      Profile Picture
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAvatar(e.target.files[0]);
                        }
                      }}
                      className="bg-secondary border-0 text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <Link className="h-4 w-4" />
                      Company Website
                    </label>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="bg-secondary border-0 text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-foreground">
                      <Users className="h-4 w-4" />
                      Role
                    </label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="bg-secondary border-0 text-foreground">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#222222] border-0">
                        <SelectItem value="sales_rep" className="focus:bg-[#333333] cursor-pointer">Sales Rep</SelectItem>
                        <SelectItem value="sales_manager" className="focus:bg-[#333333] cursor-pointer">Sales Manager</SelectItem>
                        <SelectItem value="founder_ceo" className="focus:bg-[#333333] cursor-pointer">Founder/CEO</SelectItem>
                        <SelectItem value="other" className="focus:bg-[#333333] cursor-pointer">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

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