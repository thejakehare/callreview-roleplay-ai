import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";

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
          <ProfileAvatar 
            avatarUrl={avatarUrl} 
            email={session?.user.email || ""} 
          />
          <ProfileForm
            website={website}
            role={role}
            loading={loading}
            onResetPassword={handleResetPassword}
          />
        </CardContent>
      </Card>
    </div>
  );
};