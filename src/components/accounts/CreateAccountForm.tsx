import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/auth/FormInput";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building } from "lucide-react";

export const CreateAccountForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account created successfully",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Account Name"
        placeholder="Enter account name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={Building}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        Create Account
      </Button>
    </form>
  );
};