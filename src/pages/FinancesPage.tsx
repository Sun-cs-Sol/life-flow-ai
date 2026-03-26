import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";
import { mockFinances } from "@/data/mockData";

export default function FinancesPage() {
  const { balance, income, expenses, budget, transactions } = mockFinances;
  const budgetPct = Math.round((expenses / budget) * 100);

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Finanças</h1>

      {/* Balance card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-primary rounded-2xl p-5 text-primary-foreground mb-5"
      >
        <p className="text-sm opacity-80">Saldo atual</p>
        <p className="text-3xl font-bold mt-1">R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] opacity-70">Receitas</p>
              <p className="text-sm font-semibold">R$ {income.toLocaleString("pt-BR")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] opacity-70">Despesas</p>
              <p className="text-sm font-semibold">R$ {expenses.toLocaleString("pt-BR")}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Budget */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Orçamento do mês</h2>
          <span className="text-xs text-muted-foreground">{budgetPct}% utilizado</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-muted">
          <div className={`h-full rounded-full transition-all ${budgetPct > 80 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min(budgetPct, 100)}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">R$ {expenses.toLocaleString("pt-BR")} de R$ {budget.toLocaleString("pt-BR")}</p>
      </div>

      {/* Transactions */}
      <h2 className="text-sm font-semibold mb-3">Transações recentes</h2>
      <div className="space-y-2">
        {transactions.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50"
          >
            <span className="text-xl">{t.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t.description}</p>
              <p className="text-xs text-muted-foreground">{t.category} • {t.date}</p>
            </div>
            <span className={`text-sm font-semibold ${t.amount > 0 ? "text-success" : "text-foreground"}`}>
              {t.amount > 0 ? "+" : ""}R$ {Math.abs(t.amount).toLocaleString("pt-BR")}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
