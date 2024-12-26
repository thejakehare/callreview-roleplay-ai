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

      console.log("Fetching profile for user:", session.user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error('Error loading profile');
        return;
      }

      if (data) {
        console.log("Profile data received:", data);
        setWebsite(data.company_website || "");
        setRole(data.role || "");
        setAvatarUrl(data.avatar_url);
      } else {
        console.log("No profile found for user:", session.user.id);
        // Initialize with empty values if no profile exists
        setWebsite("");
        setRole("");
        setAvatarUrl(null);
      }
    };

    getProfile();
  }, [session?.user.id]);

  const handleWebsiteChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWebsite = e.target.value;
    setWebsite(newWebsite);
    
    if (!session?.user.id) return;

    const { error } = await supabase
      .from('profiles')
      .update({ company_website: newWebsite })
      .eq('id', session.user.id);

    if (error) {
      console.error("Error updating website:", error);
      toast.error('Failed to update website');
    } else {
      toast.success('Website updated successfully');
    }
  };

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
            onWebsiteChange={handleWebsiteChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};