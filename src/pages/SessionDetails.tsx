import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, MessageSquare, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

export const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Tables<"sessions"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          toast.error("Failed to load session details");
          return;
        }

        setSession(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while loading session details");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Session not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Button
        variant="outline"
        className="mb-8"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2" /> Back to Dashboard
      </Button>

      <Card className="bg-card border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            Session Details
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {format(new Date(session.created_at), "PPp")}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-accent/50 border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Duration</span>
                </div>
                <p className="mt-2 text-muted-foreground">
                  {session.duration ? `${session.duration} minutes` : "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-accent/50 border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="font-medium">Summary</span>
                </div>
                <p className="mt-2 text-muted-foreground">
                  {session.summary || "No summary available"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-accent/50 border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">Feedback</span>
                </div>
                <p className="mt-2 text-muted-foreground">
                  {session.feedback || "No feedback available"}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};