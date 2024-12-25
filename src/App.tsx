import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthForm } from "./components/auth/AuthForm";
import { OnboardingForm } from "./components/auth/OnboardingForm";
import { Dashboard } from "./components/dashboard/Dashboard";
import { RoleplaySession } from "./components/roleplay/RoleplaySession";
import { Header } from "./components/layout/Header";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkOnboardingStatus(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkOnboardingStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboardingStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setOnboardingCompleted(data.onboarding_completed);
    }
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route
                path="/"
                element={
                  session ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <AuthForm />
                  )
                }
              />
              <Route
                path="/onboarding"
                element={
                  session ? (
                    onboardingCompleted ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <OnboardingForm />
                    )
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  session ? (
                    onboardingCompleted === false ? (
                      <Navigate to="/onboarding" replace />
                    ) : (
                      <>
                        <Header />
                        <Dashboard />
                      </>
                    )
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/roleplay"
                element={
                  session ? (
                    onboardingCompleted === false ? (
                      <Navigate to="/onboarding" replace />
                    ) : (
                      <>
                        <Header />
                        <RoleplaySession />
                      </>
                    )
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;