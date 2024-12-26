import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useRegistration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the user metadata object with the exact structure expected by the trigger
      const userMetadata = {
        first_name: firstName,
        last_name: lastName,
        account_name: accountName || undefined,
        role: role,
        email: email,
        email_verified: true,
        phone_verified: false,
      };

      console.log("Starting registration process with metadata:", userMetadata);

      const { data: signUpResponse, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
        },
      });

      if (signUpError) {
        console.error("Registration error:", signUpError);
        if (signUpError.message.includes("User already registered")) {
          toast.error("An account with this email already exists. Please try logging in instead.");
          return false;
        }
        toast.error(signUpError.message);
        return false;
      }

      const user = signUpResponse.user;
      if (!user) {
        console.error("No user returned from signup");
        toast.error("Registration failed. Please try again.");
        return false;
      }

      console.log("User created successfully:", user);

      // Wait for profile creation
      console.log("Waiting for profile creation...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verify profile was created
      console.log("Verifying profile creation for user:", user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile verification error:", profileError);
        toast.error("Error verifying profile. Please try again.");
        return false;
      }

      if (!profile) {
        console.error("No profile found after creation");
        toast.error("Error creating profile. Please try again.");
        return false;
      }

      console.log("Profile verified successfully:", profile);
      
      if (avatar) {
        console.log("Uploading avatar...");
        const fileExt = avatar.name.split('.').pop();
        const filePath = `${user.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatar);

        if (uploadError) {
          console.error("Avatar upload error:", uploadError);
          toast.error("Error uploading avatar");
          return false;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            avatar_url: publicUrl,
          })
          .eq('id', user.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
          toast.error("Error updating profile");
          return false;
        }

        console.log("Avatar uploaded successfully:", publicUrl);
      }

      toast.success("Registration successful!");
      
      // Wait longer to ensure account creation trigger has completed
      console.log("Waiting for account creation...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log("Registration process completed, navigating to dashboard");
      navigate("/dashboard");
      return true;

    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "An error occurred during registration");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    accountName,
    setAccountName,
    loading,
    avatar,
    setAvatar,
    role,
    setRole,
    email,
    setEmail,
    password,
    setPassword,
    handleRegistration,
  };
};