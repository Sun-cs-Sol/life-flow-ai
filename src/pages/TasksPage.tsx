import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, CheckCircle2, Circle, Clock, Zap, RotateCcw, Pencil, Trash2, Pause, Play, CalendarDays, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTasksStore, type RecurrenceType, type RecurrencePattern, type RecurringTask } from "@/stores/tasksStore";
import type { Task } from "@/data/mockData";
import mascotIcon from "@/assets/mascot-icon.png";

type FilterType = "todas" | "hoje" | "pendentes" | "concluídas";
type View = "tarefas" | "recorrentes";

const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const categories = ["Pessoal", "Estudos", "Finanças", "Carreira", "Saúde"];

export default function TasksPage() {
  const store = useTasksStore();
  const { tasks, recurringTasks } = store;
  const [filter, setFilter] = useState<FilterType>("todas");
  const [view, setView] = useState<View>("tarefas");
  const [showAdd, setShowAdd] = useState(false);
  const [showRecAdd, setShowRecAdd] = useState(false);
  const [editingRt, setEditingRt] = useState<RecurringTask | null>(null);
  const [newTask, setNewTask] = useState({ title: "", category: "Pessoal", priority: "média" as Task["priority"], dueDate: "", dueTime: "" });

  const [rtForm, setRtForm] = useState({
    title: "", description: "", category: "Pessoal", priority: "média" as Task["priority"],
    recurrenceType: "diária" as RecurrenceType, time: "", startDate: new Date().toISOString().split("T")[0], endDate: "",
    daysOfWeek: [] as number[], intervalDays: "7", dayOfMonth: "1", weekOfMonth: "1", dayOfWeekForMonth: "1",
  });

  // Generate upcoming occurrences from recurring tasks
  const generatedTasks = useMemo(() => store.generateOccurrences(28), [recurringTasks, tasks]);
  const allTasks = useMemo(() => [...tasks, ...generatedTasks], [tasks, generatedTasks]);

  const filtered = allTasks.filter(t => {
    if (filter === "pendentes") return !t.done;
    if (filter === "concluídas") return t.done;
    if (filter === "hoje") return t.dueDate === new Date().toISOString().split("T")[0] && !t.done;
    return true;
  });

  const toggle = (id: string) => {
    if (id.startsWith("gen-")) {
      // Materialize generated task
      const task = generatedTasks.find(t => t.id === id);
      if (task) {
        store.addTask({ ...task, done: true });
      }
    } else {
      store.toggleTask(id);
    }
  };

  const addTask = () => {
    if (!newTask.title.trim() || !newTask.dueDate) return;
    store.addTask({
      title: newTask.title.trim(), category: newTask.category,
      priority: newTask.priority, dueDate: newTask.dueDate, dueTime: newTask.dueTime || undefined, done: false,
    });
    setNewTask({ title: "", category: "Pessoal", priority: "média", dueDate: "", dueTime: "" });
    setShowAdd(false);
    toast.success("Tarefa criada!");
  };

  const addRecurringTask = () => {
    if (!rtForm.title.trim() || !rtForm.startDate) return;
    const recurrence: RecurrencePattern = { type: rtForm.recurrenceType };
    if (rtForm.recurrenceType === "semanal") recurrence.daysOfWeek = rtForm.daysOfWeek;
    if (rtForm.recurrenceType === "personalizado") recurrence.intervalDays = Number(rtForm.intervalDays);
    if (rtForm.recurrenceType === "mensal_dia") recurrence.dayOfMonth = Number(rtForm.dayOfMonth);
    if (rtForm.recurrenceType === "mensal_semana") {
      recurrence.weekOfMonth = Number(rtForm.weekOfMonth);
      recurrence.dayOfWeekForMonth = Number(rtForm.dayOfWeekForMonth);
    }

    if (editingRt) {
      store.updateRecurringTask(editingRt.id, {
        title: rtForm.title.trim(), description: rtForm.description, category: rtForm.category,
        priority: rtForm.priority, recurrence, time: rtForm.time || undefined,
        startDate: rtForm.startDate, endDate: rtForm.endDate || undefined,
      });
      toast.success("Recorrência atualizada!");
    } else {
      store.addRecurringTask({
        title: rtForm.title.trim(), description: rtForm.description, category: rtForm.category,
        priority: rtForm.priority, recurrence, time: rtForm.time || undefined,
        startDate: rtForm.startDate, endDate: rtForm.endDate || undefined, paused: false,
      });
      toast.success("Tarefa recorrente criada!");
    }
    resetRtForm();
  };

  const resetRtForm = () => {
    setRtForm({
      title: "", description: "", category: "Pessoal", priority: "média",
      recurrenceType: "diária", time: "", startDate: new Date().toISOString().split("T")[0], endDate: "",
      daysOfWeek: [], intervalDays: "7", dayOfMonth: "1", weekOfMonth: "1", dayOfWeekForMonth: "1",
    });
    setEditingRt(null);
    setShowRecAdd(false);
  };

  const editRecurring = (rt: RecurringTask) => {
    setEditingRt(rt);
    setRtForm({
      title: rt.title, description: rt.description || "", category: rt.category,
      priority: rt.priority, recurrenceType: rt.recurrence.type,
      time: rt.time || "", startDate: rt.startDate, endDate: rt.endDate || "",
      daysOfWeek: rt.recurrence.daysOfWeek || [], intervalDays: String(rt.recurrence.intervalDays || 7),
      dayOfMonth: String(rt.recurrence.dayOfMonth || 1), weekOfMonth: String(rt.recurrence.weekOfMonth || 1),
      dayOfWeekForMonth: String(rt.recurrence.dayOfWeekForMonth || 1),
    });
    setShowRecAdd(true);
  };

  const toggleDow = (day: number) => {
    setRtForm(p => ({
      ...p,
      daysOfWeek: p.daysOfWeek.includes(day) ? p.daysOfWeek.filter(d => d !== day) : [...p.daysOfWeek, day],
    }));
  };

  const filters: { label: string; value: FilterType }[] = [
    { label: "Todas", value: "todas" }, { label: "Hoje", value: "hoje" },
    { label: "Pendentes", value: "pendentes" }, { label: "Concluídas", value: "concluídas" },
  ];
  const priorityColor = { alta: "bg-destructive", média: "bg-warning", baixa: "bg-accent" };

  return (
    <div className="px-4 py-5 max-w-lg mx-auto pb-28">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <div className="flex gap-2">
          <button onClick={() => setView(view === "tarefas" ? "recorrentes" : "tarefas")}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
            <RotateCcw className={`w-5 h-5 ${view === "recorrentes" ? "text-primary" : "text-muted-foreground"}`} />
          </button>
          <button onClick={() => view === "recorrentes" ? setShowRecAdd(true) : setShowAdd(!showAdd)}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center active:scale-95 transition-transform">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {view === "tarefas" ? (
        <>
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
                      <span className="text-xs text-muted-foreground">{task.category}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${priorityColor[task.priority]}`} />
                      <span className="text-xs text-muted-foreground">{task.dueDate.slice(5).replace("-", "/")}</span>
                      {task.dueTime && (
                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />{task.dueTime}
                        </span>
                      )}
                      {task.auto && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
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
            <div className="text-center py-12">
              <img src={mascotIcon} alt="Astra" className="w-16 h-16 mx-auto mb-3 mascot-img opacity-60" />
              <p className="text-sm text-muted-foreground">Nenhuma tarefa encontrada</p>
            </div>
          )}
        </>
      ) : (
        /* ===== RECURRING TASKS VIEW ===== */
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">Gerencie suas tarefas que se repetem automaticamente</p>
          {recurringTasks.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-60" />
              <p className="text-sm text-muted-foreground mb-2">Nenhuma tarefa recorrente</p>
              <button onClick={() => setShowRecAdd(true)} className="text-sm text-primary font-medium">Criar primeira recorrência →</button>
            </div>
          ) : (
            recurringTasks.map((rt) => (
              <div key={rt.id} className={`rounded-2xl bg-card border p-4 ${rt.paused ? "opacity-60 border-border/30" : "border-border/50"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold">{rt.title}</p>
                  <div className="flex gap-1">
                    <button onClick={() => editRecurring(rt)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={() => { store.pauseRecurringTask(rt.id); toast.success(rt.paused ? "Reativada!" : "Pausada!"); }}
                      className="p-1.5 rounded-lg hover:bg-muted">
                      {rt.paused ? <Play className="w-3.5 h-3.5 text-accent-foreground" /> : <Pause className="w-3.5 h-3.5 text-warning" />}
                    </button>
                    <button onClick={() => { store.removeRecurringTask(rt.id); toast.success("Removida!"); }}
                      className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{store.getRecurrenceLabel(rt.recurrence)}{rt.time ? ` às ${rt.time}` : ""}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{rt.category}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${priorityColor[rt.priority]}`} />
                  {rt.paused && <span className="text-xs bg-warning/20 text-warning px-1.5 py-0.5 rounded-full">pausada</span>}
                  {rt.endDate && <span className="text-xs text-muted-foreground">até {rt.endDate}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Recurring task dialog */}
      <Dialog open={showRecAdd} onOpenChange={(o) => { if (!o) resetRtForm(); else setShowRecAdd(true); }}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingRt ? "Editar recorrência" : "Nova tarefa recorrente"}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Título" value={rtForm.title} onChange={e => setRtForm(p => ({ ...p, title: e.target.value }))} />
            <Input placeholder="Descrição (opcional)" value={rtForm.description} onChange={e => setRtForm(p => ({ ...p, description: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <select value={rtForm.category} onChange={e => setRtForm(p => ({ ...p, category: e.target.value }))}
                className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={rtForm.priority} onChange={e => setRtForm(p => ({ ...p, priority: e.target.value as any }))}
                className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary">
                <option value="alta">Alta</option><option value="média">Média</option><option value="baixa">Baixa</option>
              </select>
            </div>
            <Input type="time" value={rtForm.time} onChange={e => setRtForm(p => ({ ...p, time: e.target.value }))} />
            <Select value={rtForm.recurrenceType} onValueChange={v => setRtForm(p => ({ ...p, recurrenceType: v as RecurrenceType }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="diária">Diária</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="quinzenal">Quinzenal</SelectItem>
                <SelectItem value="mensal_dia">Mensal (dia fixo)</SelectItem>
                <SelectItem value="mensal_semana">Mensal (dia da semana)</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {rtForm.recurrenceType === "semanal" && (
              <div className="flex gap-1.5 flex-wrap">
                {DAYS_PT.map((day, i) => (
                  <button key={i} onClick={() => toggleDow(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      rtForm.daysOfWeek.includes(i) ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >{day}</button>
                ))}
              </div>
            )}

            {rtForm.recurrenceType === "mensal_dia" && (
              <Input placeholder="Dia do mês" type="number" min="1" max="31" value={rtForm.dayOfMonth} onChange={e => setRtForm(p => ({ ...p, dayOfMonth: e.target.value }))} />
            )}

            {rtForm.recurrenceType === "mensal_semana" && (
              <div className="grid grid-cols-2 gap-2">
                <select value={rtForm.weekOfMonth} onChange={e => setRtForm(p => ({ ...p, weekOfMonth: e.target.value }))}
                  className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50">
                  <option value="1">1ª semana</option><option value="2">2ª semana</option><option value="3">3ª semana</option>
                  <option value="4">4ª semana</option><option value="5">Última</option>
                </select>
                <select value={rtForm.dayOfWeekForMonth} onChange={e => setRtForm(p => ({ ...p, dayOfWeekForMonth: e.target.value }))}
                  className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50">
                  {DAYS_PT.map((d, i) => <option key={i} value={String(i)}>{d}</option>)}
                </select>
              </div>
            )}

            {rtForm.recurrenceType === "personalizado" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">A cada</span>
                <Input type="number" min="1" value={rtForm.intervalDays} onChange={e => setRtForm(p => ({ ...p, intervalDays: e.target.value }))} className="w-20" />
                <span className="text-sm text-muted-foreground">dias</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Início</label>
                <Input type="date" value={rtForm.startDate} onChange={e => setRtForm(p => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Fim (opcional)</label>
                <Input type="date" value={rtForm.endDate} onChange={e => setRtForm(p => ({ ...p, endDate: e.target.value }))} />
              </div>
            </div>

            <button onClick={addRecurringTask} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">
              {editingRt ? "Salvar alterações" : "Criar recorrência"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
