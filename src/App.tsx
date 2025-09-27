import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Assessment from "./pages/Assessment";
import Lessons from "./pages/Lessons";
import Schedule from "./pages/Schedule";
import Materials from "./pages/Materials";
import Forum from "./pages/Forum";
import Settings from "./pages/Settings";
import AITutor from "./pages/AITutor";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Auth />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
