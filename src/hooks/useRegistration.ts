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
      console.log("Starting registration with data:", {
        email,
        firstName,
        lastName,
        accountName,
        role,
        hasAvatar: !!avatar
      });

      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            account_name: accountName,
            role: role
          },
        },
      });

      console.log("Registration response:", { data, error: signUpError });

      if (signUpError) {
        if (signUpError.message.includes("User already registered") || 
            (typeof signUpError === 'object' && 
             'body' in signUpError && 
             typeof signUpError.body === 'string' && 
             signUpError.body.includes("user_already_exists"))) {
          toast.error("An account with this email already exists. Please try logging in instead.");
          return false;
        } else {
          console.error("Registration error:", signUpError);
          // Log the full error object for debugging
          console.error("Full error details:", {
            message: signUpError.message,
            status: signUpError.status,
            name: signUpError.name,
            stack: signUpError.stack,
            details: signUpError
          });
          toast.error(signUpError.message);
          return false;
        }
      }

      if (data.user) {
        console.log("User created successfully:", data.user);
        
        let avatarUrl = null;
        if (avatar) {
          console.log("Uploading avatar...");
          const fileExt = avatar.name.split('.').pop();
          const filePath = `${data.user.id}-${Math.random()}.${fileExt}`;

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

          avatarUrl = publicUrl;
          console.log("Avatar uploaded successfully:", avatarUrl);
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            avatar_url: avatarUrl,
            role: role,
            first_name: firstName,
            last_name: lastName,
            onboarding_completed: true,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
          toast.error("Error updating profile");
          return false;
        }

        console.log("Profile updated successfully");
        toast.success("Registration successful! Please check your email for confirmation.");
        navigate("/dashboard");
        return true;
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      // Log the full error object for debugging
      console.error("Full error details:", {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack,
        details: error
      });
      toast.error(error.message || "An error occurred during registration");
      return false;
    } finally {
      setLoading(false);
    }
    return false;
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