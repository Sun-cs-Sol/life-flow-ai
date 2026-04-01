import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  name: string;
  priorities: string[];
  weeklyGoal: string;
  onboardingComplete: boolean;
  streak: number;
  lastVisitDate: string;
  tasksCompletedThisWeek: number;
  weekStart: string;
}

interface UserStore extends UserProfile {
  setName: (name: string) => void;
  setPriorities: (priorities: string[]) => void;
  setWeeklyGoal: (goal: string) => void;
  completeOnboarding: () => void;
  recordVisit: () => void;
  incrementTasksCompleted: () => void;
}

const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff)).toISOString().split("T")[0];
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      name: "",
      priorities: [],
      weeklyGoal: "",
      onboardingComplete: false,
      streak: 0,
      lastVisitDate: "",
      tasksCompletedThisWeek: 0,
      weekStart: getWeekStart(),

      setName: (name) => set({ name }),
      setPriorities: (priorities) => set({ priorities }),
      setWeeklyGoal: (goal) => set({ weeklyGoal: goal }),
      completeOnboarding: () => set({ onboardingComplete: true }),

      recordVisit: () => {
        const today = new Date().toISOString().split("T")[0];
        const { lastVisitDate, streak } = get();
        const currentWeek = getWeekStart();

        if (lastVisitDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const newStreak = lastVisitDate === yesterdayStr ? streak + 1 : 1;
        const resetWeekTasks = currentWeek !== get().weekStart;

        set({
          lastVisitDate: today,
          streak: newStreak,
          weekStart: currentWeek,
          ...(resetWeekTasks ? { tasksCompletedThisWeek: 0 } : {}),
        });
      },

      incrementTasksCompleted: () =>
        set((s) => ({ tasksCompletedThisWeek: s.tasksCompletedThisWeek + 1 })),
    }),
    { name: "astra-user" }
  )
);
