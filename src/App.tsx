import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import OnboardingProcess from "./pages/OnboardingProcess";
import YouthDashboard from "./pages/YouthDashboard";
import SavingsGoalsManager from "./pages/SavingsGoalsManager";
import TransactionHistoryAndInsights from "./pages/TransactionHistoryAndInsights";
import ProfileAndParentalHub from "./pages/ProfileAndParentalHub";
import ParentDashboard from "./pages/ParentDashboard"; // Added import
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists in src/pages/

const queryClient = new QueryClient();

// Simple mock auth status (replace with actual auth logic)
const isAuthenticated = () => {
  // For demo, assume logged in if they've seen onboarding.
  // In a real app, this would check a token, context, etc.
  return localStorage.getItem("onboardingComplete") === "true";
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* If not authenticated and onboarding not complete, go to onboarding */}
          {/* This is a basic example; real auth flow would be more robust */}
          <Route path="/" element={
            isAuthenticated() ? <Navigate to="/youth-dashboard" /> : <Navigate to="/onboarding-process" />
          } />
          
          <Route path="/onboarding-process" element={<OnboardingProcess />} />
          
          {/* Protected Routes Example (redirect if not authenticated) */}
          <Route path="/youth-dashboard" element={isAuthenticated() ? <YouthDashboard /> : <Navigate to="/onboarding-process" />} />
          <Route path="/parent-dashboard" element={isAuthenticated() ? <ParentDashboard /> : <Navigate to="/onboarding-process" />} /> {/* Added route */}
          <Route path="/savings-goals-manager" element={isAuthenticated() ? <SavingsGoalsManager /> : <Navigate to="/onboarding-process" />} />
          <Route path="/transaction-history-and-insights" element={isAuthenticated() ? <TransactionHistoryAndInsights /> : <Navigate to="/onboarding-process" />} />
          <Route path="/profile-and-parental-hub" element={isAuthenticated() ? <ProfileAndParentalHub /> : <Navigate to="/onboarding-process" />} />
          
          {/* Fallback for any undefined paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;