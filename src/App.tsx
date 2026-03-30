import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/AppShell";
import OnboardingPage from "@/pages/OnboardingPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ChatPage from "@/pages/ChatPage";
import TasksPage from "@/pages/TasksPage";
import StudiesPage from "@/pages/StudiesPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import ComponentDetailPage from "@/pages/ComponentDetailPage";
import FinancesPage from "@/pages/FinancesPage";
import HabitsPage from "@/pages/HabitsPage";
import CareerPage from "@/pages/CareerPage";
// ProjectsPage removed
import CalendarPage from "@/pages/CalendarPage";
import ProfilePage from "@/pages/ProfilePage";
import NotificationsPage from "@/pages/NotificationsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const noShell = ["/", "/login"].includes(location.pathname);

  const content = (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/studies" element={<StudiesPage />} />
      <Route path="/finances" element={<FinancesPage />} />
      <Route path="/habits" element={<HabitsPage />} />
      <Route path="/career" element={<CareerPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return noShell ? content : <AppShell>{content}</AppShell>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
