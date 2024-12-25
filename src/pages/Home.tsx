import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Purple gradient background effect */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]" 
        style={{
          background: "radial-gradient(circle at center, rgba(147,51,234,0.3) 0%, rgba(0,0,0,1) 70%)",
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/50 text-purple-200 mb-8">
          #1 Ranked Voice AI Platform
        </div>

        {/* Hero Text */}
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
          Master Your Voice
          <br />
          <span className="text-primary">with AI Practice</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Supercharge your voice training with our AI tools - Practice sessions, 
          Real-time feedback, and Performance analytics. Level up your speaking skills easily.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="text-lg px-8 py-6"
          >
            Create your free account
          </Button>
          <Button
            onClick={() => navigate("/")}
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
    </div>
  );
};

export default Home;