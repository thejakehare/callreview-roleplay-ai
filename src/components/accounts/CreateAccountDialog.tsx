import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountCreated: () => void;
}

export const CreateAccountDialog = ({
  open,
  onOpenChange,
  onAccountCreated,
}: CreateAccountDialogProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('accounts')
        .insert([{ name }]);

      if (error) throw error;

      toast.success('Account created successfully');
      onAccountCreated();
      onOpenChange(false);
      setName("");
    } catch (error: any) {
      toast.error('Error creating account');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Account Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading || !name.trim()}>
            Create Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};