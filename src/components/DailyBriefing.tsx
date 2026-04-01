import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockTasks, mockHabits } from "@/data/mockData";
import { useFinancesStore } from "@/stores/financesStore";
import mascotIcon from "@/assets/mascot-icon.png";

const MOTIVATIONAL_PHRASES = [
  "Cada pequeno passo conta. Continue assim! 🚀",
  "Você está mais perto do que imagina. 💪",
  "Organização é liberdade. Vamos nessa! ✨",
  "O segredo é consistência, não perfeição. 🎯",
  "Seu futuro eu vai agradecer por esse esforço. 🌟",
  "Hoje é um ótimo dia pra avançar! 🔥",
  "Foco no progresso, não na perfeição. 📈",
  "Você já deu o primeiro passo — isso é o mais difícil! 💫",
  "Lembre-se: descansar também é produtivo. 🧘",
  "Cada tarefa concluída é uma vitória. 🏆",
];

export default function DailyBriefing() {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const todayExpenses = useFinancesStore(s => s.getTodayExpenses());

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastShown = localStorage.getItem("astra-briefing-date");
    if (lastShown !== today) {
      setVisible(true);
      localStorage.setItem("astra-briefing-date", today);
    }
  }, []);

  if (dismissed || !visible) return null;

  const pendingTasks = mockTasks.filter(t => !t.done).length;
  const pendingHabits = mockHabits.filter(h => !h.done).length;
  const phrase = MOTIVATIONAL_PHRASES[new Date().getDate() % MOTIVATIONAL_PHRASES.length];

  const lines: string[] = [];
  if (pendingTasks > 0) lines.push(`📋 ${pendingTasks} tarefa${pendingTasks > 1 ? "s" : ""} pendente${pendingTasks > 1 ? "s" : ""} hoje`);
  if (pendingHabits > 0) lines.push(`🎯 ${pendingHabits} hábito${pendingHabits > 1 ? "s" : ""} por completar`);
  if (todayExpenses > 0) lines.push(`💸 Você já gastou R$${todayExpenses.toFixed(2)} hoje`);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="rounded-2xl gradient-primary p-4 text-primary-foreground relative overflow-hidden"
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <img src={mascotIcon} alt="Astra" className="w-10 h-10 rounded-xl mascot-img" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold">Resumo do dia</span>
            </div>
            {lines.length > 0 ? (
              <ul className="space-y-0.5 mb-2">
                {lines.map((line, i) => (
                  <li key={i} className="text-sm opacity-90">{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm opacity-90 mb-2">Nada pendente por agora! Aproveite o dia 🎉</p>
            )}
            <p className="text-xs opacity-75 italic">{phrase}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
