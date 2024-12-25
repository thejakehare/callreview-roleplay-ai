import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState, useEffect } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const getProfile = async () => {
      if (!session?.user.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', session.user.id)
        .single();

      if (!error && data) {
        setAvatarUrl(data.avatar_url);
      }
    };

    getProfile();
  }, [session?.user.id]);

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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-10 h-10 rounded-full p-0 border border-border"
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center bg-primary/10 text-foreground">
                  {session?.user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
            <DropdownMenuItem 
              onClick={() => navigate("/profile")}
              className="cursor-pointer"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};