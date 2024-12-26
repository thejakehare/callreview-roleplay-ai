import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { profileApi } from "@/api/profileApi";
import { toast } from "sonner";

export const SetupProfile = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSave = async () => {
    if (!session?.user.id) {
      toast.error("No user session found");
      return;
    }
    
    if (!firstName || !lastName || !role) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const success = await profileApi.createProfile(session.user.id, {
        role,
        first_name: firstName,
        last_name: lastName,
      });
      
      if (success) {
        toast.success("Profile created successfully");
        navigate("/setup-account");
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!session?.user.id) return;
    
    setLoading(true);
    try {
      await profileApi.uploadAvatar(session.user.id, file);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-2xl mx-auto bg-card border-0">
        <CardHeader>
          <CardTitle className="text-foreground">Setup Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileForm
            role={role}
            firstName={firstName}
            lastName={lastName}
            loading={loading}
            onResetPassword={() => {}}
            onFirstNameChange={(e) => setFirstName(e.target.value)}
            onLastNameChange={(e) => setLastName(e.target.value)}
            onRoleChange={setRole}
            onSave={handleSave}
            onAvatarUpload={handleAvatarUpload}
            isSetupProfile={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};