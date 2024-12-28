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

  useEffect(() => {
    getProfile();
  }, [session?.user.id]);

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
        console.error("Error fetching profile:", error);
        toast.error('Error loading profile');
        return;
      }

      if (data) {
        setRole(data.role || "");
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        
        if (data.avatar_url) {
          try {
            // First try to parse it as a URL to check if it's already a full URL
            new URL(data.avatar_url);
            setAvatarUrl(data.avatar_url);
          } catch {
            // If it's not a valid URL, it's a storage path - get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(data.avatar_url);
            
            // Verify the URL is accessible
            const img = new Image();
            img.onload = () => setAvatarUrl(publicUrl);
            img.onerror = () => {
              console.error("Failed to load avatar image");
              setAvatarUrl(null);
            };
            img.src = publicUrl;
          }
        } else {
          setAvatarUrl(null);
        }
      } else {
        // If no profile exists, create one
        const { error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: session.user.id,
              role: 'user',
              first_name: null,
              last_name: null,
              avatar_url: null
            }
          ]);

        if (createError) {
          console.error("Error creating profile:", createError);
          toast.error('Error creating profile');
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

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