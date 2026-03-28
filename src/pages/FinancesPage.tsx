import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Plus, CreditCard, Smartphone, Banknote, X } from "lucide-react";
import { mockFinances, Transaction } from "@/data/mockData";
import mascotIcon from "@/assets/mascot-icon.png";

type Tab = "resumo" | "entradas" | "saídas";

export default function FinancesPage() {
  const { balance, income, expenses, budget, transactions: initialTx } = mockFinances;
  const [transactions, setTransactions] = useState<Transaction[]>(initialTx);
  const [tab, setTab] = useState<Tab>("resumo");
  const [showAdd, setShowAdd] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [newTx, setNewTx] = useState({ description: "", amount: "", category: "Alimentação", bank: "Nubank", paymentMethod: "pix" as Transaction["paymentMethod"], tag: "", installments: "1" });
  const budgetPct = Math.round((expenses / budget) * 100);

  const paymentIcons = { débito: Banknote, crédito: CreditCard, pix: Smartphone };
  const categories = ["Alimentação", "Transporte", "Contas", "Lazer", "Educação", "Saúde", "Renda", "Renda Extra", "Outros"];
  const banks = ["Nubank", "Itaú", "Bradesco", "BB", "Caixa", "Inter", "C6"];

  const addTransaction = () => {
    if (!newTx.description || !newTx.amount) return;
    const amt = Number(newTx.amount);
    setTransactions(prev => [{
      id: `tx${Date.now()}`, description: newTx.description, amount: isIncome ? amt : -amt,
      category: newTx.category, date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      icon: isIncome ? "💰" : "💸", bank: newTx.bank, paymentMethod: newTx.paymentMethod, tag: newTx.tag,
      installments: Number(newTx.installments) > 1 ? Number(newTx.installments) : undefined,
      currentInstallment: Number(newTx.installments) > 1 ? 1 : undefined,
    }, ...prev]);
    setNewTx({ description: "", amount: "", category: "Alimentação", bank: "Nubank", paymentMethod: "pix", tag: "", installments: "1" });
    setShowAdd(false);
  };

  const filtered = tab === "entradas" ? transactions.filter(t => t.amount > 0) : tab === "saídas" ? transactions.filter(t => t.amount < 0) : transactions;

  const tabs: { label: string; value: Tab }[] = [
    { label: "Resumo", value: "resumo" }, { label: "Entradas", value: "entradas" }, { label: "Saídas", value: "saídas" },
  ];

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Finanças</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center active:scale-95 transition-transform">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Balance card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-dark rounded-2xl p-5 text-primary-foreground mb-5"
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

      {/* Add transaction */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4 p-4 rounded-2xl bg-card border border-border/50 space-y-2">
          <div className="flex gap-2 mb-2">
            <button onClick={() => setIsIncome(false)} className={`flex-1 py-2 rounded-xl text-xs font-medium ${!isIncome ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>Saída</button>
            <button onClick={() => setIsIncome(true)} className={`flex-1 py-2 rounded-xl text-xs font-medium ${isIncome ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>Entrada</button>
          </div>
          <input placeholder="Descrição" value={newTx.description} onChange={e => setNewTx(p => ({ ...p, description: e.target.value }))}
            className="w-full text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Valor" type="number" value={newTx.amount} onChange={e => setNewTx(p => ({ ...p, amount: e.target.value }))}
              className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
            <input placeholder="Tag" value={newTx.tag} onChange={e => setNewTx(p => ({ ...p, tag: e.target.value }))}
              className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select value={newTx.category} onChange={e => setNewTx(p => ({ ...p, category: e.target.value }))}
              className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={newTx.bank} onChange={e => setNewTx(p => ({ ...p, bank: e.target.value }))}
              className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary">
              {banks.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select value={newTx.paymentMethod} onChange={e => setNewTx(p => ({ ...p, paymentMethod: e.target.value as Transaction["paymentMethod"] }))}
              className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary">
              <option value="pix">Pix</option><option value="débito">Débito</option><option value="crédito">Crédito</option>
            </select>
            {newTx.paymentMethod === "crédito" && (
              <input placeholder="Parcelas" type="number" min="1" value={newTx.installments} onChange={e => setNewTx(p => ({ ...p, installments: e.target.value }))}
                className="text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
            )}
          </div>
          <button onClick={addTransaction} className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium">Registrar</button>
        </motion.div>
      )}

      {/* Budget */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Orçamento do mês</h2>
          <span className="text-xs text-muted-foreground">{budgetPct}% utilizado</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-muted">
          <div className={`h-full rounded-full transition-all ${budgetPct > 80 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min(budgetPct, 100)}%` }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${tab === t.value ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >{t.label}</button>
        ))}
      </div>

      {/* Transactions */}
      <div className="space-y-2">
        {filtered.map((t, i) => {
          const PayIcon = t.paymentMethod ? paymentIcons[t.paymentMethod] : null;
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50"
            >
              <span className="text-xl">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{t.description}</p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-[10px] text-muted-foreground">{t.category}</span>
                  {t.bank && <span className="text-[10px] text-muted-foreground">• {t.bank}</span>}
                  {t.paymentMethod && PayIcon && (
                    <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-full text-secondary-foreground flex items-center gap-0.5">
                      <PayIcon className="w-2.5 h-2.5" />{t.paymentMethod}
                    </span>
                  )}
                  {t.installments && <span className="text-[9px] text-muted-foreground">{t.currentInstallment}/{t.installments}x</span>}
                  <span className="text-[10px] text-muted-foreground">• {t.date}</span>
                </div>
              </div>
              <span className={`text-sm font-semibold ${t.amount > 0 ? "text-accent-foreground" : "text-foreground"}`}>
                {t.amount > 0 ? "+" : ""}R$ {Math.abs(t.amount).toLocaleString("pt-BR")}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
