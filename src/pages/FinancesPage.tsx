import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet, Settings2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  useFinancesStore,
  FINANCE_CATEGORIES,
  CATEGORY_ICONS,
  type FinanceCategory,
  type FinanceTransaction,
} from "@/stores/financesStore";
import mascotIcon from "@/assets/mascot-icon.png";

type Tab = "resumo" | "entradas" | "saídas" | "orçamento";

const BANKS = ["Nubank", "Itaú", "Bradesco", "BB", "Caixa", "Inter", "C6"];

export default function FinancesPage() {
  const store = useFinancesStore();
  const { transactions, budgets, monthlyIncome, addTransaction, setBudget, setMonthlyIncome } = store;
  const [tab, setTab] = useState<Tab>("resumo");
  const [addOpen, setAddOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", category: "Alimentação" as FinanceCategory, bank: "Nubank", paymentMethod: "pix" as FinanceTransaction["paymentMethod"], tag: "", installments: "1" });

  const totalExpenses = store.getTotalMonthExpenses();
  const totalIncome = store.getTotalMonthIncome();
  const balance = monthlyIncome > 0 ? monthlyIncome - totalExpenses : totalIncome - totalExpenses;

  const handleAdd = () => {
    if (!form.description || !form.amount) return;
    const amt = Number(form.amount);
    addTransaction({
      description: form.description,
      amount: isIncome ? amt : -amt,
      category: form.category,
      date: new Date().toISOString().split("T")[0],
      isIncome,
      bank: form.bank,
      paymentMethod: form.paymentMethod,
      tag: form.tag,
      installments: Number(form.installments) > 1 ? Number(form.installments) : undefined,
      currentInstallment: Number(form.installments) > 1 ? 1 : undefined,
    });

    // Check budget alert
    if (!isIncome) {
      const budget = budgets.find(b => b.category === form.category);
      if (budget && budget.limit > 0) {
        const spent = store.getMonthExpensesByCategory(form.category);
        const pct = (spent / budget.limit) * 100;
        if (pct >= 80) {
          toast.warning(`⚠️ ${form.category}: ${Math.round(pct)}% do orçamento usado!`);
        }
      }
    }

    toast.success(isIncome ? "Receita registrada!" : "Gasto registrado!");
    setForm({ description: "", amount: "", category: "Alimentação", bank: "Nubank", paymentMethod: "pix", tag: "", installments: "1" });
    setAddOpen(false);
  };

  const filtered = tab === "entradas" ? transactions.filter(t => t.isIncome) : tab === "saídas" ? transactions.filter(t => !t.isIncome) : transactions;

  const tabs: { label: string; value: Tab }[] = [
    { label: "Resumo", value: "resumo" },
    { label: "Entradas", value: "entradas" },
    { label: "Saídas", value: "saídas" },
    { label: "Orçamento", value: "orçamento" },
  ];

  return (
    <div className="px-4 py-5 max-w-lg mx-auto pb-28">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Finanças</h1>
        <div className="flex gap-2">
          <button onClick={() => setBudgetOpen(true)} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
            <Settings2 className="w-5 h-5 text-muted-foreground" />
          </button>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <button className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center active:scale-95 transition-transform">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader><DialogTitle>Nova transação</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <button onClick={() => setIsIncome(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${!isIncome ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>Saída</button>
                  <button onClick={() => setIsIncome(true)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${isIncome ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>Entrada</button>
                </div>
                <Input placeholder="Descrição" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Valor" type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                  <Input placeholder="Tag" value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v as FinanceCategory }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{FINANCE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={form.bank} onValueChange={v => setForm(p => ({ ...p, bank: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{BANKS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={form.paymentMethod} onValueChange={v => setForm(p => ({ ...p, paymentMethod: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="débito">Débito</SelectItem>
                      <SelectItem value="crédito">Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.paymentMethod === "crédito" && (
                    <Input placeholder="Parcelas" type="number" min="1" value={form.installments} onChange={e => setForm(p => ({ ...p, installments: e.target.value }))} />
                  )}
                </div>
                <button onClick={handleAdd} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">Registrar</button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Balance card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-dark rounded-2xl p-5 text-primary-foreground mb-5"
      >
        <p className="text-sm opacity-80">Saldo disponível este mês</p>
        <p className="text-3xl font-bold mt-1">R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs opacity-70">Receitas</p>
              <p className="text-sm font-semibold">R$ {(monthlyIncome || totalIncome).toLocaleString("pt-BR")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs opacity-70">Despesas</p>
              <p className="text-sm font-semibold">R$ {totalExpenses.toLocaleString("pt-BR")}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-none">
        {tabs.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${tab === t.value ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >{t.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "orçamento" ? (
          <motion.div key="budget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {/* Monthly income config */}
            <div className="rounded-2xl bg-card border border-border/50 p-4 mb-4">
              <p className="text-sm font-semibold mb-2">Renda mensal</p>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">R$</span>
                <Input type="number" value={monthlyIncome || ""} onChange={e => setMonthlyIncome(Number(e.target.value))} placeholder="0" className="text-lg font-bold" />
              </div>
            </div>

            {FINANCE_CATEGORIES.map(cat => {
              const budget = budgets.find(b => b.category === cat);
              const limit = budget?.limit || 0;
              const spent = store.getMonthExpensesByCategory(cat);
              const pct = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
              const isOver80 = pct >= 80;

              return (
                <div key={cat} className={`rounded-2xl bg-card border p-4 ${isOver80 ? "border-destructive/50" : "border-border/50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                      <span className="text-sm font-medium">{cat}</span>
                    </div>
                    <span className={`text-xs font-bold ${isOver80 ? "text-destructive" : "text-muted-foreground"}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted mb-2">
                    <div className={`h-full rounded-full transition-all ${isOver80 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">R$ {spent.toFixed(2)} / R$ {limit.toFixed(2)}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Limite:</span>
                      <input
                        type="number"
                        value={limit || ""}
                        onChange={e => setBudget(cat, Number(e.target.value))}
                        placeholder="0"
                        className="w-20 text-xs text-right p-1 rounded bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  {isOver80 && (
                    <p className="text-xs text-destructive mt-1 font-medium">⚠️ Atenção: orçamento quase esgotado!</p>
                  )}
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <img src={mascotIcon} alt="Astra" className="w-16 h-16 mx-auto mb-3 mascot-img opacity-60" />
                <p className="text-sm text-muted-foreground mb-2">Nenhuma transação ainda</p>
                <button onClick={() => setAddOpen(true)} className="text-sm text-primary font-medium">
                  Registre seu primeiro {tab === "entradas" ? "ganho" : "gasto"} →
                </button>
              </div>
            ) : (
              filtered.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50"
                >
                  <span className="text-lg">{CATEGORY_ICONS[t.category as FinanceCategory] || "📦"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{t.description}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">{t.category}</span>
                      {t.bank && <span className="text-xs text-muted-foreground">• {t.bank}</span>}
                      {t.paymentMethod && <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full text-secondary-foreground">{t.paymentMethod}</span>}
                      <span className="text-xs text-muted-foreground">• {t.date}</span>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${t.isIncome ? "text-accent-foreground" : "text-foreground"}`}>
                    {t.isIncome ? "+" : ""}R$ {Math.abs(t.amount).toLocaleString("pt-BR")}
                  </span>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget settings dialog */}
      <Dialog open={budgetOpen} onOpenChange={setBudgetOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Configurar renda mensal</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">R$</span>
              <Input type="number" value={monthlyIncome || ""} onChange={e => setMonthlyIncome(Number(e.target.value))} placeholder="Sua renda mensal" className="text-lg" />
            </div>
            <p className="text-xs text-muted-foreground">Defina os limites por categoria na aba Orçamento</p>
            <button onClick={() => setBudgetOpen(false)} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold">Salvar</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
