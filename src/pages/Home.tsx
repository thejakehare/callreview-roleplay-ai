import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const Home: FC = () => {
  const navigate = useNavigate();

  // Get public URL for the GIF
  const { data: { publicUrl } } = supabase
    .storage
    .from('logos')
    .getPublicUrl('call-review-ai-animated.gif');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between relative overflow-hidden">
      {/* Purple gradient background effect */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]" 
        style={{
          background: "radial-gradient(circle at center, rgba(147,51,234,0.3) 0%, rgba(0,0,0,1) 70%)",
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12">
        {/* Logo GIF */}
        <img 
          src={publicUrl}
          alt="Logo Animation"
          className="w-auto max-w-[125px] mx-auto mb-8"
        />

        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/50 text-purple-200 mb-8">
          For high ticket sales reps & teams
        </div>

        {/* Hero Text */}
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
          Get your own personal
          <br />
          <span className="text-primary">sales roleplay partner</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          The best way to improve your sales skills is through practice and repetition. 
          Now you can practice anytime, anywhere with the help of AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="text-lg px-8 py-6"
          >
            Create your free account
          </Button>
          <Button
            onClick={() => navigate("/auth")}
            variant="secondary"
            size="lg"
            className="text-lg px-8 py-6"
          >
            Login
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">1.2M+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">99.9%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">12+</div>
            <div className="text-sm text-muted-foreground">AI Models</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 px-8 mt-16 bg-black">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Powered by</span>
          <a 
            href="https://callreview.ai?utm_source=roleplayai" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="/lovable-uploads/bae407cd-af41-4e2c-b520-2c31732e4a94.png" 
              alt="CallReviewAI" 
              className="h-6 w-auto"
            />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;