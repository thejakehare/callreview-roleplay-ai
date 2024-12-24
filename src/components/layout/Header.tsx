import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className="text-primary hover:text-primary/90"
        >
          Dashboard
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-primary hover:text-primary/90"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};