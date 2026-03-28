import { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, DollarSign, CreditCard, Save, ChevronRight, LogOut, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockProfile, mockFinances } from "@/data/mockData";
import mascotIcon from "@/assets/mascot-icon.png";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(mockProfile);
  const [fixedExpenses, setFixedExpenses] = useState(mockFinances.fixedExpenses);
  const [editing, setEditing] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "", bank: "", dueDay: "" });
  const [showAddExpense, setShowAddExpense] = useState(false);

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    setFixedExpenses(prev => [...prev, {
      id: `f${Date.now()}`,
      name: newExpense.name,
      amount: Number(newExpense.amount),
      bank: newExpense.bank,
      dueDay: Number(newExpense.dueDay) || 1,
    }]);
    setNewExpense({ name: "", amount: "", bank: "", dueDay: "" });
    setShowAddExpense(false);
  };

  const removeExpense = (id: string) => setFixedExpenses(prev => prev.filter(e => e.id !== id));

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Perfil</h1>

      {/* User card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 mb-6"
      >
        <img src={mascotIcon} alt="Astra" className="w-16 h-16 rounded-2xl mascot-img" />
        <div className="flex-1">
          <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            className="font-bold text-lg bg-transparent border-none outline-none w-full" />
          <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
            className="text-sm text-muted-foreground bg-transparent border-none outline-none w-full" />
        </div>
      </motion.div>

      {/* Salary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="p-4 rounded-2xl bg-card border border-border/50 mb-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-accent-foreground" />
          </div>
          <h2 className="font-semibold text-sm">Salário mensal</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">R$</span>
          <input type="number" value={profile.salary} onChange={e => setProfile(p => ({ ...p, salary: Number(e.target.value) }))}
            className="text-2xl font-bold bg-transparent border-none outline-none flex-1" />
        </div>
      </motion.div>

      {/* Address */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl bg-card border border-border/50 mb-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-secondary-foreground" />
          </div>
          <h2 className="font-semibold text-sm">Endereço</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="CEP" value={profile.address.cep} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, cep: e.target.value } }))}
            className="col-span-1 text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
          <input placeholder="Número" value={profile.address.number} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, number: e.target.value } }))}
            className="col-span-1 text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
          <input placeholder="Rua" value={profile.address.street} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, street: e.target.value } }))}
            className="col-span-2 text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
          <input placeholder="Cidade" value={profile.address.city} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, city: e.target.value } }))}
            className="col-span-1 text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
          <input placeholder="Estado" value={profile.address.state} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, state: e.target.value } }))}
            className="col-span-1 text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
        </div>
      </motion.div>

      {/* Fixed expenses */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="p-4 rounded-2xl bg-card border border-border/50 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Despesas fixas</h2>
              <p className="text-[10px] text-muted-foreground">Geram tarefas automáticas todo mês</p>
            </div>
          </div>
          <button onClick={() => setShowAddExpense(!showAddExpense)} className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Plus className="w-4 h-4 text-primary" />
          </button>
        </div>

        {showAddExpense && (
          <div className="mb-3 p-3 rounded-xl bg-muted/30 space-y-2">
            <input placeholder="Nome (ex: Aluguel)" value={newExpense.name} onChange={e => setNewExpense(p => ({ ...p, name: e.target.value }))}
              className="w-full text-sm p-2.5 rounded-xl bg-card border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
            <div className="grid grid-cols-3 gap-2">
              <input placeholder="Valor" type="number" value={newExpense.amount} onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))}
                className="text-sm p-2.5 rounded-xl bg-card border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
              <input placeholder="Banco" value={newExpense.bank} onChange={e => setNewExpense(p => ({ ...p, bank: e.target.value }))}
                className="text-sm p-2.5 rounded-xl bg-card border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
              <input placeholder="Dia" type="number" value={newExpense.dueDay} onChange={e => setNewExpense(p => ({ ...p, dueDay: e.target.value }))}
                className="text-sm p-2.5 rounded-xl bg-card border border-border/50 outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <button onClick={handleAddExpense} className="w-full py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium">Adicionar</button>
          </div>
        )}

        <div className="space-y-2">
          {fixedExpenses.map((e) => (
            <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className="flex-1">
                <p className="text-sm font-medium">{e.name}</p>
                <p className="text-[10px] text-muted-foreground">{e.bank} • Dia {e.dueDay}</p>
              </div>
              <span className="text-sm font-semibold">R$ {e.amount.toFixed(2)}</span>
              <button onClick={() => removeExpense(e.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-destructive/10">
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <button onClick={() => navigate("/")} className="w-full flex items-center justify-center gap-2 mt-2 py-3 rounded-2xl text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors">
        <LogOut className="w-4 h-4" />
        Sair da conta
      </button>
    </div>
  );
}
