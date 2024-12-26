import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { profileApi, Profile } from "@/api/profileApi";
import { usePasswordReset } from "./usePasswordReset";

export const useProfileData = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>({
    role: "",
    first_name: "",
    last_name: "",
    avatar_url: null
  });

  const { loading: resetLoading, handleResetPassword } = usePasswordReset();

  const getProfile = async () => {
    if (!session?.user.id) {
      console.error("No user ID found in session");
      return;
    }

    setLoading(true);
    const profileData = await profileApi.getProfile(session.user.id);
    
    if (profileData) {
      setProfile(profileData);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    getProfile();
  }, [session?.user.id]);

  const handleSave = async () => {
    if (!session?.user.id) return;
    
    setLoading(true);
    await profileApi.updateProfile(session.user.id, {
      role: profile.role,
      first_name: profile.first_name,
      last_name: profile.last_name,
    });
    setLoading(false);
  };

  const handleAvatarUpload = async (file: File) => {
    if (!session?.user.id) return;
    
    setLoading(true);
    const publicUrl = await profileApi.uploadAvatar(session.user.id, file);
    if (publicUrl) {
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
    }
    setLoading(false);
  };

  return {
    loading: loading || resetLoading,
    role: profile.role,
    firstName: profile.first_name,
    lastName: profile.last_name,
    avatarUrl: profile.avatar_url,
    setRole: (role: string) => setProfile(prev => ({ ...prev, role })),
    setFirstName: (first_name: string) => setProfile(prev => ({ ...prev, first_name })),
    setLastName: (last_name: string) => setProfile(prev => ({ ...prev, last_name })),
    handleSave,
    handleAvatarUpload,
    handleResetPassword: () => handleResetPassword(session?.user.email || "")
  };
};