import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/auth/FormInput";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { Link } from "lucide-react";

const roleDisplayNames: Record<string, string> = {
  sales_rep: "Sales Rep",
  sales_manager: "Sales Manager",
  founder_ceo: "Founder/CEO",
  other: "Other"
};

export const Profile = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      if (!session?.user.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        toast.error('Error loading profile');
        return;
      }

      if (data) {
        setWebsite(data.company_website || "");
        setRole(data.role || "");
        setAvatarUrl(data.avatar_url);
      }
    };

    getProfile();
  }, [session?.user.id]);

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(
        session?.user.email || "",
        { redirectTo: `${window.location.origin}/auth` }
      );

      if (error) throw error;
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-2xl mx-auto bg-card border-0">
        <CardHeader>
          <CardTitle className="text-foreground">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-secondary">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10">
                    {session?.user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  {session?.user.email}
                </h3>
              </div>
            </div>

            <FormInput
              type="url"
              label="Company Website"
              placeholder="https://example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              icon={Link}
              readOnly
            />

            <FormInput
              type="text"
              label="Role"
              value={roleDisplayNames[role] || role}
              onChange={(e) => setRole(e.target.value)}
              readOnly
            />

            <Button
              onClick={handleResetPassword}
              className="w-full"
              disabled={loading}
            >
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};