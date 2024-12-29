import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  if (session) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex justify-end items-center z-10">
        <Button 
          onClick={() => navigate("/auth")}
          className="bg-card hover:bg-card/80 text-foreground gap-2"
        >
          Get started <ChevronRight className="w-4 h-4" />
        </Button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Purple gradient background */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]" 
          style={{
            background: "radial-gradient(circle at center, rgba(155,135,245,0.15) 0%, rgba(26,31,44,0) 70%)",
          }}
        />

        {/* Animated Logo */}
        <img
          src={`${supabase.storage.from('logos').getPublicUrl('call-review-ai-animated.gif').data.publicUrl}`}
          alt="Call Review AI Animation"
          className="w-40 h-40 mb-8 object-contain"
        />

        {/* Badge */}
        <div className="bg-card/30 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full text-sm mb-8">
          For High Ticket Sales Reps
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl text-center space-y-6 z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Get Your Personal
            <br />
            Sales Roleplay AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enhance your sales skills by doing live roleplay sessions with AI. 
            Anytime, anywhere, any scenario.
          </p>
          
          {/* CTA Button */}
          <div className="flex gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              Get Started Free <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-16 bg-card/30 backdrop-blur-sm rounded-full px-8 py-4">
          <div className="text-center px-8">
            <div className="text-2xl font-bold text-foreground">1000+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center px-8 border-x border-muted/20">
            <div className="text-2xl font-bold text-foreground">98.5%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center px-8">
            <div className="text-2xl font-bold text-foreground">10+</div>
            <div className="text-sm text-muted-foreground">Scenarios</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
