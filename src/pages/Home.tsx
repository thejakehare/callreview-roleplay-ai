import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthFooter } from "@/components/auth/AuthFooter";

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
        <div className="bg-[#1A1F2C] backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm mb-8">
          For High Ticket Sales Reps
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl text-center space-y-6 z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
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
              onClick={() => navigate("/auth?mode=register")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              Get Started Free <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
};

export default Home;