import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Play, History } from "lucide-react";
import { SessionHistory } from "@/components/history/SessionHistory";
import { useState } from "react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto py-12 px-4 space-y-8 flex-grow">
        <div className="grid md:grid-cols-2 gap-8">
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
          <Card 
            className="hover:scale-105 transition-transform duration-200 cursor-pointer bg-card border-0"
            onClick={() => setShowHistory(!showHistory)}
          >
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center text-2xl text-primary">
                <History className="mr-3 h-6 w-6" /> Session History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">
                View your past roleplay sessions and track your progress
              </p>
            </CardContent>
          </Card>
        </div>
        {showHistory && (
          <div className="mt-12">
            <SessionHistory />
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 p-4">
        <span className="text-muted-foreground">Powered by</span>
        <img 
          src="/lovable-uploads/3b07f009-d5ac-4afa-a753-e8636bd1c59f.png" 
          alt="CallReviewAI Logo" 
          className="h-8"
        />
      </div>
    </div>
  );
};