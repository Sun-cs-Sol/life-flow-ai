import { useState } from "react";
import { Plus, X, CheckSquare, Wallet, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useFinancesStore, FINANCE_CATEGORIES, type FinanceCategory } from "@/stores/financesStore";

type FABAction = null | "task" | "expense" | "study";

export default function QuickAddFAB() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<FABAction>(null);

  const close = () => { setAction(null); setOpen(false); };

  return (
    <>
      {/* FAB button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full gradient-primary shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        whileTap={{ scale: 0.9 }}
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? <X className="w-6 h-6 text-primary-foreground" /> : <Plus className="w-6 h-6 text-primary-foreground" />}
        </motion.div>
      </motion.button>

      {/* Options */}
      <AnimatePresence>
        {open && !action && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-36 right-4 z-50 flex flex-col gap-3 items-end"
          >
            {[
              { key: "task" as const, icon: CheckSquare, label: "Nova tarefa", color: "bg-primary" },
              { key: "expense" as const, icon: Wallet, label: "Novo gasto", color: "bg-destructive" },
              { key: "study" as const, icon: BookOpen, label: "Nova aula", color: "bg-accent" },
            ].map((item, i) => (
              <motion.button
                key={item.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setAction(item.key)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/50 shadow-md"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-4 h-4 text-primary-foreground" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task dialog */}
      <Dialog open={action === "task"} onOpenChange={() => close()}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Nova tarefa rápida</DialogTitle></DialogHeader>
          <QuickTaskForm onDone={close} />
        </DialogContent>
      </Dialog>

      {/* Expense dialog */}
      <Dialog open={action === "expense"} onOpenChange={() => close()}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Registrar gasto</DialogTitle></DialogHeader>
          <QuickExpenseForm onDone={close} />
        </DialogContent>
      </Dialog>

      {/* Study dialog */}
      <Dialog open={action === "study"} onOpenChange={() => close()}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Novo item de estudo</DialogTitle></DialogHeader>
          <QuickStudyForm onDone={close} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function QuickTaskForm({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("média");

  const submit = () => {
    if (!title.trim()) return;
    // Just show success for now — will integrate with task store later
    toast.success(`Tarefa "${title}" criada!`);
    onDone();
  };

  return (
    <div className="space-y-3 mt-2">
      <Input placeholder="O que precisa fazer?" value={title} onChange={e => setTitle(e.target.value)} />
      <Select value={priority} onValueChange={setPriority}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="alta">Alta prioridade</SelectItem>
          <SelectItem value="média">Média prioridade</SelectItem>
          <SelectItem value="baixa">Baixa prioridade</SelectItem>
        </SelectContent>
      </Select>
      <button onClick={submit} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Criar tarefa</button>
    </div>
  );
}

function QuickExpenseForm({ onDone }: { onDone: () => void }) {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<FinanceCategory>("Alimentação");
  const addTransaction = useFinancesStore(s => s.addTransaction);

  const submit = () => {
    if (!desc.trim() || !amount) return;
    addTransaction({
      description: desc,
      amount: -Math.abs(Number(amount)),
      category,
      date: new Date().toISOString().split("T")[0],
      isIncome: false,
      paymentMethod: "pix",
    });
    toast.success(`Gasto de R$${amount} registrado!`);
    onDone();
  };

  return (
    <div className="space-y-3 mt-2">
      <Input placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} />
      <Input placeholder="Valor (R$)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      <Select value={category} onValueChange={v => setCategory(v as FinanceCategory)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {FINANCE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <button onClick={submit} className="w-full py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold">Registrar gasto</button>
    </div>
  );
}

function QuickStudyForm({ onDone }: { onDone: () => void }) {
  const [topic, setTopic] = useState("");

  const submit = () => {
    if (!topic.trim()) return;
    toast.success(`"${topic}" adicionado aos estudos!`);
    onDone();
  };

  return (
    <div className="space-y-3 mt-2">
      <Input placeholder="O que vai estudar?" value={topic} onChange={e => setTopic(e.target.value)} />
      <button onClick={submit} className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold">Adicionar</button>
    </div>
  );
}
