import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, MessageCircle, CheckSquare, BarChart3, User, BookOpen, TrendingUp, FolderKanban, Calendar, Bell } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/tasks", icon: CheckSquare, label: "Tarefas" },
  { path: "/chat", icon: MessageCircle, label: "Chat", primary: true },
  { path: "/finances", icon: BarChart3, label: "Finanças" },
  { path: "/profile", icon: User, label: "Perfil" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-lg">LifeOrg</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/notifications")} className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-destructive" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50 safe-bottom">
        <div className="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            if (tab.primary) {
              return (
                <button key={tab.path} onClick={() => navigate(tab.path)}
                  className="relative -mt-5 w-14 h-14 rounded-full gradient-primary shadow-lg flex items-center justify-center transition-transform active:scale-95"
                >
                  <tab.icon className="w-6 h-6 text-primary-foreground" />
                </button>
              );
            }
            return (
              <button key={tab.path} onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-colors"
              >
                <tab.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{tab.label}</span>
                {isActive && (
                  <motion.div layoutId="tab-indicator" className="w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
