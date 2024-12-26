import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AuthFields } from "./AuthFields";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface RegistrationFormProps {
  onBack: () => void;
}

export const RegistrationForm = ({ onBack }: RegistrationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Registration error:", error);
      if (error.message.includes("User already registered")) {
        toast.error("An account with this email already exists. Please try logging in instead.");
      } else {
        toast.error(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleRegistration} className="space-y-4">
      <AuthFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />

      <div className="space-y-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full text-primary hover:text-primary/90 text-sm"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>
      </div>
    </form>
  );
};