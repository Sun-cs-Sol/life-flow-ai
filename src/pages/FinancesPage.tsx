import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUpRight, ArrowDownLeft, Settings2, CreditCard, PiggyBank, Landmark, TrendingUp, AlertTriangle, Check, Pencil, Trash2, Pause, ChevronRight } from "lucide-react";
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
  type FixedExpense,
  type CreditCard as CreditCardType,
  type Investment,
} from "@/stores/financesStore";
import mascotIcon from "@/assets/mascot-icon.png";

type Tab = "resumo" | "entradas" | "saídas" | "orçamento" | "fixos" | "carteiras" | "investimentos";

const BANKS = ["Nubank", "Itaú", "Bradesco", "BB", "Caixa", "Inter", "C6"];

export default function FinancesPage() {
  const store = useFinancesStore();
  const { transactions, budgets, monthlyIncome, debitBalance, fixedExpenses, creditCards, investments } = store;
  const [tab, setTab] = useState<Tab>("resumo");
  const [addOpen, setAddOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [isIncome, setIsIncome] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", category: "Alimentação" as FinanceCategory, bank: "Nubank", paymentMethod: "pix" as FinanceTransaction["paymentMethod"], tag: "", installments: "1", creditCardId: "" });

  // Fixed expense form
  const [feOpen, setFeOpen] = useState(false);
  const [editingFe, setEditingFe] = useState<FixedExpense | null>(null);
  const [feForm, setFeForm] = useState({ name: "", amount: "", dueDay: "", category: "Outros" as FinanceCategory, paymentMethod: "débito" as "débito" | "crédito", creditCardId: "" });

  // Credit card form
  const [ccOpen, setCcOpen] = useState(false);
  const [ccForm, setCcForm] = useState({ name: "", totalLimit: "", closingDay: "" });

  // Investment form
  const [invOpen, setInvOpen] = useState(false);
  const [invForm, setInvForm] = useState({ name: "", type: "Renda Fixa" as Investment["type"], amountInvested: "", startDate: "", expectedReturn: "", returnPeriod: "anual" as "mensal" | "anual" });

  const totalExpenses = store.getTotalMonthExpenses();
  const totalIncome = store.getTotalMonthIncome();
  const balance = monthlyIncome > 0 ? monthlyIncome - totalExpenses : totalIncome - totalExpenses;

  useEffect(() => { store.runAutoExpenses(); }, []);

  const handleAdd = () => {
    if (!form.description || !form.amount) return;
    const amt = Number(form.amount);
    const tx: Omit<FinanceTransaction, "id"> = {
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
      creditCardId: form.paymentMethod === "crédito" ? form.creditCardId : undefined,
    };
    store.addTransaction(tx);

    // Auto-debit from balance or card
    if (!isIncome && form.paymentMethod === "débito") {
      store.setDebitBalance(debitBalance - amt);
    } else if (!isIncome && form.paymentMethod === "crédito" && form.creditCardId) {
      store.chargeCreditCard(form.creditCardId, amt);
      const card = creditCards.find(c => c.id === form.creditCardId);
      if (card) {
        const used = card.usedAmount + amt;
        const pct = (used / card.totalLimit) * 100;
        if (pct >= 70) toast.warning(`⚠️ ${card.name}: ${Math.round(pct)}% do limite usado!`);
      }
    }

    if (!isIncome) {
      const budget = budgets.find(b => b.category === form.category);
      if (budget && budget.limit > 0) {
        const spent = store.getMonthExpensesByCategory(form.category);
        const pct = (spent / budget.limit) * 100;
        if (pct >= 80) toast.warning(`⚠️ ${form.category}: ${Math.round(pct)}% do orçamento usado!`);
      }
    }

    toast.success(isIncome ? "Receita registrada!" : "Gasto registrado!");
    setForm({ description: "", amount: "", category: "Alimentação", bank: "Nubank", paymentMethod: "pix", tag: "", installments: "1", creditCardId: "" });
    setAddOpen(false);
  };

  const handleAddFixedExpense = () => {
    if (!feForm.name || !feForm.amount || !feForm.dueDay) return;
    if (editingFe) {
      store.updateFixedExpense(editingFe.id, {
        name: feForm.name, amount: Number(feForm.amount), dueDay: Number(feForm.dueDay),
        category: feForm.category, paymentMethod: feForm.paymentMethod,
        creditCardId: feForm.paymentMethod === "crédito" ? feForm.creditCardId : undefined,
      });
      toast.success("Gasto fixo atualizado!");
    } else {
      store.addFixedExpense({
        name: feForm.name, amount: Number(feForm.amount), dueDay: Number(feForm.dueDay),
        category: feForm.category, paymentMethod: feForm.paymentMethod,
        creditCardId: feForm.paymentMethod === "crédito" ? feForm.creditCardId : undefined,
      });
      toast.success("Gasto fixo cadastrado!");
    }
    setFeForm({ name: "", amount: "", dueDay: "", category: "Outros", paymentMethod: "débito", creditCardId: "" });
    setEditingFe(null);
    setFeOpen(false);
  };

  const handleAddCard = () => {
    if (!ccForm.name || !ccForm.totalLimit || !ccForm.closingDay) return;
    store.addCreditCard({ name: ccForm.name, totalLimit: Number(ccForm.totalLimit), closingDay: Number(ccForm.closingDay) });
    toast.success("Cartão cadastrado!");
    setCcForm({ name: "", totalLimit: "", closingDay: "" });
    setCcOpen(false);
  };

  const handleAddInvestment = () => {
    if (!invForm.name || !invForm.amountInvested || !invForm.startDate) return;
    store.addInvestment({
      name: invForm.name, type: invForm.type, amountInvested: Number(invForm.amountInvested),
      startDate: invForm.startDate, expectedReturn: Number(invForm.expectedReturn), returnPeriod: invForm.returnPeriod,
    });
    toast.success("Investimento cadastrado!");
    setInvForm({ name: "", type: "Renda Fixa", amountInvested: "", startDate: "", expectedReturn: "", returnPeriod: "anual" });
    setInvOpen(false);
  };

  const filtered = tab === "entradas" ? transactions.filter(t => t.isIncome) : tab === "saídas" ? transactions.filter(t => !t.isIncome) : transactions;

  const tabs: { label: string; value: Tab }[] = [
    { label: "Resumo", value: "resumo" },
    { label: "Fixos", value: "fixos" },
    { label: "Carteiras", value: "carteiras" },
    { label: "Investimentos", value: "investimentos" },
    { label: "Orçamento", value: "orçamento" },
  ];

  const upcomingFe = store.getUpcomingFixedExpenses(3);

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
                  <Select value={form.paymentMethod} onValueChange={v => setForm(p => ({ ...p, paymentMethod: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="débito">Débito</SelectItem>
                      <SelectItem value="crédito">Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.paymentMethod === "crédito" && creditCards.length > 0 && (
                  <Select value={form.creditCardId} onValueChange={v => setForm(p => ({ ...p, creditCardId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione o cartão" /></SelectTrigger>
                    <SelectContent>{creditCards.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                )}
                {form.paymentMethod === "crédito" && (
                  <Input placeholder="Parcelas" type="number" min="1" value={form.installments} onChange={e => setForm(p => ({ ...p, installments: e.target.value }))} />
                )}
                <button onClick={handleAdd} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">Registrar</button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Balance card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-dark rounded-2xl p-5 text-primary-foreground mb-5">
        <p className="text-sm opacity-80">Saldo disponível este mês</p>
        <p className="text-3xl font-bold mt-1">R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center"><ArrowDownLeft className="w-4 h-4" /></div>
            <div>
              <p className="text-xs opacity-70">Receitas</p>
              <p className="text-sm font-semibold">R$ {(monthlyIncome || totalIncome).toLocaleString("pt-BR")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center"><ArrowUpRight className="w-4 h-4" /></div>
            <div>
              <p className="text-xs opacity-70">Despesas</p>
              <p className="text-sm font-semibold">R$ {totalExpenses.toLocaleString("pt-BR")}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming fixed expense alerts */}
      {upcomingFe.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-2xl bg-warning/10 border border-warning/30">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-xs font-semibold text-warning-foreground">Vencimentos próximos</span>
          </div>
          {upcomingFe.map(fe => (
            <p key={fe.id} className="text-xs text-muted-foreground">{fe.name} — R$ {fe.amount.toFixed(2)} no dia {fe.dueDay}</p>
          ))}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-none pb-1">
        {tabs.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${tab === t.value ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >{t.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ===== RESUMO ===== */}
        {tab === "resumo" && (
          <motion.div key="resumo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            <div className="flex gap-2 mb-3">
              {(["entradas", "saídas"] as const).map(f => (
                <button key={f} onClick={() => setTab(f === "entradas" ? "resumo" : "resumo")} className="px-3 py-1.5 rounded-full text-xs bg-muted text-muted-foreground">
                  {f === "entradas" ? "Entradas" : "Saídas"}
                </button>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <img src={mascotIcon} alt="Astra" className="w-16 h-16 mx-auto mb-3 mascot-img opacity-60" />
                <p className="text-sm text-muted-foreground mb-2">Nenhuma transação ainda</p>
                <button onClick={() => setAddOpen(true)} className="text-sm text-primary font-medium">Registre seu primeiro gasto →</button>
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
                      {t.paymentMethod && <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full text-secondary-foreground">{t.paymentMethod}</span>}
                      {t.auto && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">auto</span>}
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

        {/* ===== GASTOS FIXOS ===== */}
        {tab === "fixos" && (
          <motion.div key="fixos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="rounded-2xl bg-card border border-border/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total de gastos fixos</p>
                <p className="text-xl font-bold">R$ {store.getTotalFixedExpenses().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>
              <button onClick={() => { setEditingFe(null); setFeForm({ name: "", amount: "", dueDay: "", category: "Outros", paymentMethod: "débito", creditCardId: "" }); setFeOpen(true); }}
                className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            {fixedExpenses.length === 0 ? (
              <div className="text-center py-12">
                <img src={mascotIcon} alt="Astra" className="w-16 h-16 mx-auto mb-3 mascot-img opacity-60" />
                <p className="text-sm text-muted-foreground">Nenhum gasto fixo cadastrado</p>
                <button onClick={() => setFeOpen(true)} className="text-sm text-primary font-medium mt-2">Cadastre o primeiro →</button>
              </div>
            ) : (
              fixedExpenses.map((fe) => (
                <div key={fe.id} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50">
                  <span className="text-lg">{CATEGORY_ICONS[fe.category]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{fe.name}</p>
                    <p className="text-xs text-muted-foreground">Dia {fe.dueDay} • {fe.paymentMethod}{fe.creditCardId ? ` (${creditCards.find(c => c.id === fe.creditCardId)?.name || ""})` : ""}</p>
                  </div>
                  <p className="text-sm font-semibold">R$ {fe.amount.toFixed(2)}</p>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingFe(fe); setFeForm({ name: fe.name, amount: String(fe.amount), dueDay: String(fe.dueDay), category: fe.category, paymentMethod: fe.paymentMethod, creditCardId: fe.creditCardId || "" }); setFeOpen(true); }}
                      className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={() => { store.removeFixedExpense(fe.id); toast.success("Removido!"); }}
                      className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* ===== CARTEIRAS ===== */}
        {tab === "carteiras" && (
          <motion.div key="carteiras" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Debit balance */}
            <div className="rounded-2xl bg-card border border-border/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Landmark className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold">Saldo em Débito</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">R$</span>
                <Input type="number" value={debitBalance || ""} onChange={e => store.setDebitBalance(Number(e.target.value))} placeholder="0.00" className="text-lg font-bold" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Gastos em débito serão descontados automaticamente</p>
            </div>

            {/* Credit cards */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold">Cartões de Crédito</h3>
              </div>
              <button onClick={() => setCcOpen(true)} className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>

            {creditCards.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Nenhum cartão cadastrado</p>
                <button onClick={() => setCcOpen(true)} className="text-sm text-primary font-medium mt-2">Cadastrar cartão →</button>
              </div>
            ) : (
              creditCards.map((card) => {
                const available = store.getCreditCardAvailable(card.id);
                const usedPct = card.totalLimit > 0 ? (card.usedAmount / card.totalLimit) * 100 : 0;
                const isOver70 = usedPct >= 70;
                return (
                  <div key={card.id} className={`rounded-2xl bg-card border p-4 ${isOver70 ? "border-destructive/50" : "border-border/50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold">{card.name}</p>
                      <button onClick={() => { store.removeCreditCard(card.id); toast.success("Cartão removido!"); }}
                        className="p-1 rounded hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>Usado: R$ {card.usedAmount.toFixed(2)}</span>
                      <span>Disponível: R$ {available.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-muted mb-2">
                      <div className={`h-full rounded-full transition-all ${isOver70 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${Math.min(usedPct, 100)}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Limite: R$ {card.totalLimit.toFixed(2)} • Fecha dia {card.closingDay}</span>
                      {isOver70 && <span className="text-xs text-destructive font-medium">⚠️ {Math.round(usedPct)}%</span>}
                    </div>
                    {(card.pendingBill ?? 0) > 0 && !card.billPaid && (
                      <div className="mt-3 p-3 rounded-xl bg-warning/10 border border-warning/30 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-warning-foreground">Fatura a pagar</p>
                          <p className="text-sm font-bold">R$ {(card.pendingBill ?? 0).toFixed(2)}</p>
                        </div>
                        <button onClick={() => { store.payBill(card.id); toast.success("Fatura paga!"); }}
                          className="px-3 py-1.5 rounded-lg gradient-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> Pagar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* ===== INVESTIMENTOS ===== */}
        {tab === "investimentos" && (
          <motion.div key="investimentos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-2xl bg-card border border-border/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total investido</p>
                <p className="text-xl font-bold">R$ {store.getTotalInvested().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-accent-foreground mt-1">
                  Valor estimado: R$ {investments.reduce((s, i) => s + store.getEstimatedInvestmentValue(i), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <button onClick={() => setInvOpen(true)} className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            {/* Distribution by type */}
            {investments.length > 0 && (
              <div className="rounded-2xl bg-card border border-border/50 p-4">
                <p className="text-xs font-semibold mb-3">Distribuição</p>
                {["Renda Fixa", "Renda Variável", "Cripto", "Outro"].map(type => {
                  const total = store.getTotalInvested();
                  const typeTotal = investments.filter(i => i.type === type).reduce((s, i) => s + i.amountInvested, 0);
                  if (typeTotal === 0) return null;
                  const pct = total > 0 ? (typeTotal / total) * 100 : 0;
                  return (
                    <div key={type} className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{type}</span>
                        <span className="font-medium">{pct.toFixed(0)}% — R$ {typeTotal.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {investments.length === 0 ? (
              <div className="text-center py-12">
                <PiggyBank className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-60" />
                <p className="text-sm text-muted-foreground">Nenhum investimento cadastrado</p>
                <button onClick={() => setInvOpen(true)} className="text-sm text-primary font-medium mt-2">Adicionar investimento →</button>
              </div>
            ) : (
              investments.map((inv) => {
                const estimated = store.getEstimatedInvestmentValue(inv);
                const gain = estimated - inv.amountInvested;
                return (
                  <div key={inv.id} className="rounded-2xl bg-card border border-border/50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold">{inv.name}</p>
                        <p className="text-xs text-muted-foreground">{inv.type} • {inv.expectedReturn}% {inv.returnPeriod === "anual" ? "a.a." : "a.m."}</p>
                      </div>
                      <button onClick={() => { store.removeInvestment(inv.id); toast.success("Removido!"); }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Investido: R$ {inv.amountInvested.toFixed(2)}</span>
                      <span className="text-accent-foreground font-medium">
                        <TrendingUp className="w-3 h-3 inline mr-0.5" />
                        Estimado: R$ {estimated.toFixed(2)} ({gain >= 0 ? "+" : ""}R$ {gain.toFixed(2)})
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* ===== ORÇAMENTO ===== */}
        {tab === "orçamento" && (
          <motion.div key="budget" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="rounded-2xl bg-card border border-border/50 p-4 mb-4">
              <p className="text-sm font-semibold mb-2">Renda mensal</p>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">R$</span>
                <Input type="number" value={monthlyIncome || ""} onChange={e => store.setMonthlyIncome(Number(e.target.value))} placeholder="0" className="text-lg font-bold" />
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
                    <span className={`text-xs font-bold ${isOver80 ? "text-destructive" : "text-muted-foreground"}`}>{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted mb-2">
                    <div className={`h-full rounded-full transition-all ${isOver80 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">R$ {spent.toFixed(2)} / R$ {limit.toFixed(2)}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Limite:</span>
                      <input type="number" value={limit || ""} onChange={e => store.setBudget(cat, Number(e.target.value))} placeholder="0"
                        className="w-20 text-xs text-right p-1 rounded bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                  {isOver80 && <p className="text-xs text-destructive mt-1 font-medium">⚠️ Atenção: orçamento quase esgotado!</p>}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DIALOGS ===== */}

      {/* Fixed expense dialog */}
      <Dialog open={feOpen} onOpenChange={setFeOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{editingFe ? "Editar gasto fixo" : "Novo gasto fixo"}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Nome (ex: Netflix)" value={feForm.name} onChange={e => setFeForm(p => ({ ...p, name: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Valor" type="number" value={feForm.amount} onChange={e => setFeForm(p => ({ ...p, amount: e.target.value }))} />
              <Input placeholder="Dia do mês" type="number" min="1" max="31" value={feForm.dueDay} onChange={e => setFeForm(p => ({ ...p, dueDay: e.target.value }))} />
            </div>
            <Select value={feForm.category} onValueChange={v => setFeForm(p => ({ ...p, category: v as FinanceCategory }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FINANCE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={feForm.paymentMethod} onValueChange={v => setFeForm(p => ({ ...p, paymentMethod: v as any }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="débito">Débito</SelectItem>
                <SelectItem value="crédito">Crédito</SelectItem>
              </SelectContent>
            </Select>
            {feForm.paymentMethod === "crédito" && creditCards.length > 0 && (
              <Select value={feForm.creditCardId} onValueChange={v => setFeForm(p => ({ ...p, creditCardId: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o cartão" /></SelectTrigger>
                <SelectContent>{creditCards.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            )}
            <button onClick={handleAddFixedExpense} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">
              {editingFe ? "Salvar" : "Cadastrar"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit card dialog */}
      <Dialog open={ccOpen} onOpenChange={setCcOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Novo cartão de crédito</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Nome do cartão (ex: Nubank)" value={ccForm.name} onChange={e => setCcForm(p => ({ ...p, name: e.target.value }))} />
            <Input placeholder="Limite total" type="number" value={ccForm.totalLimit} onChange={e => setCcForm(p => ({ ...p, totalLimit: e.target.value }))} />
            <Input placeholder="Dia de fechamento" type="number" min="1" max="31" value={ccForm.closingDay} onChange={e => setCcForm(p => ({ ...p, closingDay: e.target.value }))} />
            <button onClick={handleAddCard} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">Cadastrar</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Investment dialog */}
      <Dialog open={invOpen} onOpenChange={setInvOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Novo investimento</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Nome (ex: Tesouro Direto)" value={invForm.name} onChange={e => setInvForm(p => ({ ...p, name: e.target.value }))} />
            <Select value={invForm.type} onValueChange={v => setInvForm(p => ({ ...p, type: v as any }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                <SelectItem value="Renda Variável">Renda Variável</SelectItem>
                <SelectItem value="Cripto">Cripto</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Valor investido" type="number" value={invForm.amountInvested} onChange={e => setInvForm(p => ({ ...p, amountInvested: e.target.value }))} />
            <Input type="date" value={invForm.startDate} onChange={e => setInvForm(p => ({ ...p, startDate: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Rentabilidade (%)" type="number" value={invForm.expectedReturn} onChange={e => setInvForm(p => ({ ...p, expectedReturn: e.target.value }))} />
              <Select value={invForm.returnPeriod} onValueChange={v => setInvForm(p => ({ ...p, returnPeriod: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">% ao mês</SelectItem>
                  <SelectItem value="anual">% ao ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button onClick={handleAddInvestment} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">Cadastrar</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Budget settings dialog */}
      <Dialog open={budgetOpen} onOpenChange={setBudgetOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Configurar renda mensal</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">R$</span>
              <Input type="number" value={monthlyIncome || ""} onChange={e => store.setMonthlyIncome(Number(e.target.value))} placeholder="Sua renda mensal" className="text-lg" />
            </div>
            <p className="text-xs text-muted-foreground">Defina os limites por categoria na aba Orçamento</p>
            <button onClick={() => setBudgetOpen(false)} className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold">Salvar</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
