import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfileData } from "@/hooks/useProfileData";

export const Profile = () => {
  const { session } = useAuth();
  const {
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
  } = useProfileData();

  // Hide header if we're on the setup-profile route
  const isSetupProfile = window.location.pathname === '/setup-profile';

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
            role={role}
            firstName={firstName}
            lastName={lastName}
            loading={loading}
            onResetPassword={handleResetPassword}
            onFirstNameChange={(e) => setFirstName(e.target.value)}
            onLastNameChange={(e) => setLastName(e.target.value)}
            onRoleChange={setRole}
            onSave={handleSave}
            onAvatarUpload={handleAvatarUpload}
            isSetupProfile={isSetupProfile}
          />
        </CardContent>
      </Card>
    </div>
  );
};