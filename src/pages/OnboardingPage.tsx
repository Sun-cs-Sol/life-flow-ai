import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Briefcase, Wallet, Heart, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/userStore";
import mascotIcon from "@/assets/mascot-icon.png";

const PRIORITY_OPTIONS = [
  { id: "estudos", label: "Estudos", icon: BookOpen, emoji: "📚" },
  { id: "trabalho", label: "Trabalho", icon: Briefcase, emoji: "💼" },
  { id: "financas", label: "Finanças", icon: Wallet, emoji: "💰" },
  { id: "saude", label: "Saúde mental", icon: Heart, emoji: "🧘" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { setName, setPriorities, setWeeklyGoal, completeOnboarding } = useUserStore();
  const [localName, setLocalName] = useState("");
  const [localPriorities, setLocalPriorities] = useState<string[]>([]);
  const [localGoal, setLocalGoal] = useState("");

  const togglePriority = (id: string) => {
    setLocalPriorities(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      if (!localName.trim()) return;
      setName(localName.trim());
      setStep(2);
    } else if (step === 2) {
      if (localPriorities.length === 0) return;
      setPriorities(localPriorities);
      setStep(3);
    } else {
      setWeeklyGoal(localGoal);
      completeOnboarding();
      navigate("/login");
    }
  };

  const canContinue = () => {
    if (step === 1) return localName.trim().length > 0;
    if (step === 2) return localPriorities.length > 0;
    return true;
  };

  const slides = [
    // Slide 0: Welcome
    <motion.div key="welcome" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center text-center max-w-sm"
    >
      <img src={mascotIcon} alt="Astra mascot" className="mascot-img w-28 h-28 mb-6" />
      <h1 className="text-3xl font-bold leading-tight whitespace-pre-line mb-4">
        {"Sua vida organizada\ncom inteligência"}
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed">
        O Astra entende o que você fala e organiza automaticamente nos módulos certos.
      </p>
    </motion.div>,

    // Slide 1: Name
    <motion.div key="name" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center text-center max-w-sm w-full"
    >
      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Como posso te chamar?</h1>
      <p className="text-muted-foreground text-sm mb-6">Vou personalizar tudo pra você</p>
      <Input
        placeholder="Seu nome"
        value={localName}
        onChange={e => setLocalName(e.target.value)}
        className="text-center text-lg h-14 rounded-2xl"
        autoFocus
      />
    </motion.div>,

    // Slide 2: Priorities
    <motion.div key="priorities" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center text-center max-w-sm w-full"
    >
      <h1 className="text-2xl font-bold mb-2">O que é prioridade agora?</h1>
      <p className="text-muted-foreground text-sm mb-6">Escolha as áreas que precisa organizar</p>
      <div className="grid grid-cols-2 gap-3 w-full">
        {PRIORITY_OPTIONS.map(opt => {
          const selected = localPriorities.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => togglePriority(opt.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                selected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className={`text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>,

    // Slide 3: Goal
    <motion.div key="goal" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
      className="flex flex-col items-center text-center max-w-sm w-full"
    >
      <h1 className="text-2xl font-bold mb-2">Seu primeiro objetivo</h1>
      <p className="text-muted-foreground text-sm mb-6">O que quer conquistar esta semana?</p>
      <Input
        placeholder="Ex: Estudar 2h por dia para a prova"
        value={localGoal}
        onChange={e => setLocalGoal(e.target.value)}
        className="text-center text-base h-14 rounded-2xl"
      />
      <p className="text-xs text-muted-foreground mt-3">Pode pular se quiser — você define depois</p>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {slides[step]}
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-primary" : "w-2 bg-border"}`} />
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={!canContinue()}
          className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {step === 3 ? "Começar agora" : "Continuar"}
          <ArrowRight className="w-5 h-5" />
        </button>
        {step === 0 && (
          <button onClick={() => navigate("/login")} className="w-full mt-3 text-muted-foreground text-sm py-2">
            Pular
          </button>
        )}
      </div>
    </div>
  );
}
