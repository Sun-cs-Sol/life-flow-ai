import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FocusModeStore {
  isActive: boolean;
  activatedAt: string | null;
  pomodoroMinutes: number;
  pomodoroBreak: number;
  toggle: () => void;
  deactivate: () => void;
}

export const useFocusModeStore = create<FocusModeStore>()(
  persist(
    (set, get) => ({
      isActive: false,
      activatedAt: null,
      pomodoroMinutes: 25,
      pomodoroBreak: 5,

      toggle: () => {
        const { isActive } = get();
        if (isActive) {
          set({ isActive: false, activatedAt: null });
        } else {
          set({ isActive: true, activatedAt: new Date().toISOString() });
        }
      },

      deactivate: () => set({ isActive: false, activatedAt: null }),
    }),
    { name: "astra-focus-mode" }
  )
);
