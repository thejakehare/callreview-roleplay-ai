import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { FormInput } from "./FormInput";
import { RegistrationFields } from "./RegistrationFields";
import { FormFooter } from "./FormFooter";

interface RegistrationFormProps {
  onToggleMode: () => void;
  defaultEmail?: string;
}

export const RegistrationForm = ({ onToggleMode, defaultEmail = "" }: RegistrationFormProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [role, setRole] = useState("user");

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Starting registration for email:", email);
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          toast.error("An account with this email already exists. Switching to login form.");
          onToggleMode();
        } else {
          console.error("Registration error:", signUpError);
          toast.error(signUpError.message);
        }
        return;
      }

      console.log("Registration successful:", data);
      toast.success("Registration successful! Please check your email for confirmation.");

      if (data.user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        console.log("Profile check:", { profileData, profileError });
      }

    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegistration} className="space-y-4">
      <FormInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <FormInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <RegistrationFields
        role={role}
        setRole={setRole}
        onAvatarChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
          }
        }}
      />

      <FormFooter
        isLogin={false}
        loading={loading}
        onToggleMode={onToggleMode}
      />
    </form>
  );
};