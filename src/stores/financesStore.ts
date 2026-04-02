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
  creditCardId?: string;
  auto?: boolean;
}

export interface CategoryBudget {
  category: FinanceCategory;
  limit: number;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category: FinanceCategory;
  paymentMethod: "débito" | "crédito";
  creditCardId?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  totalLimit: number;
  closingDay: number;
  usedAmount: number;
  pendingBill?: number;
  billPaid?: boolean;
}

export interface Investment {
  id: string;
  name: string;
  type: "Renda Fixa" | "Renda Variável" | "Cripto" | "Outro";
  amountInvested: number;
  startDate: string;
  expectedReturn: number;
  returnPeriod: "mensal" | "anual";
}

interface FinancesStore {
  transactions: FinanceTransaction[];
  budgets: CategoryBudget[];
  monthlyIncome: number;
  debitBalance: number;
  fixedExpenses: FixedExpense[];
  creditCards: CreditCard[];
  investments: Investment[];
  lastAutoRunDate: string;

  addTransaction: (tx: Omit<FinanceTransaction, "id">) => void;
  removeTransaction: (id: string) => void;
  setBudget: (category: FinanceCategory, limit: number) => void;
  setMonthlyIncome: (income: number) => void;
  setDebitBalance: (balance: number) => void;

  addFixedExpense: (fe: Omit<FixedExpense, "id">) => void;
  updateFixedExpense: (id: string, fe: Partial<FixedExpense>) => void;
  removeFixedExpense: (id: string) => void;

  addCreditCard: (card: Omit<CreditCard, "id" | "usedAmount" | "pendingBill" | "billPaid">) => void;
  updateCreditCard: (id: string, card: Partial<CreditCard>) => void;
  removeCreditCard: (id: string) => void;
  chargeCreditCard: (cardId: string, amount: number) => void;
  payBill: (cardId: string) => void;
  closeBill: (cardId: string) => void;

  addInvestment: (inv: Omit<Investment, "id">) => void;
  updateInvestment: (id: string, inv: Partial<Investment>) => void;
  removeInvestment: (id: string) => void;

  getMonthExpensesByCategory: (category: FinanceCategory) => number;
  getTotalMonthExpenses: () => number;
  getTotalMonthIncome: () => number;
  getBalance: () => number;
  getTodayExpenses: () => number;
  getTotalFixedExpenses: () => number;
  getUpcomingFixedExpenses: (days: number) => FixedExpense[];
  getCreditCardAvailable: (cardId: string) => number;
  getTotalInvested: () => number;
  getEstimatedInvestmentValue: (inv: Investment) => number;
  getFinancialSummary: () => string;

  runAutoExpenses: () => void;
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
      debitBalance: 0,
      fixedExpenses: [],
      creditCards: [],
      investments: [],
      lastAutoRunDate: "",

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
      setDebitBalance: (balance) => set({ debitBalance: balance }),

      // Fixed expenses
      addFixedExpense: (fe) =>
        set((s) => ({
          fixedExpenses: [...s.fixedExpenses, { ...fe, id: `fe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }],
        })),

      updateFixedExpense: (id, fe) =>
        set((s) => ({
          fixedExpenses: s.fixedExpenses.map((f) => (f.id === id ? { ...f, ...fe } : f)),
        })),

      removeFixedExpense: (id) =>
        set((s) => ({ fixedExpenses: s.fixedExpenses.filter((f) => f.id !== id) })),

      // Credit cards
      addCreditCard: (card) =>
        set((s) => ({
          creditCards: [...s.creditCards, { ...card, id: `cc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, usedAmount: 0, pendingBill: 0, billPaid: false }],
        })),

      updateCreditCard: (id, card) =>
        set((s) => ({
          creditCards: s.creditCards.map((c) => (c.id === id ? { ...c, ...card } : c)),
        })),

      removeCreditCard: (id) =>
        set((s) => ({ creditCards: s.creditCards.filter((c) => c.id !== id) })),

      chargeCreditCard: (cardId, amount) =>
        set((s) => ({
          creditCards: s.creditCards.map((c) =>
            c.id === cardId ? { ...c, usedAmount: c.usedAmount + amount } : c
          ),
        })),

      closeBill: (cardId) =>
        set((s) => ({
          creditCards: s.creditCards.map((c) =>
            c.id === cardId ? { ...c, pendingBill: c.usedAmount, usedAmount: 0, billPaid: false } : c
          ),
        })),

      payBill: (cardId) => {
        const card = get().creditCards.find((c) => c.id === cardId);
        if (!card || !card.pendingBill) return;
        set((s) => ({
          debitBalance: s.debitBalance - (card.pendingBill || 0),
          creditCards: s.creditCards.map((c) =>
            c.id === cardId ? { ...c, pendingBill: 0, billPaid: true } : c
          ),
        }));
        get().addTransaction({
          description: `Fatura ${card.name} paga`,
          amount: -(card.pendingBill || 0),
          category: "Outros",
          date: new Date().toISOString().split("T")[0],
          isIncome: false,
          paymentMethod: "débito",
          auto: true,
        });
      },

      // Investments
      addInvestment: (inv) =>
        set((s) => ({
          investments: [...s.investments, { ...inv, id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }],
        })),

      updateInvestment: (id, inv) =>
        set((s) => ({
          investments: s.investments.map((i) => (i.id === id ? { ...i, ...inv } : i)),
        })),

      removeInvestment: (id) =>
        set((s) => ({ investments: s.investments.filter((i) => i.id !== id) })),

      // Getters
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

      getTotalFixedExpenses: () => {
        return get().fixedExpenses.reduce((sum, f) => sum + f.amount, 0);
      },

      getUpcomingFixedExpenses: (days) => {
        const today = new Date().getDate();
        return get().fixedExpenses.filter((f) => {
          const diff = f.dueDay - today;
          return diff >= 0 && diff <= days;
        });
      },

      getCreditCardAvailable: (cardId) => {
        const card = get().creditCards.find((c) => c.id === cardId);
        if (!card) return 0;
        return card.totalLimit - card.usedAmount;
      },

      getTotalInvested: () => {
        return get().investments.reduce((sum, i) => sum + i.amountInvested, 0);
      },

      getEstimatedInvestmentValue: (inv) => {
        const now = new Date();
        const start = new Date(inv.startDate);
        const monthsDiff = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
        const monthlyRate = inv.returnPeriod === "anual" ? inv.expectedReturn / 12 / 100 : inv.expectedReturn / 100;
        return inv.amountInvested * Math.pow(1 + monthlyRate, Math.max(monthsDiff, 0));
      },

      getFinancialSummary: () => {
        const s = get();
        const totalFixed = s.getTotalFixedExpenses();
        const monthExpenses = s.getTotalMonthExpenses();
        const cards = s.creditCards.map(c => `${c.name}: usado R$${c.usedAmount.toFixed(2)} de R$${c.totalLimit.toFixed(2)}`).join("; ");
        const invs = s.investments.map(i => `${i.name} (${i.type}): R$${i.amountInvested.toFixed(2)}, rentab. ${i.expectedReturn}% ${i.returnPeriod}`).join("; ");
        const topCats = FINANCE_CATEGORIES.map(c => ({ c, v: s.getMonthExpensesByCategory(c) })).filter(x => x.v > 0).sort((a, b) => b.v - a.v).slice(0, 3).map(x => `${x.c}: R$${x.v.toFixed(2)}`).join(", ");

        return `Renda mensal: R$${s.monthlyIncome.toFixed(2)}. Gastos fixos totais: R$${totalFixed.toFixed(2)}. Gastos do mês: R$${monthExpenses.toFixed(2)}. Saldo débito: R$${s.debitBalance.toFixed(2)}. Cartões: ${cards || "nenhum"}. Investimentos: ${invs || "nenhum"}. Categorias mais gastas: ${topCats || "nenhuma"}.`;
      },

      runAutoExpenses: () => {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        const { lastAutoRunDate, fixedExpenses } = get();
        if (lastAutoRunDate === todayStr) return;

        const todayDay = today.getDate();
        fixedExpenses.forEach((fe) => {
          if (fe.dueDay === todayDay) {
            const alreadyExists = get().transactions.some(
              (t) => t.auto && t.description === fe.name && t.date === todayStr
            );
            if (!alreadyExists) {
              get().addTransaction({
                description: fe.name,
                amount: -fe.amount,
                category: fe.category,
                date: todayStr,
                isIncome: false,
                paymentMethod: fe.paymentMethod,
                creditCardId: fe.creditCardId,
                auto: true,
              });
              if (fe.paymentMethod === "débito") {
                set((s) => ({ debitBalance: s.debitBalance - fe.amount }));
              } else if (fe.paymentMethod === "crédito" && fe.creditCardId) {
                get().chargeCreditCard(fe.creditCardId, fe.amount);
              }
            }
          }
        });

        // Auto close bills on closing day
        get().creditCards.forEach((card) => {
          if (card.closingDay === todayDay && card.usedAmount > 0) {
            get().closeBill(card.id);
          }
        });

        set({ lastAutoRunDate: todayStr });
      },
    }),
    { name: "astra-finances" }
  )
);
