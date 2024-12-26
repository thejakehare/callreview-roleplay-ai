import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Play, History, UserPlus, Building } from "lucide-react";
import { SessionHistory } from "@/components/history/SessionHistory";
import { SessionFavorites } from "@/components/favorites/SessionFavorites";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InvitationForm } from "@/components/invitations/InvitationForm";
import { CreateAccountForm } from "@/components/accounts/CreateAccountForm";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto py-12 px-4 space-y-8 flex-grow">
        <div className="flex justify-end mb-6 gap-4">
          <Dialog open={createAccountOpen} onOpenChange={setCreateAccountOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Building className="mr-2 h-4 w-4" />
                Create New Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
              </DialogHeader>
              <CreateAccountForm onSuccess={() => setCreateAccountOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
              </DialogHeader>
              <InvitationForm />
            </DialogContent>
          </Dialog>
        </div>
        
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
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <SessionHistory />
            <SessionFavorites />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-2 p-4">
        <span className="text-muted-foreground">Powered by</span>
        <a 
          href="https://callreview.ai/?utm_source=roleplayai" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/lovable-uploads/3b07f009-d5ac-4afa-a753-e8636bd1c59f.png" 
            alt="CallReviewAI Logo" 
            className="h-8"
          />
        </a>
      </div>
    </div>
  );
};