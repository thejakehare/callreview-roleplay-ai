import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-end gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard")}
          className={isActive("/dashboard") ? "text-primary hover:text-primary/90" : "text-white hover:text-white/90"}
        >
          Dashboard
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-white hover:text-white/90"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};