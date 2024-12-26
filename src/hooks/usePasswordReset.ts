import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/auth` }
      );

      if (error) throw error;
      toast.success("Password reset email sent!");
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleResetPassword
  };
};