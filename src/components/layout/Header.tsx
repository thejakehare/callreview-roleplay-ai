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
import { toast } from "sonner";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during logout:', error);
        toast.error('Error during logout');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during logout');
    } finally {
      // Always navigate to home page, even if logout fails
      navigate("/");
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      if (!session?.user.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Error loading profile');
          return;
        }

        if (data) {
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while loading profile');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [session?.user.id]);

  return (
    <header className="bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-end gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-10 h-10 rounded-full p-0 border border-transparent"
              disabled={loading}
            >
              {loading ? (
                <div className="w-full h-full rounded-full animate-pulse bg-primary/10" />
              ) : avatarUrl ? (
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
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer"
            >
              Dashboard
            </DropdownMenuItem>
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