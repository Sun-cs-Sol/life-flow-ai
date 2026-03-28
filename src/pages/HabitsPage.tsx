import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Flame, Plus, X } from "lucide-react";
import { mockHabits, Habit } from "@/data/mockData";
import mascotIcon from "@/assets/mascot-icon.png";

const emojiOptions = ["💧", "🏋️", "📖", "🧘", "😴", "🎯", "🏃", "🎸", "💊", "🧹"];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🎯");
  const done = habits.filter(h => h.done).length;

  const toggle = (id: string) => setHabits(prev => prev.map(h =>
    h.id === id ? { ...h, done: !h.done, streak: h.done ? h.streak - 1 : h.streak + 1 } : h
  ));

  const addHabit = () => {
    if (!newName.trim()) return;
    setHabits(prev => [...prev, { id: `h${Date.now()}`, name: newName.trim(), icon: newIcon, done: false, streak: 0 }]);
    setNewName(""); setNewIcon("🎯"); setShowAdd(false);
  };

  const removeHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Hábitos</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center active:scale-95 transition-transform">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-5">{done} de {habits.length} concluídos hoje</p>

      {/* Add habit */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="mb-4 p-4 rounded-2xl bg-card border border-border/50"
        >
          <input placeholder="Nome do hábito" value={newName} onChange={e => setNewName(e.target.value)}
            className="w-full text-sm p-2.5 rounded-xl bg-muted/50 border border-border/50 outline-none focus:ring-1 focus:ring-primary mb-3" />
          <p className="text-xs text-muted-foreground mb-2">Ícone:</p>
          <div className="flex gap-2 flex-wrap mb-3">
            {emojiOptions.map(e => (
              <button key={e} onClick={() => setNewIcon(e)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors ${newIcon === e ? "bg-primary/10 border border-primary/30" : "bg-muted/50"}`}
              >{e}</button>
            ))}
          </div>
          <button onClick={addHabit} className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium">Criar hábito</button>
        </motion.div>
      )}

      {/* Progress ring */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center mb-6">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
              strokeDasharray={`${habits.length ? (done / habits.length) * 264 : 0} 264`} strokeLinecap="round" className="transition-all duration-700" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{done}/{habits.length}</span>
            <span className="text-[10px] text-muted-foreground">hoje</span>
          </div>
        </div>
      </motion.div>

      {/* Habits list */}
      <div className="space-y-2">
        {habits.map((h, i) => (
          <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors ${h.done ? "bg-primary/5 border-primary/30" : "bg-card border-border/50"}`}
          >
            <button onClick={() => toggle(h.id)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${h.done ? "gradient-primary" : "bg-muted"}`}
            >
              {h.done ? <Check className="w-5 h-5 text-primary-foreground" /> : <span className="text-lg">{h.icon}</span>}
            </button>
            <div className="flex-1">
              <p className={`text-sm font-medium ${h.done ? "text-muted-foreground" : ""}`}>{h.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Flame className="w-3 h-3 text-warning" />
                <span className="text-[10px] text-muted-foreground">{h.streak} dias seguidos</span>
              </div>
            </div>
            {h.done && <span className="text-xs font-medium text-primary">Feito ✓</span>}
            <button onClick={() => removeHabit(h.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-destructive/10">
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
