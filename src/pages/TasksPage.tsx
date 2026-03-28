import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CheckCircle2, Circle, Clock, Zap, X } from "lucide-react";
import { mockTasks, Task } from "@/data/mockData";
import mascotIcon from "@/assets/mascot-icon.png";

type FilterType = "todas" | "hoje" | "pendentes" | "concluídas";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<FilterType>("todas");
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", category: "Pessoal", priority: "média" as Task["priority"], dueDate: "", dueTime: "" });

  const filtered = tasks.filter(t => {
    if (filter === "pendentes") return !t.done;
    if (filter === "concluídas") return t.done;
    if (filter === "hoje") return t.dueDate === new Date().toISOString().split("T")[0] && !t.done;
    return true;
  });

  const toggle = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const addTask = () => {
    if (!newTask.title.trim() || !newTask.dueDate) return;
    setTasks(prev => [...prev, {
      id: `t${Date.now()}`, title: newTask.title.trim(), category: newTask.category,
      priority: newTask.priority, dueDate: newTask.dueDate, dueTime: newTask.dueTime || undefined, done: false,
    }]);
    setNewTask({ title: "", category: "Pessoal", priority: "média", dueDate: "", dueTime: "" });
    setShowAdd(false);
  };

  const filters: { label: string; value: FilterType }[] = [
    { label: "Todas", value: "todas" }, { label: "Hoje", value: "hoje" },
    { label: "Pendentes", value: "pendentes" }, { label: "Concluídas", value: "concluídas" },
  ];
  const priorityColor = { alta: "bg-destructive", média: "bg-warning", baixa: "bg-accent" };
  const categories = ["Pessoal", "Estudos", "Finanças", "Carreira", "Saúde"];

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center active:scale-95 transition-transform">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Add task form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4 p-4 rounded-2xl bg-card border border-border/50 space-y-2">
          <input placeholder="O que você precisa fazer?" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
            className="w-full text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={newTask.dueDate} onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
              className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
            <input type="time" value={newTask.dueTime} onChange={e => setNewTask(p => ({ ...p, dueTime: e.target.value }))}
              className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex gap-2">
            <select value={newTask.category} onChange={e => setNewTask(p => ({ ...p, category: e.target.value }))}
              className="flex-1 text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value as Task["priority"] }))}
              className="flex-1 text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary">
              <option value="alta">Alta</option><option value="média">Média</option><option value="baixa">Baixa</option>
            </select>
          </div>
          <button onClick={addTask} className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium">Criar tarefa</button>
        </motion.div>
      )}

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
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] text-muted-foreground">{task.category}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${priorityColor[task.priority]}`} />
                  <span className="text-[10px] text-muted-foreground">{task.dueDate.slice(5).replace("-", "/")}</span>
                  {task.dueTime && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />{task.dueTime}
                    </span>
                  )}
                  {task.auto && (
                    <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-full text-secondary-foreground flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" />auto
                    </span>
                  )}
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
