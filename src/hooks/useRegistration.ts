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
      const signupPayload = {
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
      };

      console.log("Signup payload:", JSON.stringify(signupPayload, null, 2));

      const signUpResponse = await supabase.auth.signUp(signupPayload);

      if (signUpResponse.error) {
        console.error("Registration error:", signUpResponse.error);
        if (signUpResponse.error.message.includes("User already registered")) {
          toast.error("An account with this email already exists. Please try logging in instead.");
          return false;
        }
        toast.error(signUpResponse.error.message);
        return false;
      }

      const { data: { user } } = signUpResponse;
      
      if (!user) {
        console.error("No user returned from signup");
        toast.error("Registration failed. Please try again.");
        return false;
      }

      console.log("User created successfully:", user);
      
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

      toast.success("Registration successful! Please check your email for confirmation.");
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
