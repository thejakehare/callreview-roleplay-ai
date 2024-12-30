import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { SessionHistory } from "@/components/history/SessionHistory";

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto py-12 px-4 space-y-8 flex-grow">
        <div className="grid md:grid-cols-1 gap-8">
          <Card 
            className="hover:scale-105 transition-transform duration-200 cursor-pointer bg-card border-0" 
            onClick={() => navigate("/roleplay")}
          >
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center text-2xl text-primary">
                <Play className="mr-3 h-6 w-6" /> New Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">
                Start a new roleplay session with our AI sales coach
              </p>
            </CardContent>
          </Card>
          <SessionHistory />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 p-4">
        <span className="text-muted-foreground">Powered by</span>
        <a 
          href="https://callreview.ai/?utm_source=roleplayai" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="https://wivbfxjqydkozyvlabil.supabase.co/storage/v1/object/public/logos/crai-logo-animated-dark.gif" 
            alt="CallReviewAI Logo" 
            className="h-8"
          />
        </a>
      </div>
    </div>
  );
};