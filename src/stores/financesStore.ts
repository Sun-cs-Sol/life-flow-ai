import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FinanceCategory = "Alimentação" | "Transporte" | "Lazer" | "Saúde" | "Educação" | "Outros";

export const FINANCE_CATEGORIES: FinanceCategory[] = ["Alimentação", "Transporte", "Lazer", "Saúde", "Educação", "Outros"];

export const CATEGORY_ICONS: Record<FinanceCategory, string> = {
  "Alimentação": "🍽️",
  "Transporte": "🚗",
  "Lazer": "🎮",
  "Saúde": "💊",
  "Educação": "📚",
  "Outros": "📦",
};

export interface FinanceTransaction {
  id: string;
  description: string;
  amount: number;
  category: FinanceCategory;
  date: string;
  bank?: string;
  paymentMethod?: "débito" | "crédito" | "pix";
  installments?: number;
  currentInstallment?: number;
  tag?: string;
  isIncome: boolean;
}

export interface CategoryBudget {
  category: FinanceCategory;
  limit: number;
}

interface FinancesStore {
  transactions: FinanceTransaction[];
  budgets: CategoryBudget[];
  monthlyIncome: number;

  addTransaction: (tx: Omit<FinanceTransaction, "id">) => void;
  removeTransaction: (id: string) => void;
  setBudget: (category: FinanceCategory, limit: number) => void;
  setMonthlyIncome: (income: number) => void;

  getMonthExpensesByCategory: (category: FinanceCategory) => number;
  getTotalMonthExpenses: () => number;
  getTotalMonthIncome: () => number;
  getBalance: () => number;
  getTodayExpenses: () => number;
}

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export const useFinancesStore = create<FinancesStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: FINANCE_CATEGORIES.map((c) => ({ category: c, limit: 0 })),
      monthlyIncome: 0,

      addTransaction: (tx) =>
        set((s) => ({
          transactions: [{ ...tx, id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }, ...s.transactions],
        })),

      removeTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      setBudget: (category, limit) =>
        set((s) => ({
          budgets: s.budgets.map((b) => (b.category === category ? { ...b, limit } : b)),
        })),

      setMonthlyIncome: (income) => set({ monthlyIncome: income }),

      getMonthExpensesByCategory: (category) => {
        const month = getCurrentMonth();
        return get()
          .transactions.filter((t) => !t.isIncome && t.category === category && t.date.startsWith(month))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      },

      getTotalMonthExpenses: () => {
        const month = getCurrentMonth();
        return get()
          .transactions.filter((t) => !t.isIncome && t.date.startsWith(month))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      },

      getTotalMonthIncome: () => {
        const month = getCurrentMonth();
        return get()
          .transactions.filter((t) => t.isIncome && t.date.startsWith(month))
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getBalance: () => {
        const { monthlyIncome } = get();
        const expenses = get().getTotalMonthExpenses();
        return monthlyIncome - expenses;
      },

      getTodayExpenses: () => {
        const today = new Date().toISOString().split("T")[0];
        return get()
          .transactions.filter((t) => !t.isIncome && t.date === today)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      },
    }),
    { name: "astra-finances" }
  )
);
