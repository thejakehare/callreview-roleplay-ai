import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export const useProfileData = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const createProfile = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{ id: userId }]);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast.error('Error creating profile');
    }
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      
      if (!session?.user.id) {
        console.error("No user ID found in session");
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role, avatar_url, first_name, last_name')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          await createProfile(session.user.id);
          const { data: retryData, error: retryError } = await supabase
            .from('profiles')
            .select('role, avatar_url, first_name, last_name')
            .eq('id', session.user.id)
            .maybeSingle();

          if (retryError) throw retryError;
          if (retryData) {
            setRole(retryData.role || "");
            setFirstName(retryData.first_name || "");
            setLastName(retryData.last_name || "");
            setAvatarUrl(retryData.avatar_url);
          }
          return;
        }
        throw error;
      }

      if (data) {
        setRole(data.role || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        
        if (data.avatar_url) {
          try {
            new URL(data.avatar_url);
            setAvatarUrl(data.avatar_url);
          } catch {
            const { data: publicUrl } = supabase.storage
              .from('avatars')
              .getPublicUrl(data.avatar_url);
            setAvatarUrl(publicUrl.publicUrl);
          }
        } else {
          setAvatarUrl(null);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, [session?.user.id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (!session?.user.id) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          role,
          first_name: firstName,
          last_name: lastName,
        })
        .eq('id', session.user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Error updating profile');
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setLoading(true);
      
      if (!session?.user.id) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success('Profile photo updated successfully');
    } catch (error: any) {
      toast.error('Error uploading profile photo');
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
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

  return {
    loading,
    role,
    firstName,
    lastName,
    avatarUrl,
    setRole,
    setFirstName,
    setLastName,
    handleSave,
    handleAvatarUpload,
    handleResetPassword
  };
};