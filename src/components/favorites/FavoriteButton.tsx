import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface FavoriteButtonProps {
  sessionId: string;
  initialFavorited?: boolean;
}

export const FavoriteButton = ({ sessionId, initialFavorited = false }: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event from firing
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to favorite sessions");
        return;
      }

      if (isFavorited) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("session_id", sessionId)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("Removed from favorites");
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ 
            session_id: sessionId,
            user_id: user.id  // Add the user_id when creating a favorite
          });

        if (error) throw error;
        toast.success("Added to favorites");
      }

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFavorite}
      disabled={isLoading}
      className="h-8 w-8"
    >
      <Star
        className={`h-5 w-5 ${
          isFavorited ? "fill-primary text-primary" : "text-muted-foreground"
        }`}
      />
    </Button>
  );
};