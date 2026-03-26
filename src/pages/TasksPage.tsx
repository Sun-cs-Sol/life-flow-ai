import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CheckCircle2, Circle, Filter } from "lucide-react";
import { mockTasks } from "@/data/mockData";

type Filter = "todas" | "hoje" | "pendentes" | "concluídas";

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [filter, setFilter] = useState<Filter>("todas");

  const filtered = tasks.filter(t => {
    if (filter === "pendentes") return !t.done;
    if (filter === "concluídas") return t.done;
    if (filter === "hoje") return t.dueDate === new Date().toISOString().split("T")[0] && !t.done;
    return true;
  });

  const toggle = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const filters: { label: string; value: Filter }[] = [
    { label: "Todas", value: "todas" },
    { label: "Hoje", value: "hoje" },
    { label: "Pendentes", value: "pendentes" },
    { label: "Concluídas", value: "concluídas" },
  ];

  const priorityColor = { alta: "bg-destructive", média: "bg-warning", baixa: "bg-success" };

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <button className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center active:scale-95 transition-transform">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.value ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >{f.label}</button>
        ))}
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {filtered.map((task, i) => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className={`flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 ${task.done ? "opacity-60" : ""}`}>
              <button onClick={() => toggle(task.id)}>
                {task.done ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">{task.category}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${priorityColor[task.priority]}`} />
                  <span className="text-[10px] text-muted-foreground">{task.dueDate.slice(5).replace("-", "/")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">Nenhuma tarefa encontrada</div>
      )}
    </div>
  );
}
