import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTasks, type Task } from "@/data/mockData";

export type RecurrenceType = "diária" | "semanal" | "quinzenal" | "mensal_dia" | "mensal_semana" | "personalizado";

export interface RecurrencePattern {
  type: RecurrenceType;
  daysOfWeek?: number[]; // 0=Sun..6=Sat for semanal
  intervalDays?: number; // for personalizado
  dayOfMonth?: number; // for mensal_dia
  weekOfMonth?: number; // 1-5, 5=last, for mensal_semana
  dayOfWeekForMonth?: number; // 0-6 for mensal_semana
}

export interface RecurringTask {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: Task["priority"];
  recurrence: RecurrencePattern;
  time?: string;
  startDate: string;
  endDate?: string;
  paused: boolean;
  createdAt: string;
}

interface TasksStore {
  tasks: Task[];
  recurringTasks: RecurringTask[];

  addTask: (task: Omit<Task, "id">) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, data: Partial<Task>) => void;

  addRecurringTask: (rt: Omit<RecurringTask, "id" | "createdAt">) => void;
  updateRecurringTask: (id: string, data: Partial<RecurringTask>) => void;
  removeRecurringTask: (id: string) => void;
  pauseRecurringTask: (id: string) => void;

  generateOccurrences: (daysAhead: number) => Task[];
  getRecurrenceLabel: (r: RecurrencePattern) => string;
}

function getNextOccurrences(rt: RecurringTask, daysAhead: number): string[] {
  const dates: string[] = [];
  const start = new Date(rt.startDate);
  const now = new Date();
  const end = rt.endDate ? new Date(rt.endDate) : new Date(now.getTime() + daysAhead * 86400000);
  const limit = new Date(now.getTime() + daysAhead * 86400000);
  const finalDate = end < limit ? end : limit;

  if (rt.paused) return [];

  const current = new Date(Math.max(start.getTime(), now.getTime() - 86400000));
  current.setHours(0, 0, 0, 0);

  for (let d = new Date(current); d <= finalDate; d.setDate(d.getDate() + 1)) {
    if (d < start) continue;
    const dateStr = d.toISOString().split("T")[0];
    const dayOfWeek = d.getDay();
    const dayOfMonth = d.getDate();

    switch (rt.recurrence.type) {
      case "diária":
        dates.push(dateStr);
        break;
      case "semanal":
        if (rt.recurrence.daysOfWeek?.includes(dayOfWeek)) dates.push(dateStr);
        break;
      case "quinzenal": {
        const diffDays = Math.floor((d.getTime() - start.getTime()) / 86400000);
        if (diffDays % 15 === 0) dates.push(dateStr);
        break;
      }
      case "mensal_dia":
        if (dayOfMonth === (rt.recurrence.dayOfMonth || 1)) dates.push(dateStr);
        break;
      case "mensal_semana": {
        const targetDow = rt.recurrence.dayOfWeekForMonth ?? 0;
        const week = rt.recurrence.weekOfMonth ?? 1;
        if (dayOfWeek === targetDow) {
          const weekNum = Math.ceil(dayOfMonth / 7);
          if (week === 5) {
            // last occurrence
            const nextWeek = new Date(d);
            nextWeek.setDate(nextWeek.getDate() + 7);
            if (nextWeek.getMonth() !== d.getMonth()) dates.push(dateStr);
          } else if (weekNum === week) {
            dates.push(dateStr);
          }
        }
        break;
      }
      case "personalizado": {
        const diffDays = Math.floor((d.getTime() - start.getTime()) / 86400000);
        if (diffDays % (rt.recurrence.intervalDays || 1) === 0) dates.push(dateStr);
        break;
      }
    }
  }
  return dates;
}

const DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const useTasksStore = create<TasksStore>()(
  persist(
    (set, get) => ({
      tasks: [...mockTasks],
      recurringTasks: [],

      addTask: (task) =>
        set((s) => ({
          tasks: [...s.tasks, { ...task, id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }],
        })),

      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),

      removeTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      updateTask: (id, data) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),

      addRecurringTask: (rt) =>
        set((s) => ({
          recurringTasks: [
            ...s.recurringTasks,
            { ...rt, id: `rt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString() },
          ],
        })),

      updateRecurringTask: (id, data) =>
        set((s) => ({
          recurringTasks: s.recurringTasks.map((rt) => (rt.id === id ? { ...rt, ...data } : rt)),
        })),

      removeRecurringTask: (id) =>
        set((s) => ({ recurringTasks: s.recurringTasks.filter((rt) => rt.id !== id) })),

      pauseRecurringTask: (id) =>
        set((s) => ({
          recurringTasks: s.recurringTasks.map((rt) =>
            rt.id === id ? { ...rt, paused: !rt.paused } : rt
          ),
        })),

      generateOccurrences: (daysAhead) => {
        const { recurringTasks, tasks } = get();
        const generated: Task[] = [];
        recurringTasks.forEach((rt) => {
          const dates = getNextOccurrences(rt, daysAhead);
          dates.forEach((date) => {
            const existsAlready = tasks.some(
              (t) => t.title === rt.title && t.dueDate === date && t.auto
            );
            if (!existsAlready) {
              generated.push({
                id: `gen-${rt.id}-${date}`,
                title: rt.title,
                category: rt.category,
                priority: rt.priority,
                dueDate: date,
                dueTime: rt.time,
                done: false,
                auto: true,
              });
            }
          });
        });
        return generated;
      },

      getRecurrenceLabel: (r) => {
        switch (r.type) {
          case "diária": return "Todos os dias";
          case "semanal":
            return `Toda ${(r.daysOfWeek || []).map(d => DAYS_PT[d]).join(", ")}`;
          case "quinzenal": return "A cada 15 dias";
          case "mensal_dia": return `Todo dia ${r.dayOfMonth} do mês`;
          case "mensal_semana": {
            const weekLabel = r.weekOfMonth === 5 ? "última" : `${r.weekOfMonth}ª`;
            return `Toda ${weekLabel} ${DAYS_PT[r.dayOfWeekForMonth || 0]} do mês`;
          }
          case "personalizado": return `A cada ${r.intervalDays} dias`;
          default: return "Recorrência personalizada";
        }
      },
    }),
    { name: "astra-tasks" }
  )
);
