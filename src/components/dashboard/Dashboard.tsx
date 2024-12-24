import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Play, History } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Sales Roleplay Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/roleplay")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="mr-2" /> New Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Start a new roleplay session with our AI sales coach
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2" /> Session History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View your past roleplay sessions and track your progress
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};