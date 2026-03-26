import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, CheckSquare, BookOpen, Wallet, Flame, TrendingUp, FolderKanban, Calendar, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { mockTasks, mockHabits, mockFinances, mockSubjects } from "@/data/mockData";

const quickModules = [
  { icon: CheckSquare, label: "Tarefas", path: "/tasks", color: "text-info" },
  { icon: BookOpen, label: "Estudos", path: "/studies", color: "text-primary" },
  { icon: Wallet, label: "Finanças", path: "/finances", color: "text-warning" },
  { icon: Flame, label: "Hábitos", path: "/habits", color: "text-destructive" },
  { icon: TrendingUp, label: "Carreira", path: "/career", color: "text-success" },
  { icon: FolderKanban, label: "Projetos", path: "/projects", color: "text-accent-foreground" },
  { icon: Calendar, label: "Agenda", path: "/calendar", color: "text-info" },
];

const Card = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={`bg-card rounded-2xl border border-border/50 p-4 ${onClick ? "cursor-pointer active:scale-[0.98] transition-transform" : ""} ${className}`}>
    {children}
  </div>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const todayTasks = mockTasks.filter(t => !t.done).slice(0, 3);
  const pendingHabits = mockHabits.filter(h => !h.done);
  const doneHabits = mockHabits.filter(h => h.done).length;
  const nextExam = mockSubjects[0];

  return (
    <div className="px-4 py-5 space-y-5 max-w-lg mx-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-muted-foreground text-sm">Olá, Lucas 👋</p>
        <h1 className="text-2xl font-bold mt-0.5">Seu dia organizado</h1>
      </motion.div>

      {/* Chat CTA */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card onClick={() => navigate("/chat")} className="gradient-primary !border-0 !text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Chat inteligente</p>
              <p className="text-xs opacity-80">Fale o que precisa e eu organizo pra você</p>
            </div>
            <ArrowRight className="w-5 h-5 opacity-60" />
          </div>
        </Card>
      </motion.div>

      {/* Quick modules */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {quickModules.map((m) => (
            <button key={m.path} onClick={() => navigate(m.path)}
              className="flex flex-col items-center gap-1.5 min-w-[64px] py-2 px-1 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Upcoming exam alert */}
      {nextExam && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card onClick={() => navigate("/studies")} className="!border-warning/30 bg-warning/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-warning">Prova amanhã</p>
                <p className="font-semibold text-sm">{nextExam.name}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Tasks today */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Tarefas de hoje</h2>
          <button onClick={() => navigate("/tasks")} className="text-xs text-primary font-medium">Ver todas</button>
        </div>
        <div className="space-y-2">
          {todayTasks.map((task) => (
            <Card key={task.id} className="!p-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${task.priority === "alta" ? "bg-destructive" : task.priority === "média" ? "bg-warning" : "bg-success"}`} />
                <span className="flex-1 text-sm font-medium">{task.title}</span>
                <span className="text-xs text-muted-foreground">{task.category}</span>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Habits */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Hábitos</h2>
          <span className="text-xs text-muted-foreground">{doneHabits}/{mockHabits.length} hoje</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {mockHabits.map((h) => (
            <div key={h.id} className={`min-w-[80px] flex flex-col items-center gap-1.5 p-3 rounded-2xl border ${h.done ? "bg-primary/5 border-primary/30" : "bg-card border-border/50"}`}>
              <span className="text-xl">{h.icon}</span>
              <span className="text-[10px] font-medium text-center">{h.name}</span>
              {h.done && <span className="text-[9px] text-primary font-semibold">✓ Feito</span>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Finance summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card onClick={() => navigate("/finances")}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-sm">Finanças</h2>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">R$ {mockFinances.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">+R$ {mockFinances.income.toLocaleString("pt-BR")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-xs text-muted-foreground">-R$ {mockFinances.expenses.toLocaleString("pt-BR")}</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
