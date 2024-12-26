import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const acceptInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('accept_invitation', { invitation_id: invitationId });

      if (error) throw error;

      if (data) {
        toast({
          title: "Invitation accepted",
          description: "You have successfully joined the team.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Invalid invitation",
          description: "This invitation may have expired or already been used.",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error accepting invitation",
        description: error.message,
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const invitationId = searchParams.get("id");
    if (invitationId) {
      acceptInvitation(invitationId);
    } else {
      navigate("/");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Processing Invitation</h1>
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </Button>
      </div>
    </div>
  );
};