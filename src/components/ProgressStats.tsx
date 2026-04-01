import { Flame, CheckCircle2, TrendingUp } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { mockHabits } from "@/data/mockData";

interface ProgressStatsProps {
  compact?: boolean;
}

export default function ProgressStats({ compact = false }: ProgressStatsProps) {
  const { streak, tasksCompletedThisWeek } = useUserStore();
  const habitsCompleted = mockHabits.filter(h => h.done).length;
  const habitsTotal = mockHabits.length;
  const habitsPct = habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0;

  if (compact) {
    return (
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl bg-card border border-border/50 p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-4 h-4 text-destructive" />
            <span className="text-lg font-bold">{streak}</span>
          </div>
          <span className="text-xs text-muted-foreground">dias seguidos</span>
        </div>
        <div className="flex-1 rounded-xl bg-card border border-border/50 p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-lg font-bold">{tasksCompletedThisWeek}</span>
          </div>
          <span className="text-xs text-muted-foreground">tarefas na semana</span>
        </div>
        <div className="flex-1 rounded-xl bg-card border border-border/50 p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-accent-foreground" />
            <span className="text-lg font-bold">{habitsPct}%</span>
          </div>
          <span className="text-xs text-muted-foreground">hábitos hoje</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-base">Seu progresso</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border/50 p-4">
          <Flame className="w-6 h-6 text-destructive mb-2" />
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-sm text-muted-foreground">dias de sequência</p>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 p-4">
          <CheckCircle2 className="w-6 h-6 text-primary mb-2" />
          <p className="text-2xl font-bold">{tasksCompletedThisWeek}</p>
          <p className="text-sm text-muted-foreground">tarefas esta semana</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Hábitos de hoje</span>
          <span className="text-sm font-bold text-primary">{habitsCompleted}/{habitsTotal}</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${habitsPct}%` }} />
        </div>
      </div>
    </div>
  );
}
