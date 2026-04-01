import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, CheckSquare, BookOpen, Wallet, Flame, TrendingUp, Calendar, ArrowRight, ChevronRight, Clock, Target } from "lucide-react";
import { mockTasks, mockHabits, mockSubjects } from "@/data/mockData";
import { useUserStore } from "@/stores/userStore";
import { useFinancesStore } from "@/stores/financesStore";
import { useFocusModeStore } from "@/stores/focusModeStore";
import DailyBriefing from "@/components/DailyBriefing";
import ProgressStats from "@/components/ProgressStats";
import PomodoroTimer from "@/components/PomodoroTimer";
import mascotIcon from "@/assets/mascot-icon.png";

const quickModules = [
  { icon: CheckSquare, label: "Tarefas", path: "/tasks" },
  { icon: BookOpen, label: "Estudos", path: "/studies" },
  { icon: Wallet, label: "Finanças", path: "/finances" },
  { icon: Flame, label: "Hábitos", path: "/habits" },
  { icon: TrendingUp, label: "Carreira", path: "/career" },
  { icon: Calendar, label: "Agenda", path: "/calendar" },
];

const Card = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div onClick={onClick} className={`bg-card rounded-2xl border border-border/50 p-4 ${onClick ? "cursor-pointer active:scale-[0.98] transition-transform" : ""} ${className}`}>
    {children}
  </div>
);

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { name, weeklyGoal, recordVisit } = useUserStore();
  const todayExpenses = useFinancesStore(s => s.getTodayExpenses());
  const balance = useFinancesStore(s => s.getBalance());
  const focusActive = useFocusModeStore(s => s.isActive);

  useEffect(() => { recordVisit(); }, [recordVisit]);

  const displayName = name || "Lucas";
  const todayTasks = mockTasks.filter(t => !t.done).slice(0, 3);
  const doneHabits = mockHabits.filter(h => h.done).length;
  const nextExam = mockSubjects[0];

  const delay = (i: number) => ({ delay: i * 0.05 });

  return (
    <div className="px-4 py-5 space-y-5 max-w-lg mx-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-muted-foreground text-sm">{getGreeting()}, {displayName} 👋</p>
        <h1 className="text-2xl font-bold mt-0.5">Atividades do dia</h1>
      </motion.div>

      {/* Daily Briefing */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(1)}>
        <DailyBriefing />
      </motion.div>

      {/* Pomodoro (if focus mode) */}
      {focusActive && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(1)}>
          <PomodoroTimer />
        </motion.div>
      )}

      {/* Chat CTA */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(2)}>
        <Card onClick={() => navigate("/chat")} className="gradient-primary !border-0 !text-primary-foreground">
          <div className="flex items-center gap-3">
            <img src={mascotIcon} alt="Astra" className="w-11 h-11 rounded-xl mascot-img" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Falar com Astra</p>
              <p className="text-xs opacity-80">Fale o que precisa e eu organizo pra você</p>
            </div>
            <ArrowRight className="w-5 h-5 opacity-60" />
          </div>
        </Card>
      </motion.div>

      {/* Quick modules */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(3)}>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {quickModules.map((m) => (
            <button key={m.path} onClick={() => navigate(m.path)}
              className="flex flex-col items-center gap-1.5 min-w-[64px] py-2 px-1 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                <m.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Weekly goal */}
      {weeklyGoal && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(3)}>
          <Card className="!border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-primary">Objetivo da semana</p>
                <p className="text-sm font-medium">{weeklyGoal}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Today summary card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(4)}>
        <Card>
          <h2 className="font-semibold text-sm mb-3">📅 Resumo de hoje</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{todayTasks.length}</p>
              <p className="text-xs text-muted-foreground">tarefas</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-accent-foreground">{doneHabits}/{mockHabits.length}</p>
              <p className="text-xs text-muted-foreground">hábitos</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-destructive">R${todayExpenses.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">gastos</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Upcoming exam */}
      {nextExam && !focusActive && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(5)}>
          <Card onClick={() => navigate("/studies")} className="!border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-primary">Prova amanhã</p>
                <p className="font-semibold text-sm">{nextExam.name}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Pending tasks */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(6)}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Tarefas pendentes</h2>
          <button onClick={() => navigate("/tasks")} className="text-xs text-primary font-medium">Ver todas</button>
        </div>
        {todayTasks.length === 0 ? (
          <Card className="text-center py-6">
            <p className="text-muted-foreground text-sm mb-2">Nenhuma tarefa pendente 🎉</p>
            <p className="text-xs text-muted-foreground">Use o botão + para adicionar</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <Card key={task.id} className="!p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${task.priority === "alta" ? "bg-destructive" : task.priority === "média" ? "bg-warning" : "bg-accent"}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block truncate">{task.title}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{task.category}</span>
                      {task.dueTime && (
                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />{task.dueTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* Habits */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(7)}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Hábitos</h2>
          <span className="text-xs text-muted-foreground">{doneHabits}/{mockHabits.length} hoje</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {mockHabits.map((h) => (
            <div key={h.id} className={`min-w-[80px] flex flex-col items-center gap-1.5 p-3 rounded-2xl border ${h.done ? "bg-primary/5 border-primary/30" : "bg-card border-border/50"}`}>
              <span className="text-xl">{h.icon}</span>
              <span className="text-xs font-medium text-center">{h.name}</span>
              {h.done && <span className="text-xs text-primary font-semibold">✓ Feito</span>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(8)}>
        <ProgressStats compact />
      </motion.div>

      {/* Finance summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={delay(9)}>
        <Card onClick={() => navigate("/finances")}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-sm">Finanças</h2>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Saldo disponível este mês</p>
        </Card>
      </motion.div>
    </div>
  );
}
