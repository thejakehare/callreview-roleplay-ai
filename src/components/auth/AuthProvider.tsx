import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  onboardingCompleted: boolean | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const handleInvalidSession = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setOnboardingCompleted(null);
      navigate("/");
      toast.error("Your session has expired. Please log in again.");
    } catch (error) {
      console.error("Error handling invalid session:", error);
      // Still clear the session state and redirect even if signOut fails
      setSession(null);
      setOnboardingCompleted(null);
      navigate("/");
    }
  };

  const checkOnboardingStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116') {
          // Handle invalid session
          await handleInvalidSession();
          return;
        }
        console.error('Error checking onboarding status:', error);
        toast.error('Error checking onboarding status');
        return;
      }

      setOnboardingCompleted(data?.onboarding_completed ?? false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while checking onboarding status');
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        handleInvalidSession();
        return;
      }
      setSession(session);
      if (session) {
        checkOnboardingStatus(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        checkOnboardingStatus(session.user.id);
      }
    });

    // Subscribe to realtime changes on profiles table
    const profileSubscription = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: session ? `id=eq.${session.user.id}` : undefined,
        },
        async (payload) => {
          if (payload.new && typeof payload.new.onboarding_completed === 'boolean') {
            setOnboardingCompleted(payload.new.onboarding_completed);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      profileSubscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ session, loading, onboardingCompleted }}>
      {children}
    </AuthContext.Provider>
  );
};