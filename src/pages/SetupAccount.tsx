import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/auth/FormInput";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const SetupAccount = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accountName, setAccountName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user.id) return;

    setLoading(true);
    const { error } = await supabase
      .from('accounts')
      .insert([
        { name: accountName, owner_id: session.user.id }
      ]);

    if (error) {
      console.error('Error creating account:', error);
      toast.error('Error creating account');
    } else {
      toast.success('Account created successfully');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-2xl mx-auto bg-card border-0">
        <CardHeader>
          <CardTitle className="text-foreground">Setup Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="text"
              label="Account Name"
              placeholder="Enter your account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};